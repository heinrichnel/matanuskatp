import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export class ReportGenerator {
  // Generate high-quality PDF report
  static async generatePDFReport(
    elementId: string,
    filename: string,
    options: {
      format?: 'a4' | 'letter' | 'legal';
      orientation?: 'portrait' | 'landscape';
      quality?: number;
      scale?: number;
    } = {}
  ): Promise<void> {
    const {
      format = 'a4',
      orientation = 'portrait',
      quality = 2,
      scale = 2
    } = options;

    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element with id "${elementId}" not found`);

    // High-quality canvas capture
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      removeContainer: true
    });

    const imgData = canvas.toDataURL('image/png', quality);
    const pdf = new jsPDF(orientation, 'mm', format);

    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Center the image
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    pdf.save(filename);
  }

  // Generate Excel report with multiple sheets
  static generateExcelReport(
    data: { [sheetName: string]: any[] },
    filename: string,
    options: {
      formatting?: boolean;
      charts?: boolean;
      filters?: boolean;
    } = {}
  ): void {
    const workbook = XLSX.utils.book_new();

    Object.entries(data).forEach(([sheetName, sheetData]) => {
      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      
      // Apply formatting if requested
      if (options.formatting) {
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
        
        // Style headers
        for (let col = range.s.c; col <= range.e.c; col++) {
          const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: col })];
          if (headerCell) {
            headerCell.s = {
              font: { bold: true, color: { rgb: 'FFFFFF' } },
              fill: { fgColor: { rgb: '366092' } },
              alignment: { horizontal: 'center' }
            };
          }
        }
      }

      // Add filters if requested
      if (options.filters) {
        worksheet['!autofilter'] = { ref: worksheet['!ref'] || 'A1:A1' };
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // Generate and save file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }

  // Generate CSV report
  static generateCSVReport(data: any[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  // Generate comprehensive financial report
  static async generateFinancialReport(
    financialData: {
      income: any[];
      balance: any[];
      cashflow: any[];
      ratios: any[];
      charts: string[];
    },
    filename: string
  ): Promise<void> {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    // Title page
    pdf.setFontSize(24);
    pdf.text('Financial Report', 105, 50, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 70, { align: 'center' });
    
    // Add charts
    for (let i = 0; i < financialData.charts.length; i++) {
      pdf.addPage();
      const element = document.getElementById(financialData.charts[i]);
      if (element) {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 120);
      }
    }
    
    pdf.save(filename);
  }
}