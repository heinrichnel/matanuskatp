import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { PurchaseOrder, POItem } from './PurchaseOrderModal';

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
  poTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#228B22',
  },
  poDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  vendorDetails: {
    width: '50%',
  },
  poInfo: {
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
  statusBadge: {
    padding: 5,
    borderRadius: 3,
    marginLeft: 10,
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#228B22',
  },
  priorityBadge: {
    padding: 5,
    borderRadius: 3,
    marginLeft: 10,
    fontSize: 10,
    color: '#fff',
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    marginTop: 40,
    marginBottom: 5,
  },
});

// Company logo URL
const logoUrl = "https://matanuska.co.zw/wp-content/uploads/2021/06/Matanuska-logo-250px.png";

// Format currency
const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

// Get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return '#dc2626'; // red
    case 'MEDIUM':
      return '#f59e0b'; // amber
    case 'LOW':
      return '#3b82f6'; // blue
    default:
      return '#6b7280'; // gray
  }
};

// Calculate total cost
const calculateTotal = (items: POItem[]) => {
  return items.reduce((sum, item) => sum + item.totalCost, 0);
};

// PDF Document component
const PurchaseOrderPDFDocument: React.FC<{ po: PurchaseOrder }> = ({ po }) => (
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.poTitle}>PURCHASE ORDER</Text>
          <Text style={[styles.statusBadge, { backgroundColor: po.status === 'APPROVED' ? '#16a34a' : '#3b82f6' }]}>
            {po.status}
          </Text>
          <Text style={[styles.priorityBadge, { backgroundColor: getPriorityColor(po.priority) }]}>
            {po.priority} PRIORITY
          </Text>
        </View>

        {/* PO and Vendor Details */}
        <View style={styles.poDetails}>
          <View style={styles.vendorDetails}>
            <Text style={styles.label}>VENDOR:</Text>
            <Text style={styles.value}>{po.vendor}</Text>
            <Text style={styles.value}>{po.address}</Text>
            <Text style={styles.label}>SHIP TO:</Text>
            <Text style={styles.value}>{po.site}</Text>
            <Text style={styles.value}>Attn: {po.recipient}</Text>
          </View>
          <View style={styles.poInfo}>
            <Text style={styles.label}>PO NUMBER:</Text>
            <Text style={styles.value}>{po.poNumber}</Text>
            <Text style={styles.label}>DATE:</Text>
            <Text style={styles.value}>{new Date(po.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.label}>DUE DATE:</Text>
            <Text style={styles.value}>{po.dueDate}</Text>
            <Text style={styles.label}>REQUESTER:</Text>
            <Text style={styles.value}>{po.requester}</Text>
            {po.linkedWorkOrderId && (
              <>
                <Text style={styles.label}>WORK ORDER:</Text>
                <Text style={styles.value}>{po.linkedWorkOrderId}</Text>
              </>
            )}
          </View>
        </View>

        {/* PO Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>SKU</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '35%' }]}>
              <Text>Item Description</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '10%' }]}>
              <Text>Quantity</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '10%' }]}>
              <Text>Unit</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>Unit Cost</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>Total Cost</Text>
            </View>
          </View>

          {/* Table Rows */}
          {po.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text>{item.sku}</Text>
              </View>
              <View style={[styles.tableCol, { width: '35%' }]}>
                <Text>{item.name}</Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text>{item.unit}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text>{formatCurrency(item.unitCost)}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text>{formatCurrency(item.totalCost)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* PO Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryTable}>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(calculateTotal(po.items))}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={styles.label}>NOTES / DESCRIPTION:</Text>
          <Text>{po.description}</Text>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text>Authorized Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text>Date</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is an official purchase order from Matanuska Distribution (Pvt) Ltd.</Text>
          <Text>Please include this PO number on all correspondence, packing lists, and invoices.</Text>
          <Text>For any inquiries regarding this purchase order, please contact our procurement department.</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Component with download link
interface PurchaseOrderPDFProps {
  po: PurchaseOrder;
  fileName?: string;
}

const PurchaseOrderPDF: React.FC<PurchaseOrderPDFProps> = ({ po, fileName }) => {
  const defaultFileName = `PO_${po.poNumber}_${po.vendor.replace(/\s+/g, '_')}.pdf`;

  return (
    <PDFDownloadLink
      document={<PurchaseOrderPDFDocument po={po} />}
      fileName={fileName || defaultFileName}
      className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-2 rounded"
    >
      {({ loading }) => loading ? "Preparing purchase order..." : "Download Purchase Order as PDF"}
    </PDFDownloadLink>
  );
};

export default PurchaseOrderPDF;
