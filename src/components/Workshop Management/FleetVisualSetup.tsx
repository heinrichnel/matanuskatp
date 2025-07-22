import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Truck, Plus, Trash2, Edit, Check, X, Camera, Download, Upload, Info } from 'lucide-react';

interface VehicleTemplate {
  id: string;
  name: string;
  type: 'truck' | 'trailer' | 'van' | 'car';
  image?: string;
  inspectionPoints: InspectionPoint[];
}

interface InspectionPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'mechanical' | 'electrical' | 'body' | 'safety' | 'tyre';
}

const FleetVisualSetup: React.FC = () => {
  const [vehicleTemplates, setVehicleTemplates] = useState<VehicleTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<VehicleTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<VehicleTemplate, 'id'>>({
    name: '',
    type: 'truck',
    inspectionPoints: [],
  });
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [newPoint, setNewPoint] = useState<Omit<InspectionPoint, 'id'>>({
    label: '',
    x: 0,
    y: 0,
    type: 'mechanical',
  });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch vehicle templates
  useEffect(() => {
    const fetchVehicleTemplates = async () => {
      try {
        setLoading(true);
        
        // Mocking data for demonstration
        // In a real app, you'd fetch from Firestore
        const mockTemplates: VehicleTemplate[] = [
          {
            id: 'template1',
            name: 'Standard Tractor Unit',
            type: 'truck',
            image: 'https://firebasestorage.googleapis.com/v0/b/transport-mat-demo.appspot.com/o/templates%2Ftruck-template.png?alt=media',
            inspectionPoints: [
              { id: 'p1', label: 'Front Right Tyre', x: 15, y: 40, type: 'tyre' },
              { id: 'p2', label: 'Front Left Tyre', x: 15, y: 60, type: 'tyre' },
              { id: 'p3', label: 'Engine Compartment', x: 25, y: 50, type: 'mechanical' },
              { id: 'p4', label: 'Rear Right Tyres', x: 75, y: 40, type: 'tyre' },
              { id: 'p5', label: 'Rear Left Tyres', x: 75, y: 60, type: 'tyre' },
              { id: 'p6', label: 'Cab Lights', x: 20, y: 30, type: 'electrical' },
              { id: 'p7', label: 'Fifth Wheel', x: 60, y: 50, type: 'mechanical' },
            ]
          },
          {
            id: 'template2',
            name: 'Curtain Side Trailer',
            type: 'trailer',
            image: 'https://firebasestorage.googleapis.com/v0/b/transport-mat-demo.appspot.com/o/templates%2Ftrailer-template.png?alt=media',
            inspectionPoints: [
              { id: 'p1', label: 'Front Right Tyre', x: 30, y: 35, type: 'tyre' },
              { id: 'p2', label: 'Front Left Tyre', x: 30, y: 65, type: 'tyre' },
              { id: 'p3', label: 'Rear Right Tyre', x: 70, y: 35, type: 'tyre' },
              { id: 'p4', label: 'Rear Left Tyre', x: 70, y: 65, type: 'tyre' },
              { id: 'p5', label: 'Trailer Coupling', x: 20, y: 50, type: 'mechanical' },
              { id: 'p6', label: 'Rear Lights', x: 85, y: 50, type: 'electrical' },
              { id: 'p7', label: 'Side Curtain - Right', x: 50, y: 30, type: 'body' },
              { id: 'p8', label: 'Side Curtain - Left', x: 50, y: 70, type: 'body' },
            ]
          },
          {
            id: 'template3',
            name: 'Delivery Van',
            type: 'van',
            image: 'https://firebasestorage.googleapis.com/v0/b/transport-mat-demo.appspot.com/o/templates%2Fvan-template.png?alt=media',
            inspectionPoints: [
              { id: 'p1', label: 'Front Right Tyre', x: 25, y: 35, type: 'tyre' },
              { id: 'p2', label: 'Front Left Tyre', x: 25, y: 65, type: 'tyre' },
              { id: 'p3', label: 'Rear Right Tyre', x: 75, y: 35, type: 'tyre' },
              { id: 'p4', label: 'Rear Left Tyre', x: 75, y: 65, type: 'tyre' },
              { id: 'p5', label: 'Engine Compartment', x: 15, y: 50, type: 'mechanical' },
              { id: 'p6', label: 'Cargo Door', x: 90, y: 50, type: 'body' },
              { id: 'p7', label: 'Headlights', x: 10, y: 50, type: 'electrical' },
            ]
          }
        ];
        
        setVehicleTemplates(mockTemplates);
        
        // Set the first template as selected by default
        if (mockTemplates.length > 0) {
          setSelectedTemplate(mockTemplates[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching vehicle templates:", err);
        setError('Failed to load vehicle templates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleTemplates();
  }, []);

  const handleAddPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPoint || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setNewPoint({
      ...newPoint,
      x: Math.round(x),
      y: Math.round(y)
    });
    
    // Open modal or form for point details
    document.getElementById('pointDetailsModal')?.classList.remove('hidden');
  };

  const saveInspectionPoint = () => {
    if (!selectedTemplate) return;
    
    const pointId = `p${Date.now()}`;
    const point: InspectionPoint = {
      id: pointId,
      ...newPoint
    };
    
    const updatedTemplate = {
      ...selectedTemplate,
      inspectionPoints: [...selectedTemplate.inspectionPoints, point]
    };
    
    // Update local state
    setSelectedTemplate(updatedTemplate);
    setVehicleTemplates(templates => 
      templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
    );
    
    // Reset form and hide modal
    setNewPoint({
      label: '',
      x: 0,
      y: 0,
      type: 'mechanical',
    });
    setIsAddingPoint(false);
    document.getElementById('pointDetailsModal')?.classList.add('hidden');
    
    // In a real app, we would update Firestore
    // updateDoc(doc(db, "vehicleTemplates", selectedTemplate.id), {
    //   inspectionPoints: updatedTemplate.inspectionPoints
    // });
  };

  const deleteInspectionPoint = (pointId: string) => {
    if (!selectedTemplate) return;
    
    const updatedTemplate = {
      ...selectedTemplate,
      inspectionPoints: selectedTemplate.inspectionPoints.filter(p => p.id !== pointId)
    };
    
    // Update local state
    setSelectedTemplate(updatedTemplate);
    setVehicleTemplates(templates => 
      templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
    );
    
    // In a real app, we would update Firestore
  };

  const saveNewTemplate = () => {
    if (!newTemplate.name) {
      setError('Template name is required');
      return;
    }
    
    const templateId = `template${Date.now()}`;
    const template: VehicleTemplate = {
      id: templateId,
      ...newTemplate,
      inspectionPoints: []
    };
    
    // Update local state
    setVehicleTemplates([...vehicleTemplates, template]);
    setSelectedTemplate(template);
    
    // Reset form and hide modal
    setNewTemplate({
      name: '',
      type: 'truck',
      inspectionPoints: [],
    });
    setShowAddTemplate(false);
    
    // In a real app, we would add to Firestore
    // addDoc(collection(db, "vehicleTemplates"), template);
  };

  const deleteTemplate = () => {
    if (!selectedTemplate) return;
    
    // Update local state
    setVehicleTemplates(vehicleTemplates.filter(t => t.id !== selectedTemplate.id));
    setSelectedTemplate(vehicleTemplates.length > 1 ? 
      vehicleTemplates.find(t => t.id !== selectedTemplate.id) || null : 
      null
    );
    
    // In a real app, we would delete from Firestore
    // deleteDoc(doc(db, "vehicleTemplates", selectedTemplate.id));
  };

  const getPointTypeColor = (type: InspectionPoint['type']) => {
    switch (type) {
      case 'mechanical': return 'bg-red-500';
      case 'electrical': return 'bg-yellow-500';
      case 'body': return 'bg-blue-500';
      case 'safety': return 'bg-green-500';
      case 'tyre': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPointTypeLabel = (type: InspectionPoint['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Truck className="mr-2 text-primary-600" size={28} />
          Fleet Visual Setup
        </h1>
        
        <div className="flex gap-3">
          <button
            onClick={onClick || (() => {})}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Template
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Selector */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Vehicle Templates</h2>
          <div className="space-y-2">
            {vehicleTemplates.map(template => (
              <button
                key={template.id}
                onClick={onClick || (() => {})}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between ${
                  selectedTemplate?.id === template.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Truck size={18} className="mr-2 text-gray-600" />
                  <span className="font-medium">{template.name}</span>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full capitalize">
                  {template.type}
                </span>
              </button>
            ))}
          </div>
          
          {vehicleTemplates.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Truck size={24} className="mx-auto mb-2 opacity-30" />
              <p>No templates available</p>
              <p className="text-sm">Create your first template to get started</p>
            </div>
          )}
        </div>
        
        {/* Template Viewer/Editor */}
        <div className="lg:col-span-3">
          {selectedTemplate ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{selectedTemplate.name}</h2>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={onClick || (() => {})} 
                        className={`flex items-center px-3 py-1 rounded-md ${
                          isAddingPoint
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100'
                        }`}
                      >
                        {isAddingPoint ? (
                          <>
                            <X size={16} className="mr-1" />
                            Cancel Point
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="mr-1" />
                            Add Point
                          </>
                        )}
                      </button>
                      <button 
                        onClick={onClick || (() => {})} 
                        className="flex items-center px-3 py-1 rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      >
                        <Check size={16} className="mr-1" />
                        Done
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={onClick || (() => {})} 
                        className="flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={onClick || (() => {})} 
                        className="flex items-center px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mb-4 flex gap-4 flex-wrap">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Mechanical</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Electrical</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Body</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Safety</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Tyre</span>
                </div>
              </div>
              
              <div 
                ref={imageContainerRef}
                className={`relative border border-gray-300 rounded-lg overflow-hidden bg-gray-100 ${
                  isAddingPoint ? 'cursor-crosshair' : 'cursor-default'
                }`}
                style={{ minHeight: '400px' }}
                onClick={onClick || (() => {})}
              >
                {selectedTemplate.image ? (
                  <img 
                    src={selectedTemplate.image} 
                    alt={selectedTemplate.name}
                    className="w-full h-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full py-16">
                    <div className="text-center">
                      <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No image uploaded</p>
                      <button 
                        className="mt-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
                        disabled={!isEditing}
                      >
                        <Upload size={14} className="mr-1 inline" />
                        Upload Image
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Inspection Points */}
                {selectedTemplate.inspectionPoints.map(point => (
                  <div 
                    key={point.id}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white flex items-center justify-center -translate-x-1/2 -translate-y-1/2 ${getPointTypeColor(point.type)}`}
                    style={{ 
                      left: `${point.x}%`, 
                      top: `${point.y}%` 
                    }}
                    title={point.label}
                  >
                    {isEditing && (
                      <button 
                        onClick={onClick || (() => {})}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Points List */}
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">Inspection Points</h3>
                {selectedTemplate.inspectionPoints.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTemplate.inspectionPoints.map(point => (
                      <div 
                        key={point.id} 
                        className="flex items-center justify-between border border-gray-200 rounded-md p-3 bg-gray-50"
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${getPointTypeColor(point.type)}`}></div>
                          <span>{point.label}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {getPointTypeLabel(point.type)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No inspection points defined</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-12 text-center">
              <Truck size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Template Selected</h3>
              <p className="text-gray-500 mb-6">Select a template from the left or create a new one</p>
              <button
                onClick={onClick || (() => {})}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-flex items-center"
              >
                <Plus size={18} className="mr-1" />
                Create Template
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add point modal */}
      <div id="pointDetailsModal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Add Inspection Point</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={newPoint.label}
                onChange={(e) => setNewPoint({...newPoint, label: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Front Right Tyre"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newPoint.type}
                onChange={(e) => setNewPoint({...newPoint, type: e.target.value as InspectionPoint['type']})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="mechanical">Mechanical</option>
                <option value="electrical">Electrical</option>
                <option value="body">Body</option>
                <option value="safety">Safety</option>
                <option value="tyre">Tyre</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position X
                </label>
                <input
                  type="number"
                  value={newPoint.x}
                  onChange={(e) => setNewPoint({...newPoint, x: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position Y
                </label>
                <input
                  type="number"
                  value={newPoint.y}
                  onChange={(e) => setNewPoint({...newPoint, y: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => {
                setIsAddingPoint(false);
                document.getElementById('pointDetailsModal')?.classList.add('hidden');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onClick || (() => {})}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              disabled={!newPoint.label}
            >
              Save Point
            </button>
          </div>
        </div>
      </div>
      
      {/* Add template modal */}
      {showAddTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Vehicle Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Standard Tractor Unit"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={newTemplate.type}
                  onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value as VehicleTemplate['type']})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="truck">Truck</option>
                  <option value="trailer">Trailer</option>
                  <option value="van">Van</option>
                  <option value="car">Car</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={onClick || (() => {})}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onClick || (() => {})}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                disabled={!newTemplate.name}
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Fleet Visual Setup allows you to create visual inspection templates for your vehicles. Click on the vehicle image to add inspection points when in edit mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetVisualSetup;
