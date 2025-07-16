import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { 
  AlertTriangle, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  Search,
  Droplet,
  CreditCard,
  DollarSign,
  ArrowRightLeft,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { DieselConsumptionRecord } from '../../types';
import { parse } from 'papaparse';

interface FuelTransaction {
  id: string;
  transactionDate: string;
  cardNumber: string;
  fleetNumber: string;
  driverName: string;
  fuelStation: string;
  litres: number;
  unitPrice: number;
  totalAmount: number;
  currency: 'ZAR' | 'USD';
  odometer?: number;
  status: 'reconciled' | 'unmatched' | 'pending';
  matchedRecordId?: string;
}

interface ReconciliationSummary {
  totalTransactions: number;
  totalLitres: number;
  totalAmount: number;
  reconciled: number;
  unmatched: number;
  pending: number;
  differenceAmount: number;
}

const FuelReconciliationTab: React.FC = () => {
  const { dieselRecords } = useAppContext();
  const [fuelTransactions, setFuelTransactions] = useState<FuelTransaction[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [summary, setSummary] = useState<ReconciliationSummary>({
    totalTransactions: 0,
    totalLitres: 0,
    totalAmount: 0,
    reconciled: 0,
    unmatched: 0,
    pending: 0,
    differenceAmount: 0
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Parse CSV and import transactions
  const handleImportTransactions = () => {
    if (!file) return;
    setIsProcessing(true);

    // Read the file
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // Parse CSV
        parse(event.target.result as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              // Map CSV data to FuelTransaction objects
              const transactions: FuelTransaction[] = results.data.map((row: any, index: number) => ({
                id: `transaction-${Date.now()}-${index}`,
                transactionDate: row.TransactionDate || row.Date || new Date().toISOString().split('T')[0],
                cardNumber: row.CardNumber || row.Card || '',
                fleetNumber: row.FleetNumber || row.Fleet || '',
                driverName: row.DriverName || row.Driver || '',
                fuelStation: row.FuelStation || row.Station || '',
                litres: parseFloat(row.Litres || row.Volume || '0'),
                unitPrice: parseFloat(row.UnitPrice || row.Price || '0'),
                totalAmount: parseFloat(row.TotalAmount || row.Amount || '0'),
                currency: (row.Currency || 'ZAR').toUpperCase() === 'USD' ? 'USD' : 'ZAR',
                odometer: row.Odometer ? parseFloat(row.Odometer) : undefined,
                status: 'pending'
              }));

              setFuelTransactions(transactions);
              
              // Calculate summary
              const total = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
              const totalLitres = transactions.reduce((sum, t) => sum + t.litres, 0);
              
              setSummary({
                totalTransactions: transactions.length,
                totalLitres: totalLitres,
                totalAmount: total,
                reconciled: 0,
                unmatched: transactions.length,
                pending: 0,
                differenceAmount: total // Initially, all is difference
              });

              setIsProcessing(false);
              alert(`Successfully imported ${transactions.length} fuel transactions.`);
            } catch (error) {
              console.error('Error parsing CSV:', error);
              setIsProcessing(false);
              alert('Failed to parse CSV file. Please check the format and try again.');
            }
          },
          error: (error: any) => {
            console.error('Error parsing CSV:', error);
            setIsProcessing(false);
            alert('Failed to parse CSV file. Please check the format and try again.');
          }
        });
      }
    };
    reader.readAsText(file);
  };

  // Perform automatic reconciliation
  const handleAutoReconcile = () => {
    if (fuelTransactions.length === 0) return;
    setIsReconciling(true);

    // Create a copy of transactions
    const updatedTransactions = [...fuelTransactions];
    let reconciledCount = 0;
    let unmatchedCount = 0;
    
    // Try to match each transaction with a diesel record
    updatedTransactions.forEach((transaction, index) => {
      // Find matching diesel records based on various criteria
      const potentialMatches = dieselRecords.filter(record => {
        // Match by date and approximate litres (within 5%)
        const dateMatch = record.date === transaction.transactionDate;
        const litresDiff = Math.abs(record.litresFilled - transaction.litres);
        const litresMatch = litresDiff < Math.max(5, transaction.litres * 0.05); // 5L or 5% tolerance
        
        // Match by fleet number if available
        const fleetMatch = !transaction.fleetNumber || 
                           record.fleetNumber === transaction.fleetNumber;
        
        // Match by driver if available
        const driverMatch = !transaction.driverName || 
                           record.driverName.toLowerCase().includes(transaction.driverName.toLowerCase()) ||
                           transaction.driverName.toLowerCase().includes(record.driverName.toLowerCase());
        
        return dateMatch && litresMatch && fleetMatch && driverMatch;
      });

      if (potentialMatches.length === 1) {
        // Exact single match found
        updatedTransactions[index].status = 'reconciled';
        updatedTransactions[index].matchedRecordId = potentialMatches[0].id;
        reconciledCount++;
      } else if (potentialMatches.length > 1) {
        // Multiple potential matches - mark as pending for manual reconciliation
        updatedTransactions[index].status = 'pending';
      } else {
        // No matches found
        updatedTransactions[index].status = 'unmatched';
        unmatchedCount++;
      }
    });

    setFuelTransactions(updatedTransactions);
    
    // Update summary
    const total = updatedTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const reconciledTotal = updatedTransactions
      .filter(t => t.status === 'reconciled')
      .reduce((sum, t) => sum + t.totalAmount, 0);
    
    setSummary({
      ...summary,
      reconciled: reconciledCount,
      unmatched: unmatchedCount,
      pending: updatedTransactions.length - reconciledCount - unmatchedCount,
      differenceAmount: total - reconciledTotal
    });
    
    setIsReconciling(false);
    
    alert(`Auto-reconciliation complete: ${reconciledCount} transactions reconciled, ${unmatchedCount} unmatched.`);
  };

  // Download reconciliation report
  const handleDownloadReport = () => {
    if (fuelTransactions.length === 0) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "TransactionDate,FleetNumber,Driver,FuelStation,Litres,TotalAmount,Currency,Status,MatchedRecordId\n";
    
    fuelTransactions.forEach(transaction => {
      csvContent += `${transaction.transactionDate},${transaction.fleetNumber},${transaction.driverName},${transaction.fuelStation},${transaction.litres},${transaction.totalAmount},${transaction.currency},${transaction.status},${transaction.matchedRecordId || ''}\n`;
    });
    
    // Create a download link and click it
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fuel-reconciliation-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter transactions
  const filteredTransactions = fuelTransactions.filter(transaction => {
    // Apply status filter
    if (filter !== 'all' && transaction.status !== filter) return false;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return transaction.fleetNumber.toLowerCase().includes(term) ||
             transaction.driverName.toLowerCase().includes(term) ||
             transaction.fuelStation.toLowerCase().includes(term);
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fuel Card Reconciliation</h2>
          <p className="text-gray-600">Match fuel card transactions with diesel consumption records</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleDownloadReport}
            disabled={fuelTransactions.length === 0}
            icon={<Download className="w-4 h-4" />}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* File Import Section */}
      <Card>
        <CardHeader title="Import Fuel Card Transactions" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">CSV Import Instructions</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Import your fuel card transaction data from a CSV file. The file should include the following columns:
                    </p>
                    <ul className="text-xs text-blue-700 list-disc list-inside mt-1">
                      <li>TransactionDate (YYYY-MM-DD)</li>
                      <li>CardNumber</li>
                      <li>FleetNumber</li>
                      <li>DriverName</li>
                      <li>FuelStation</li>
                      <li>Litres</li>
                      <li>UnitPrice</li>
                      <li>TotalAmount</li>
                      <li>Currency</li>
                      <li>Odometer (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Fuel Card Transaction File
              </label>
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                <Button
                  onClick={handleImportTransactions}
                  disabled={!file || isProcessing}
                  isLoading={isProcessing}
                  icon={<Upload className="w-4 h-4" />}
                >
                  Import
                </Button>
              </div>
              
              <div className="mt-4">
                <Button
                  onClick={handleAutoReconcile}
                  disabled={fuelTransactions.length === 0 || isReconciling}
                  isLoading={isReconciling}
                  className="w-full"
                  icon={<ArrowRightLeft className="w-4 h-4" />}
                >
                  Auto-Reconcile Transactions
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Reconciliation Summary</h4>
              {fuelTransactions.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <CreditCard className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No transactions imported yet</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600">Total Transactions</p>
                      <p className="text-lg font-bold text-blue-800">{summary.totalTransactions}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600">Total Amount</p>
                      <p className="text-lg font-bold text-blue-800">{formatCurrency(summary.totalAmount, 'ZAR')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-xs text-green-700">Reconciled</p>
                      <p className="text-md font-bold text-green-800">{summary.reconciled}</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-2 rounded">
                      <p className="text-xs text-yellow-700">Pending</p>
                      <p className="text-md font-bold text-yellow-800">{summary.pending}</p>
                    </div>
                    
                    <div className="bg-red-50 p-2 rounded">
                      <p className="text-xs text-red-700">Unmatched</p>
                      <p className="text-md font-bold text-red-800">{summary.unmatched}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-700">Difference:</p>
                      <p className={`text-sm font-medium ${summary.differenceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(Math.abs(summary.differenceAmount), 'ZAR')}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <Clock className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">
                        Last reconciliation: {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      {fuelTransactions.length > 0 && (
        <Card>
          <CardHeader title="Fuel Card Transactions" />
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <select
                className="border border-gray-300 rounded-md px-3 py-2 min-w-40"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="reconciled">Reconciled</option>
                <option value="pending">Pending</option>
                <option value="unmatched">Unmatched</option>
              </select>
            </div>
            
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No transactions match your current filter criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fleet / Card
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Station
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Litres
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.transactionDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{transaction.fleetNumber}</div>
                          <div className="text-xs text-gray-500">Card: {transaction.cardNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.driverName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.fuelStation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {transaction.litres.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(transaction.totalAmount, transaction.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                            transaction.status === 'reconciled' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              // This would show a detailed view in a real application
                              alert(`View details for transaction: ${transaction.id}`);
                            }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reconciliation Guide */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-800 mb-3">Fuel Reconciliation Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">How Reconciliation Works</h4>
            <ol className="list-decimal list-inside text-sm text-green-600 space-y-1">
              <li>Import fuel card transactions from your provider</li>
              <li>System automatically matches transactions to diesel records</li>
              <li>Review and manually match any pending transactions</li>
              <li>Identify and investigate any unmatched transactions</li>
              <li>Export reconciliation report for accounting purposes</li>
            </ol>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">Benefits</h4>
            <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
              <li>Ensure all fuel transactions are properly recorded</li>
              <li>Identify missing diesel records</li>
              <li>Detect potential fuel theft or misuse</li>
              <li>Improve accuracy of financial reporting</li>
              <li>Streamline accounting and expense tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelReconciliationTab;