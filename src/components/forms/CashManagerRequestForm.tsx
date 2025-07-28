import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';
import {
  CashManagerFormData,
  ZimbabweSupplierItem,
  ZimbabwePettyCashItem,
  DieselItem,
  SouthAfricaItem,
  DEFAULT_PETTY_CASH_ITEMS
} from '../../types/cashManagerTypes';
import { Button } from '../ui/Button';
import ZimbabweExpensesForm from './ZimbabweExpensesForm';
import DieselExpensesForm from './DieselExpensesForm';
import SouthAfricaExpensesForm from './SouthAfricaExpensesForm';

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const CashManagerRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<CashManagerFormData>({
    date: new Date().toISOString().split('T')[0],
    zimbabweSupplierItems: [
      { id: uuidv4(), supplier: '', description: '', ir: '', usd: null }
    ],
    zimbabwePettyCashItems: [...DEFAULT_PETTY_CASH_ITEMS],
    dieselItems: [
      { id: uuidv4(), supplier: '', qty: null, price: null, total: null }
    ],
    southAfricaItems: [
      { id: uuidv4(), supplier: '', description: '', ir: '', zar: null }
    ],
    totalUSD: 0,
    totalZAR: 0
  });

  // Calculate totals whenever form data changes
  useEffect(() => {
    calculateTotals();
  }, [
    formData.zimbabweSupplierItems,
    formData.zimbabwePettyCashItems,
    formData.dieselItems,
    formData.southAfricaItems
  ]);

  // Calculate USD and ZAR totals
  const calculateTotals = () => {
    // Calculate Zimbabwe USD total
    const zimbabweSupplierTotal = formData.zimbabweSupplierItems.reduce(
      (sum, item) => sum + (item.usd || 0),
      0
    );

    const pettyCashTotal = formData.zimbabwePettyCashItems.reduce(
      (sum, item) => sum + (item.usd || 0),
      0
    );

    // Calculate Diesel total (already included in Zimbabwe total)
    const dieselTotal = formData.dieselItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );

    // Calculate South Africa ZAR total
    const southAfricaTotal = formData.southAfricaItems.reduce(
      (sum, item) => sum + (item.zar || 0),
      0
    );

    setFormData(prev => ({
      ...prev,
      totalUSD: zimbabweSupplierTotal + pettyCashTotal + dieselTotal,
      totalZAR: southAfricaTotal
    }));
  };

  // Add a new Zimbabwe supplier item
  const addZimbabweSupplierItem = () => {
    setFormData(prev => ({
      ...prev,
      zimbabweSupplierItems: [
        ...prev.zimbabweSupplierItems,
        { id: uuidv4(), supplier: '', description: '', ir: '', usd: null }
      ]
    }));
  };

  // Remove a Zimbabwe supplier item
  const removeZimbabweSupplierItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      zimbabweSupplierItems: prev.zimbabweSupplierItems.filter(item => item.id !== id)
    }));
  };

  // Update a Zimbabwe supplier item
  const updateZimbabweSupplierItem = (id: string, field: keyof ZimbabweSupplierItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      zimbabweSupplierItems: prev.zimbabweSupplierItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Update a Zimbabwe petty cash item
  const updateZimbabwePettyCashItem = (id: string, field: keyof ZimbabwePettyCashItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      zimbabwePettyCashItems: prev.zimbabwePettyCashItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add a new diesel item
  const addDieselItem = () => {
    setFormData(prev => ({
      ...prev,
      dieselItems: [
        ...prev.dieselItems,
        { id: uuidv4(), supplier: '', qty: null, price: null, total: null }
      ]
    }));
  };

  // Remove a diesel item
  const removeDieselItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      dieselItems: prev.dieselItems.filter(item => item.id !== id)
    }));
  };

  // Update a diesel item
  const updateDieselItem = (id: string, field: keyof DieselItem, value: any) => {
    setFormData(prev => {
      const updatedItems = prev.dieselItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // If qty or price is updated, recalculate total
          if (field === 'qty' || field === 'price') {
            const qty = field === 'qty' ? value : item.qty;
            const price = field === 'price' ? value : item.price;

            if (qty !== null && price !== null) {
              updatedItem.total = qty * price;
            }
          }

          return updatedItem;
        }
        return item;
      });

      return {
        ...prev,
        dieselItems: updatedItems
      };
    });
  };

  // Add a new South Africa item
  const addSouthAfricaItem = () => {
    setFormData(prev => ({
      ...prev,
      southAfricaItems: [
        ...prev.southAfricaItems,
        { id: uuidv4(), supplier: '', description: '', ir: '', zar: null }
      ]
    }));
  };

  // Remove a South Africa item
  const removeSouthAfricaItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      southAfricaItems: prev.southAfricaItems.filter(item => item.id !== id)
    }));
  };

  // Update a South Africa item
  const updateSouthAfricaItem = (id: string, field: keyof SouthAfricaItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      southAfricaItems: prev.southAfricaItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set font for the entire document
    doc.setFont('helvetica');

    // Add title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('CASH MANAGER REQUEST FORM', 105, 15, { align: 'center' });

    // Add date
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(formData.date).toLocaleDateString()}`, 20, 25);

    // Add Zimbabwe section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('ZIMBABWE', 105, 35, { align: 'center' });

    // Zimbabwe supplier table
    doc.autoTable({
      startY: 40,
      head: [['Supplier', 'Description', 'IR', 'USD']],
      body: formData.zimbabweSupplierItems.map(item => [
        item.supplier || '',
        item.description || '',
        item.ir || '',
        item.usd !== null ? `$${item.usd.toFixed(2)}` : ''
      ]),
      theme: 'grid',
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      styles: { fontSize: 9 }
    });

    // Get the Y position after the table
    const finalY1 = (doc as any).lastAutoTable.finalY || 60;

    // Zimbabwe petty cash table
    doc.autoTable({
      startY: finalY1 + 10,
      body: formData.zimbabwePettyCashItems.map(item => [
        item.description || '',
        item.usd !== null ? `$${item.usd.toFixed(2)}` : ''
      ]),
      theme: 'grid',
      styles: { fontSize: 9 }
    });

    // Get the Y position after the table
    const finalY2 = (doc as any).lastAutoTable.finalY || 80;

    // Add Diesel section
    doc.setFontSize(14);
    doc.text('DIESEL', 105, finalY2 + 10, { align: 'center' });

    // Diesel table
    doc.autoTable({
      startY: finalY2 + 15,
      head: [['Supplier', 'QTY', 'PRIZE', 'TOTAL']],
      body: formData.dieselItems.map(item => [
        item.supplier || '',
        item.qty !== null ? item.qty.toString() : '',
        item.price !== null ? item.price.toFixed(3) : '',
        item.total !== null ? `$${item.total.toFixed(2)}` : ''
      ]),
      theme: 'grid',
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      styles: { fontSize: 9 }
    });

    // Get the Y position after the table
    const finalY3 = (doc as any).lastAutoTable.finalY || 100;

    // Add South Africa section
    doc.setFontSize(14);
    doc.text('SOUTH AFRICA', 105, finalY3 + 10, { align: 'center' });

    // South Africa table
    doc.autoTable({
      startY: finalY3 + 15,
      head: [['Supplier', 'Description', 'IR', 'ZAR']],
      body: formData.southAfricaItems.map(item => [
        item.supplier || '',
        item.description || '',
        item.ir || '',
        item.zar !== null ? `R${item.zar.toFixed(2)}` : ''
      ]),
      theme: 'grid',
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      styles: { fontSize: 9 }
    });

    // Get the Y position after the table
    const finalY4 = (doc as any).lastAutoTable.finalY || 120;

    // Add totals
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0);
    doc.text(`Total USD: $${formData.totalUSD.toFixed(2)}`, 20, finalY4 + 10);
    doc.text(`Total ZAR: R${formData.totalZAR.toFixed(2)}`, 20, finalY4 + 20);

    // Save the PDF
    doc.save(`Cash_Manager_Request_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cash Manager Request Form</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Zimbabwe section */}
      <ZimbabweExpensesForm
        supplierItems={formData.zimbabweSupplierItems}
        pettyCashItems={formData.zimbabwePettyCashItems}
        onAddSupplierItem={addZimbabweSupplierItem}
        onRemoveSupplierItem={removeZimbabweSupplierItem}
        onUpdateSupplierItem={updateZimbabweSupplierItem}
        onUpdatePettyCashItem={updateZimbabwePettyCashItem}
      />

      {/* Diesel section */}
      <DieselExpensesForm
        dieselItems={formData.dieselItems}
        onAddDieselItem={addDieselItem}
        onRemoveDieselItem={removeDieselItem}
        onUpdateDieselItem={updateDieselItem}
      />

      {/* South Africa section */}
      <SouthAfricaExpensesForm
        southAfricaItems={formData.southAfricaItems}
        onAddSouthAfricaItem={addSouthAfricaItem}
        onRemoveSouthAfricaItem={removeSouthAfricaItem}
        onUpdateSouthAfricaItem={updateSouthAfricaItem}
      />

      {/* Totals Display */}
      <div className="mt-6 bg-gray-100 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">
            Total USD: <span className="text-red-600">${formData.totalUSD.toFixed(2)}</span>
          </div>
          <div className="text-lg font-bold">
            Total ZAR: <span className="text-red-600">R{formData.totalZAR.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={generatePDF}>Export to PDF</Button>
      </div>
    </div>
  );
};

export default CashManagerRequestForm;
