/**
 * This script updates the Layout and Sidebar components to make them responsive.
 * It adds a toggle mechanism for the sidebar on mobile devices.
 */

const fs = require('fs');
const path = require('path');

// Update Layout component
function updateLayout() {
  const layoutPath = path.join(__dirname, 'src', 'components', 'layout', 'Layout.tsx');

  if (!fs.existsSync(layoutPath)) {
    console.error(`Layout file not found at ${layoutPath}`);
    return false;
  }

  let layoutContent = fs.readFileSync(layoutPath, 'utf8');

  // Add useState import if not already present
  if (!layoutContent.includes('useState')) {
    layoutContent = layoutContent.replace(
      'import React from \'react\';',
      'import React, { useState } from \'react\';'
    );
  }

  // Add Menu icon import
  if (!layoutContent.includes('Menu')) {
    layoutContent = layoutContent.replace(
      'import { Outlet',
      'import { Menu } from \'lucide-react\';\nimport { Outlet'
    );
  }

  // Add sidebar toggle state
  if (!layoutContent.includes('sidebarOpen')) {
    layoutContent = layoutContent.replace(
      'const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);',
      'const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);\n  const [sidebarOpen, setSidebarOpen] = useState(true);\n\n  // Toggle sidebar function\n  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);'
    );
  }

  // Update Sidebar props
  layoutContent = layoutContent.replace(
    '<Sidebar\n        currentView={currentView}\n        onNavigate={handleNavigate}\n      />',
    '<Sidebar\n        currentView={currentView}\n        onNavigate={handleNavigate}\n        isOpen={sidebarOpen}\n        onClose={() => setSidebarOpen(false)}\n      />'
  );

  // Update main content
  layoutContent = layoutContent.replace(
    '<main className="ml-64 !ml-64 p-6 pt-8 w-full max-w-screen-2xl mx-auto" style={{ marginLeft: \'16rem\' }}>',
    '<main className={`transition-all duration-300 p-6 pt-8 w-full max-w-screen-2xl mx-auto ${sidebarOpen ? \'md:ml-64\' : \'ml-0\'}`}>\n        {/* Sidebar toggle button */}\n        <button \n          className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"\n          onClick={toggleSidebar}\n          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}\n        >\n          <Menu size={24} />\n        </button>'
  );

  fs.writeFileSync(layoutPath, layoutContent);
  console.log('Updated Layout component');
  return true;
}

