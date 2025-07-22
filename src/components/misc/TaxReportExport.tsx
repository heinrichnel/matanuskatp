import React, { useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define interfaces for the component
interface Invoice {
  id: string;
  invoiceNumber: string;
  dateIssued: Timestamp;
  datePaid?: Timestamp;
  clientId: string;
  clientName: string;
  totalAmount: number;
  taxAmount: number;
  taxRate: number;
  items: InvoiceItem[];
  status: 'paid' | 'pending' | 'overdue';
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
  taxAmount: number;
}

interface TaxReport {
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalTaxCollected: number;
  invoices: Invoice[];
}

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 40,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 16,
    marginBottom: 10,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    width: '70%',
  },
  summaryValue: {
    width: '30%',
    textAlign: 'right',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    fontSize: 10,
  },
  colInvoiceNumber: { width: '20%' },
  colDate: { width: '20%' },
  colClient: { width: '20%' },
  colAmount: { width: '20%' },
  colTax: { width: '20%' },
});

// Define PDF Document component
const TaxReportPDF = ({ report }: { report: TaxReport }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Tax Report</Text>
      <Text style={styles.subheader}>
        {report.startDate.toLocaleDateString()} - {report.endDate.toLocaleDateString()}
      </Text>

      <View style={styles.summaryContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.subheader}>Summary</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Revenue:</Text>
          <Text style={styles.summaryValue}>${report.totalRevenue.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Tax Collected:</Text>
          <Text style={styles.summaryValue}>${report.totalTaxCollected.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Number of Invoices:</Text>
          <Text style={styles.summaryValue}>{report.invoices.length}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.colInvoiceNumber]}>Invoice #</Text>
          <Text style={[styles.tableCell, styles.colDate]}>Date</Text>
          <Text style={[styles.tableCell, styles.colClient]}>Client</Text>
          <Text style={[styles.tableCell, styles.colAmount]}>Amount</Text>
          <Text style={[styles.tableCell, styles.colTax]}>Tax</Text>
        </View>

        {report.invoices.map((invoice) => (
          <View key={invoice.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colInvoiceNumber]}>{invoice.invoiceNumber}</Text>
            <Text style={[styles.tableCell, styles.colDate]}>
              {invoice.dateIssued.toDate().toLocaleDateString()}
            </Text>
            <Text style={[styles.tableCell, styles.colClient]}>{invoice.clientName}</Text>
            <Text style={[styles.tableCell, styles.colAmount]}>${invoice.totalAmount.toFixed(2)}</Text>
            <Text style={[styles.tableCell, styles.colTax]}>${invoice.taxAmount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subheader}>Tax Rate Breakdown</Text>
      {/* Group by tax rate and show totals */}
      {Object.entries(
        report.invoices.reduce((acc: Record<string, { amount: number; tax: number }>, invoice) => {
          const rateKey = `${(invoice.taxRate * 100).toFixed(1)}%`;
          if (!acc[rateKey]) {
            acc[rateKey] = { amount: 0, tax: 0 };
          }
          acc[rateKey].amount += invoice.totalAmount - invoice.taxAmount;
          acc[rateKey].tax += invoice.taxAmount;
          return acc;
        }, {})
      ).map(([rate, { amount, tax }]) => (
        <View key={rate} style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Rate {rate}:</Text>
          <Text style={styles.summaryValue}>
            Base: ${amount.toFixed(2)} | Tax: ${tax.toFixed(2)}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

const TaxReportExport: React.FC = () => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    endDate: new Date(), // Today
  });
  
  const [taxReport, setTaxReport] = useState<TaxReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch invoices based on date range
  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);

    try {
      const startTimestamp = Timestamp.fromDate(dateRange.startDate);
      const endTimestamp = Timestamp.fromDate(dateRange.endDate);
      
      const q = query(
        collection(db, 'invoices'),
        where('dateIssued', '>=', startTimestamp),
        where('dateIssued', '<=', endTimestamp)
      );

      const querySnapshot = await getDocs(q);
      
      const invoices: Invoice[] = [];
      let totalRevenue = 0;
      let totalTaxCollected = 0;

      querySnapshot.forEach((doc) => {
        const invoiceData = { id: doc.id, ...doc.data() } as Invoice;
        invoices.push(invoiceData);
        totalRevenue += invoiceData.totalAmount;
        totalTaxCollected += invoiceData.taxAmount;
      });

      const report: TaxReport = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        totalRevenue,
        totalTaxCollected,
        invoices,
      };

      setTaxReport(report);
    } catch (err) {
      console.error('Error fetching invoices for tax report:', err);
      setError('Failed to fetch invoice data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Tax Report Export</h1>
      
      <form onSubmit={handleGenerateReport} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: new Date(e.target.value) })
              }
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: new Date(e.target.value) })
              }
              required
            />
          </div>
        </div>
        
        <div className="flex justify-start">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Tax Report'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {taxReport && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tax Report Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Period</p>
              <p className="font-medium">
                {taxReport.startDate.toLocaleDateString()} - {taxReport.endDate.toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="font-medium">${taxReport.totalRevenue.toFixed(2)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Total Tax Collected</p>
              <p className="font-medium">${taxReport.totalTaxCollected.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Invoice Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxReport.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.dateIssued.toDate().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${invoice.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${invoice.taxAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end">
            <PDFDownloadLink
              document={<TaxReportPDF report={taxReport} />}
              fileName={`tax_report_${taxReport.startDate.toISOString().split('T')[0]}_${
                taxReport.endDate.toISOString().split('T')[0]
              }.pdf`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {({ loading }: { loading: boolean }) => (loading ? 'Preparing PDF...' : 'Download PDF Report')}
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxReportExport;
