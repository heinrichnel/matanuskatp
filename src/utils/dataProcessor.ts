import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { format, parse, isValid } from 'date-fns';

export class DataProcessor {
  // Process CSV data with validation
  static async processCSV(
    file: File,
    options: {
      delimiter?: string;
      header?: boolean;
      skipEmptyLines?: boolean;
      transform?: (value: string, field: string) => any;
    } = {}
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: options.header ?? true,
        delimiter: options.delimiter ?? ',',
        skipEmptyLines: options.skipEmptyLines ?? true,
        transform: options.transform,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          } else {
            resolve(results.data);
          }
        },
        error: (error) => reject(error)
      });
    });
  }

  // Process Excel data with multiple sheets
  static async processExcel(file: File): Promise<{ [sheetName: string]: any[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const result: { [sheetName: string]: any[] } = {};
          
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            result[sheetName] = jsonData;
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Data validation and cleaning
  static validateAndCleanData(
    data: any[],
    schema: {
      [field: string]: {
        type: 'string' | 'number' | 'date' | 'boolean';
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: RegExp;
        transform?: (value: any) => any;
      };
    }
  ): { valid: any[]; errors: any[] } {
    const valid: any[] = [];
    const errors: any[] = [];

    data.forEach((row, index) => {
      const cleanRow: any = {};
      let hasErrors = false;
      const rowErrors: string[] = [];

      Object.entries(schema).forEach(([field, rules]) => {
        const value = row[field];

        // Check required fields
        if (rules.required && (value === undefined || value === null || value === '')) {
          hasErrors = true;
          rowErrors.push(`${field} is required`);
          return;
        }

        // Skip validation for empty optional fields
        if (!rules.required && (value === undefined || value === null || value === '')) {
          cleanRow[field] = null;
          return;
        }

        // Type validation and conversion
        try {
          switch (rules.type) {
            case 'number':
              const num = Number(value);
              if (isNaN(num)) {
                hasErrors = true;
                rowErrors.push(`${field} must be a number`);
              } else {
                if (rules.min !== undefined && num < rules.min) {
                  hasErrors = true;
                  rowErrors.push(`${field} must be >= ${rules.min}`);
                }
                if (rules.max !== undefined && num > rules.max) {
                  hasErrors = true;
                  rowErrors.push(`${field} must be <= ${rules.max}`);
                }
                cleanRow[field] = num;
              }
              break;

            case 'date':
              const date = new Date(value);
              if (!isValid(date)) {
                hasErrors = true;
                rowErrors.push(`${field} must be a valid date`);
              } else {
                cleanRow[field] = date;
              }
              break;

            case 'boolean':
              cleanRow[field] = Boolean(value);
              break;

            case 'string':
              const str = String(value);
              if (rules.pattern && !rules.pattern.test(str)) {
                hasErrors = true;
                rowErrors.push(`${field} does not match required pattern`);
              } else {
                cleanRow[field] = str;
              }
              break;
          }

          // Apply transformation if specified
          if (rules.transform && !hasErrors) {
            cleanRow[field] = rules.transform(cleanRow[field]);
          }
        } catch (error) {
          hasErrors = true;
          rowErrors.push(`${field} validation error: ${error}`);
        }
      });

      if (hasErrors) {
        errors.push({ row: index + 1, errors: rowErrors, data: row });
      } else {
        valid.push(cleanRow);
      }
    });

    return { valid, errors };
  }

  // Aggregate data for reporting
  static aggregateData(
    data: any[],
    groupBy: string[],
    aggregations: {
      [field: string]: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'first' | 'last';
    }
  ): any[] {
    const groups = new Map<string, any[]>();

    // Group data
    data.forEach(row => {
      const key = groupBy.map(field => row[field]).join('|');
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(row);
    });

    // Apply aggregations
    const result: any[] = [];
    groups.forEach((groupRows, key) => {
      const aggregatedRow: any = {};
      
      // Add groupBy fields
      groupBy.forEach((field, index) => {
        aggregatedRow[field] = key.split('|')[index];
      });

      // Apply aggregations
      Object.entries(aggregations).forEach(([field, operation]) => {
        const values = groupRows.map(row => row[field]).filter(v => v !== null && v !== undefined);
        
        switch (operation) {
          case 'sum':
            aggregatedRow[field] = values.reduce((sum, val) => sum + Number(val), 0);
            break;
          case 'avg':
            aggregatedRow[field] = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
            break;
          case 'count':
            aggregatedRow[field] = values.length;
            break;
          case 'min':
            aggregatedRow[field] = Math.min(...values.map(Number));
            break;
          case 'max':
            aggregatedRow[field] = Math.max(...values.map(Number));
            break;
          case 'first':
            aggregatedRow[field] = values[0];
            break;
          case 'last':
            aggregatedRow[field] = values[values.length - 1];
            break;
        }
      });

      result.push(aggregatedRow);
    });

    return result;
  }

  // Time series data processing
  static processTimeSeriesData(
    data: any[],
    dateField: string,
    valueField: string,
    interval: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ): any[] {
    // Sort by date
    const sortedData = data.sort((a, b) => 
      new Date(a[dateField]).getTime() - new Date(b[dateField]).getTime()
    );

    // Group by interval
    const groups = new Map<string, any[]>();
    
    sortedData.forEach(row => {
      const date = new Date(row[dateField]);
      let key: string;
      
      switch (interval) {
        case 'daily':
          key = format(date, 'yyyy-MM-dd');
          break;
        case 'weekly':
          key = format(date, 'yyyy-ww');
          break;
        case 'monthly':
          key = format(date, 'yyyy-MM');
          break;
        case 'yearly':
          key = format(date, 'yyyy');
          break;
      }
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(row);
    });

    // Aggregate values
    const result: any[] = [];
    groups.forEach((groupRows, key) => {
      const sum = groupRows.reduce((total, row) => total + Number(row[valueField]), 0);
      const avg = sum / groupRows.length;
      
      result.push({
        period: key,
        sum,
        average: avg,
        count: groupRows.length,
        min: Math.min(...groupRows.map(row => Number(row[valueField]))),
        max: Math.max(...groupRows.map(row => Number(row[valueField])))
      });
    });

    return result;
  }
}