// Update Sidebar component
function updateSidebar() {
  const sidebarPath = path.join(__dirname, 'src', 'components', 'layout', 'Sidebar.tsx');

  if (!fs.existsSync(sidebarPath)) {
    console.error(`Sidebar file not found at ${sidebarPath}`);
    return false;
  }

  let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

  // Add X icon import
  if (!sidebarContent.includes('X')) {
    sidebarContent = sidebarContent.replace(
      'import { ChevronDown, ChevronRight',
      'import { ChevronDown, ChevronRight, X'
    );
  }

  // Update SidebarProps interface
  sidebarContent = sidebarContent.replace(
    'interface SidebarProps {\n  currentView: string;\n  onNavigate: (route: string) => void;\n}',
    'interface SidebarProps {\n  currentView: string;\n  onNavigate: (route: string) => void;\n  isOpen: boolean;\n  onClose: () => void;\n}'
  );

  // Update Sidebar component
  sidebarContent = sidebarContent.replace(
    'const Sidebar: FC<SidebarProps> = ({ currentView, onNavigate }) => {',
    'const Sidebar: FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {'
  );

  // Update aside element
  sidebarContent = sidebarContent.replace(
    '<aside className="fixed left-0 top-0 h-screen w-64 !w-64 bg-gray-100 border-r shadow flex flex-col z-30" style={{ width: \'16rem\' }}>',
    '<aside className={`fixed left-0 top-0 h-screen bg-gray-100 border-r shadow flex flex-col z-30 transition-all duration-300 ${isOpen ? \'translate-x-0 w-64\' : \'-translate-x-full w-64 md:translate-x-0 md:w-16\'}` }>\n      {/* Close button (visible on mobile) */}\n      <button \n        className="md:hidden absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200"\n        onClick={onClose}\n        aria-label="Close sidebar"\n      >\n        <X size={20} />\n      </button>'
  );

  // Update logo/title
  sidebarContent = sidebarContent.replace(
    '<div className="flex items-center justify-center px-6 py-4 border-b bg-gray-100">\n        <h1 className="font-bold text-black text-lg">MATANUSKA TRANSPORT</h1>\n      </div>',
    '<div className="flex items-center justify-center px-6 py-4 border-b bg-gray-100">\n        {isOpen || window.innerWidth >= 768 ? (\n          <h1 className="font-bold text-black text-lg">MATANUSKA TRANSPORT</h1>\n        ) : (\n          <h1 className="font-bold text-black text-lg">MT</h1>\n        )}\n      </div>'
  );

  // Update renderSidebarItems function to handle collapsed state
  sidebarContent = sidebarContent.replace(
    /\{item\.icon && <item\.icon className="w-5 h-5 flex-shrink-0" style=\{\{ width: '20px', height: '20px' \}\} \/>\}/g,
    '{item.icon && <item.icon className="w-5 h-5 flex-shrink-0" style={{ width: \'20px\', height: \'20px\' }} />}'
  );

  sidebarContent = sidebarContent.replace(
    /{item.icon && <item.icon className="w-5 h-5 flex-shrink-0" style={{ width: '20px', height: '20px' }} \/>}\n                {(title \|\| heading) && \(/g,
    '{item.icon && <item.icon className="w-5 h-5 flex-shrink-0" style={{ width: \'20px\', height: \'20px\' }} />}\n                {isOpen && (title || heading) && ('
  );

  sidebarContent = sidebarContent.replace(
    /{action && <div>{action}<\/div>}/g,
    '{isOpen && action && <div>{action}</div>}'
  );

  sidebarContent = sidebarContent.replace(
    /{subtitle && \(/g,
    '{isOpen && subtitle && ('
  );

  sidebarContent = sidebarContent.replace(
    /{expandedItems\[item\.id\] && renderSidebarItems\(item\.children, true\)}/g,
    '{isOpen && expandedItems[item.id] && renderSidebarItems(item.children, true)}'
  );

  // Update footer
  sidebarContent = sidebarContent.replace(
    '<div className="px-6 py-4 border-t">',
    '<div className={`px-6 py-4 border-t ${isOpen ? \'\' : \'hidden md:block\'}` }>'
  );

  sidebarContent = sidebarContent.replace(
    '<ConnectionStatusIndicator showText={true} />',
    '<ConnectionStatusIndicator showText={isOpen} />'
  );

  sidebarContent = sidebarContent.replace(
    '<SyncIndicator showText={true} className="mt-1" />',
    '<SyncIndicator showText={isOpen} className="mt-1" />'
  );

  sidebarContent = sidebarContent.replace(
    '<span className="text-sm text-gray-700">User</span>',
    '{isOpen && <span className="text-sm text-gray-700">User</span>}'
  );

  fs.writeFileSync(sidebarPath, sidebarContent);
  console.log('Updated Sidebar component');
  return true;
}

// Run the updates
console.log('Updating Layout and Sidebar components to be responsive...');
const layoutUpdated = updateLayout();
const sidebarUpdated = updateSidebar();

if (layoutUpdated && sidebarUpdated) {
  console.log('\nSuccessfully updated Layout and Sidebar components to be responsive!');
  console.log('\nNext steps:');
  console.log('1. Run the application to verify that the responsive layout works correctly');
  console.log('2. Test the layout on different screen sizes');
  console.log('3. Make any additional adjustments as needed');
} else {
  console.log('\nFailed to update some components. Please check the error messages above.');
}
