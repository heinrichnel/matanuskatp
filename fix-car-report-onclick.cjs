const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/lists/CARReportList.tsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix specific onClick handlers with proper function calls
  const fixes = [
    // Clear filters button
    {
      old: 'onClick={onClick}',
      new: 'onClick={clearFilters}',
      context: 'Clear Filters'
    },
    // View button
    {
      old: 'onClick={onClick}',
      new: 'onClick={() => handleViewDetails(report)}',
      context: 'View'
    },
    // Edit button  
    {
      old: 'onClick={onClick}',
      new: 'onClick={() => handleEditReport(report)}',
      context: 'Edit'
    },
    // PDF button
    {
      old: 'onClick={onClick}',
      new: 'onClick={() => handleDownloadPDF(report)}',
      context: 'PDF'
    },
    // Delete button
    {
      old: 'onClick={onClick}',
      new: 'onClick={() => handleDeleteReport(report.id)}',
      context: 'Delete'
    }
  ];
  
  // Apply fixes in reverse order to maintain line numbers
  content = content.replace(
    /onClick={onClick}/g,
    (match, offset) => {
      const beforeMatch = content.substring(0, offset);
      const lines = beforeMatch.split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Determine which fix to apply based on context
      if (currentLine.includes('Clear Filters')) {
        return 'onClick={clearFilters}';
      } else if (currentLine.includes('View')) {
        return 'onClick={() => handleViewDetails(report)}';
      } else if (currentLine.includes('Edit')) {
        return 'onClick={() => handleEditReport(report)}';
      } else if (currentLine.includes('PDF')) {
        return 'onClick={() => handleDownloadPDF(report)}';
      } else if (currentLine.includes('Delete')) {
        return 'onClick={() => handleDeleteReport(report.id)}';
      }
      return 'onClick={() => {}}'; // fallback
    }
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed CARReportList onClick handlers');
} else {
  console.log('CARReportList.tsx not found');
}
