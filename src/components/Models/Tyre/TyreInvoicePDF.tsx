import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// Define the interface for a tyre invoice item
export interface TyreInvoiceItem {
  id: string;
  description: string;
  tyreSize: string;
  brand: string;
  serialNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Define the interface for a tyre invoice
export interface TyreInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerAddress: string;
  customerEmail?: string;
  customerPhone?: string;
  items: TyreInvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  paymentMethod?: string;
}

// Custom styles for the PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  letterhead: {
    position: 'absolute',
    top: 0,
    left: 40,
    right: 40,
    height: 80,
    borderBottom: '2px solid #228B22', // Matanuska green color
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 40,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 10,
    color: '#555',
  },
  content: {
    marginTop: 100,
    paddingTop: 20,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#228B22',
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  customerDetails: {
    width: '50%',
  },
  invoiceInfo: {
    width: '40%',
    textAlign: 'right',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    marginBottom: 10,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    backgroundColor: '#f0f0f0',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryTable: {
    width: '40%',
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
    padding: 5,
  },
  summaryLabel: {
    width: '60%',
    textAlign: 'right',
    paddingRight: 10,
  },
  summaryValue: {
    width: '40%',
    textAlign: 'right',
  },
  totalRow: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#bfbfbf',
    borderTopStyle: 'solid',
    paddingTop: 10,
    fontSize: 10,
    color: '#555',
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});

// Company logo URL
const logoUrl = "https://matanuska.co.zw/wp-content/uploads/2021/06/Matanuska-logo-250px.png";

// Format currency
const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

// PDF Document component
const TyreInvoicePDFDocument: React.FC<{ invoice: TyreInvoice }> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Letterhead/Header */}
      <View style={styles.letterhead}>
        <Image style={styles.logo} src={logoUrl} />
        <View style={styles.companyInfo}>
          <Text>Matanuska Distribution (Pvt) Ltd</Text>
          <Text>1 Abercorn Street, Harare, Zimbabwe</Text>
          <Text>https://matanuska.co.zw/</Text>
          <Text>TEL: 780681 / 755102 / 793018</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.invoiceTitle}>TYRE INVOICE</Text>

        {/* Invoice and Customer Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.customerDetails}>
            <Text style={styles.label}>BILL TO:</Text>
            <Text style={styles.value}>{invoice.customerName}</Text>
            <Text style={styles.value}>{invoice.customerAddress}</Text>
            {invoice.customerEmail && <Text style={styles.value}>Email: {invoice.customerEmail}</Text>}
            {invoice.customerPhone && <Text style={styles.value}>Phone: {invoice.customerPhone}</Text>}
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.label}>INVOICE #:</Text>
            <Text style={styles.value}>{invoice.invoiceNumber}</Text>
            <Text style={styles.label}>DATE:</Text>
            <Text style={styles.value}>{invoice.date}</Text>
            <Text style={styles.label}>DUE DATE:</Text>
            <Text style={styles.value}>{invoice.dueDate}</Text>
          </View>
        </View>

        {/* Invoice Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableColHeader, { width: '30%' }]}>
              <Text>Description</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>Tyre Size</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>Brand</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>Serial #</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '5%' }]}>
              <Text>Qty</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '10%' }]}>
              <Text>Unit Price</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '10%' }]}>
              <Text>Amount</Text>
            </View>
          </View>

          {/* Table Rows */}
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text>{item.description}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text>{item.tyreSize}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text>{item.brand}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text>{item.serialNumber}</Text>
              </View>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text>{formatCurrency(item.unitPrice)}</Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text>{formatCurrency(item.totalPrice)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Invoice Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(invoice.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax ({invoice.taxRate}%):</Text>
              <Text style={styles.summaryValue}>{formatCurrency(invoice.taxAmount)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Terms */}
        {invoice.paymentTerms && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>PAYMENT TERMS:</Text>
            <Text>{invoice.paymentTerms}</Text>
          </View>
        )}

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.label}>NOTES:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>For any inquiries regarding this invoice, please contact our accounts department.</Text>
          {invoice.paymentMethod && <Text>Payment Method: {invoice.paymentMethod}</Text>}
        </View>
      </View>
    </Page>
  </Document>
);

// Component with download link
interface TyreInvoicePDFProps {
  invoice: TyreInvoice;
  fileName?: string;
}

const TyreInvoicePDF: React.FC<TyreInvoicePDFProps> = ({ invoice, fileName = "tyre_invoice.pdf" }) => {
  return (
    <PDFDownloadLink
      document={<TyreInvoicePDFDocument invoice={invoice} />}
      fileName={fileName}
      className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-2 rounded"
    >
      {({ loading }) => loading ? "Preparing invoice..." : "Download Tyre Invoice as PDF"}
    </PDFDownloadLink>
  );
};

export default TyreInvoicePDF;
