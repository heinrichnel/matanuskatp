import React from 'react';

interface TyreReportGeneratorProps {
  onGenerateReport: (type: string, dateRange: string, brand: string) => void;
}

const TyreReportGenerator: React.FC<TyreReportGeneratorProps> = ({ onGenerateReport }) => {
  const handleClick = () => {
    onGenerateReport('Performance', '30', 'Michelin');
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h4 className="text-lg font-bold">Tyre Report Generator</h4>
      <p>Generate detailed tyre reports here.</p>
      <button onClick={onClick} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => {}}>Generate Report</button>
    </div>
  );
};

export default TyreReportGenerator;
