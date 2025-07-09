import React, { useState } from "react";
import Card, { CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { Download, Plus, Upload, Edit2, Trash2, AlertTriangle } from "lucide-react";

export interface TyreEntry {
  tyreNumber: string;
  manufacturer: string;
  pattern: string;
  size: string; // e.g., 315/80R22.5
  type: string; // Steer/Drive/Trailer
  vehicleAssign: string;
  axlePosition: string | number;
  status: string; // NEW, OLD, RETREADED, ATTENTION
  condition: string; // OK, Attention, Scrap
  milesRun: number;
  treadDepth: number;
  mountStatus: string; // On Vehicle/In Store/Scrap
  lastInspection: string;
  costPerKM?: number;
  notes?: string;
}

interface TyreDashboardProps {
  data: TyreEntry[];
  onEdit: (tyreNumber: string) => void;
  onDelete: (tyreNumber: string) => void;
  onExport: () => void;
  onAdd: () => void;
  onImport: (file: File) => void;
}

export const TyreDashboard: React.FC<TyreDashboardProps> = ({
  data, onEdit, onDelete, onExport, onAdd, onImport
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  
  const filteredData = data.filter(tyre => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      tyre.tyreNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tyre.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tyre.vehicleAssign.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status/condition filter
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "attention") return matchesSearch && tyre.condition === "Attention";
    if (filterBy === "new") return matchesSearch && tyre.status === "NEW";
    if (filterBy === "retreaded") return matchesSearch && tyre.status === "RETREADED";
    if (filterBy === "on_vehicle") return matchesSearch && tyre.mountStatus === "On Vehicle";
    if (filterBy === "in_store") return matchesSearch && tyre.mountStatus === "In Store";
    
    return matchesSearch;
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "NEW": return "bg-green-100 text-green-800";
      case "RETREADED": return "bg-blue-100 text-blue-800";
      case "ATTENTION": return "bg-red-200 text-red-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h2 className="font-bold text-xl">Tyre Inventory</h2>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={onAdd} size="sm" variant="primary" icon={<Plus size={16} />}>
                Add Tyre
              </Button>
              <Button onClick={onExport} size="sm" variant="secondary" icon={<Download size={16} />}>
                Export
              </Button>
              <label className="cursor-pointer">
                <div className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium flex items-center">
                  <Upload size={16} className="mr-1" />
                  Import CSV
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".csv" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by tyre #, manufacturer, vehicle..."
                className="w-full px-3 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="px-3 py-2 border rounded-md"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All Tyres</option>
                <option value="attention">Needs Attention</option>
                <option value="new">New Tyres</option>
                <option value="retreaded">Retreaded</option>
                <option value="on_vehicle">On Vehicle</option>
                <option value="in_store">In Store</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tyre #</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Axle Pos</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miles Run</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tread (mm)</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mount Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Insp</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/km</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map(t => (
                <tr 
                  key={t.tyreNumber} 
                  className={t.condition === "Attention" ? "bg-yellow-50" : ""}
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => onEdit(t.tyreNumber)} 
                        className="p-1 rounded hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit2 size={16} className="text-blue-500" />
                      </button>
                      <button 
                        onClick={() => onDelete(t.tyreNumber)} 
                        className="p-1 rounded hover:bg-gray-100"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                      {t.condition === "Attention" && (
                        <span title="Needs attention"><AlertTriangle size={16} className="text-yellow-500" /></span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.tyreNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.manufacturer}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.pattern}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.size}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.type}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.vehicleAssign}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.axlePosition}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.condition}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.milesRun}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.treadDepth}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.mountStatus}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.lastInspection}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{t.costPerKM?.toFixed(2)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500" title={t.notes}>
                    {t.notes && t.notes.length > 20 ? t.notes.substring(0, 20) + "…" : t.notes}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={16} className="px-3 py-4 text-center text-gray-500">
                    {searchTerm || filterBy !== "all" ? 
                      "No tyres match your search criteria" : 
                      "No tyres in inventory. Click 'Add Tyre' to create your first entry."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t bg-gray-50 text-sm">
          <div className="flex justify-between items-center">
            <div>
              Total: <span className="font-medium">{filteredData.length}</span> tyres
              {filterBy !== "all" && ` (filtered from ${data.length})`}
            </div>
            <div className="text-gray-500">
              Export to CSV for detailed analysis or backup
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TyreDashboard;
