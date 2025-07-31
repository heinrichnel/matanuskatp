// src/components/ExcelReader.tsx
import React from "react";
import ExcelJS from "exceljs";

const ExcelReader: React.FC = () => {
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(await file.arrayBuffer());
      const worksheet = workbook.worksheets[0];

      worksheet.eachRow((row, rowNumber) => {
        console.log(`Row ${rowNumber}:`, row.values);
      });

      alert("Excel file loaded. See console for data.");
    } catch (error) {
      alert("Error reading Excel file");
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded">
      <label className="block mb-2 font-semibold">Select an Excel (.xlsx) file:</label>
      <input type="file" accept=".xlsx" onChange={handleFile} />
    </div>
  );
};

export default ExcelReader;
