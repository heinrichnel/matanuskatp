import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { InspectionReport } from '../components/workshop/InspectionReportForm';

// Add the autotable plugin to the jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Generates a professional PDF for inspection reports
 * Includes photo support and clean formatting
 */
export const generateInspectionPDF = (report: InspectionReport): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  
  // Add company logo/header
  // doc.addImage('logo-url', 'PNG', 10, 10, 50, 20);
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text('INSPECTION REPORT', pageWidth / 2, 20, { align: 'center' });
  
  // Report details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Report Number: ${report.reportNumber}`, margin, 35);
  doc.text(`Inspection Date: ${new Date(report.inspectionDate).toLocaleDateString()}`, margin, 40);
  doc.text(`Vehicle ID: ${report.vehicleId}`, margin, 45);
  doc.text(`Inspector: ${report.inspector}`, margin, 50);
  doc.text(`Overall Condition: ${report.overallCondition}`, margin, 55);
  
  // Add a horizontal line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(margin, 60, pageWidth - margin, 60);
  
  // Inspection Items Table
  const tableColumn = ['Item', 'Status', 'Comments'];
  const tableRows: (string | number)[][] = [];
  
  report.items.forEach(item => {
    tableRows.push([
      item.name,
      item.status,
      item.comments || '-'
    ]);
  });
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 65,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    styles: {
      cellPadding: 3,
      fontSize: 9,
      overflow: 'linebreak',
      lineColor: [220, 220, 220]
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 'auto' }
    },
    didDrawCell: (data: {
      section: string;
      column: { index: number };
      row: { index: number };
      cell: any;
      pageCount: number;
    }) => {
      // Custom styling for status cells
      if (data.section === 'body' && data.column.index === 1) {
        const status = tableRows[data.row.index][1];
        
        if (status === 'Pass') {
          doc.setFillColor(200, 250, 200);
        } else if (status === 'Fail') {
          doc.setFillColor(255, 200, 200);
        } else {
          doc.setFillColor(240, 240, 240);
        }
        
        doc.rect(
          data.cell.x, 
          data.cell.y, 
          data.cell.width, 
          data.cell.height, 
          'F'
        );
        
        doc.setTextColor(0);
        doc.setFontSize(9);
        doc.text(
          status.toString(), 
          data.cell.x + data.cell.width / 2, 
          data.cell.y + data.cell.height / 2, 
          { align: 'center', baseline: 'middle' }
        );
        
        return false; // Returning false tells autotable not to draw the cell content
      }
    }
  });
  
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Add Notes section
  if (report.notes) {
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text('Notes:', margin, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const splitNotes = doc.splitTextToSize(report.notes, pageWidth - (margin * 2));
    doc.text(splitNotes, margin, finalY + 7);
  }
  
  // Add images (if any)
  let imagesAdded = 0;
  let currentY = finalY + (report.notes ? 25 : 10);
  
  // Get items with images
  const itemsWithImages = report.items.filter(item => item.images && item.images.length > 0);
  
  if (itemsWithImages.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text('Inspection Images:', margin, currentY);
    currentY += 7;
    
    // Calculate layout for images
    const imagesPerRow = 2;
    const imageWidth = (pageWidth - (margin * 2) - 10) / imagesPerRow;
    const imageHeight = imageWidth * 0.75; // Maintain aspect ratio
    
    let currentX = margin;
    let rowCount = 0;
    
    // Process each item with images
    itemsWithImages.forEach(item => {
      item.images?.forEach((imageUrl, idx) => {
        // Check if we need to add a new page
        if (currentY + imageHeight + 20 > pageHeight) {
          doc.addPage();
          currentY = margin + 10;
          currentX = margin;
          rowCount = 0;
        }
        
        try {
          // Try to add the image (this may fail if the image is not accessible)
          doc.addImage(imageUrl, 'JPEG', currentX, currentY, imageWidth, imageHeight);
          
          // Add caption with item name
          doc.setFontSize(8);
          doc.setTextColor(0, 0, 0);
          doc.text(
            `${item.name} - Image ${idx + 1}`, 
            currentX + (imageWidth / 2), 
            currentY + imageHeight + 5, 
            { align: 'center' }
          );
          
          imagesAdded++;
          
          // Update position for next image
          rowCount++;
          if (rowCount < imagesPerRow) {
            currentX += imageWidth + 10;
          } else {
            currentX = margin;
            currentY += imageHeight + 20;
            rowCount = 0;
          }
        } catch (error) {
          console.error(`Failed to add image: ${error}`);
        }
      });
    });
  }
  
  // Add footer with page numbers
  // Using any here because the jsPDF typings don't properly expose internal.getNumberOfPages
  const doc_internal = doc.internal as any;
  const totalPages = doc_internal.getNumberOfPages ? doc_internal.getNumberOfPages() : doc_internal.pages.length;
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${totalPages} | Generated on ${new Date().toLocaleDateString()}`, 
      pageWidth / 2, 
      pageHeight - 10, 
      { align: 'center' }
    );
    
    // Add signature line on the last page
    if (i === totalPages) {
      doc.setDrawColor(0);
      doc.line(margin, pageHeight - 30, margin + 70, pageHeight - 30);
      doc.text('Inspector Signature', margin, pageHeight - 25);
      
      doc.line(pageWidth - margin - 70, pageHeight - 30, pageWidth - margin, pageHeight - 30);
      doc.text('Supervisor Signature', pageWidth - margin - 70, pageHeight - 25);
    }
  }
  
  // Save the PDF
  doc.save(`Inspection_Report_${report.reportNumber}.pdf`);
};

/**
 * Converts Base64 image to Blob for preview
 */
export const base64ToBlob = (base64: string, contentType = ''): Blob => {
  const sliceSize = 512;
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Creates object URLs for images to preview in PDF
 */
export const prepareImagesForPDF = (images: string[]): Promise<string[]> => {
  return Promise.all(
    images.map(async (imageUrl) => {
      // If it's already a data URL, use it directly
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }
      
      // Otherwise fetch the image and convert to data URL
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('Failed to prepare image for PDF:', error);
        return ''; // Return empty string for failed images
      }
    })
  );
};
