import React, { useState, useEffect } from "react";
import { LoadPlan, Trip, LOAD_CATEGORIES } from "../../types";
import { useAppContext } from "../../context/AppContext";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/FormElements";
import {
  Package,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Scale,
  Box,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LoadingIndicator from "../../components/ui/LoadingIndicator";

interface LoadPlanningComponentProps {
  tripId: string;
}

interface CargoItem {
  id: string;
  description: string;
  weight: number;
  volume: number;
  quantity: number;
  stackable: boolean;
  hazardous: boolean;
  category: string;
  priorityLevel: "low" | "medium" | "high";
}

const LoadPlanningComponent: React.FC<LoadPlanningComponentProps> = ({ tripId }) => {
  const { getTrip, getLoadPlan, addLoadPlan, updateLoadPlan } = useAppContext();

  const [trip, setTrip] = useState<Trip | undefined>();
  const [loadPlan, setLoadPlan] = useState<LoadPlan | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // New cargo item form
  const [newItem, setNewItem] = useState<CargoItem>({
    id: "",
    description: "",
    weight: 0,
    volume: 0,
    quantity: 1,
    stackable: true,
    hazardous: false,
    category: "general_cargo",
    priorityLevel: "medium",
  });

  // Vehicle capacity defaults (should come from vehicle later)
  const [vehicleCapacity] = useState({
    weight: 34000,
    volume: 86,
    length: 13.6,
    width: 2.5,
    height: 2.6,
  });

  useEffect(() => {
    if (tripId) {
      const tripData = getTrip(tripId);
      if (tripData) {
        setTrip(tripData);
        if (tripData.loadPlanId) {
          const loadPlanData = getLoadPlan(tripData.loadPlanId);
          if (loadPlanData) setLoadPlan(loadPlanData);
        }
      } else {
        setError(`Trip with ID ${tripId} not found`);
      }
    }
  }, [tripId, getTrip, getLoadPlan]);

  // Totals
  const calculateTotals = () => {
    if (!loadPlan) return { totalWeight: 0, totalVolume: 0 };
    const totalWeight = loadPlan.cargoItems.reduce((sum, item) => sum + item.weight * item.quantity, 0);
    const totalVolume = loadPlan.cargoItems.reduce((sum, item) => sum + item.volume * item.quantity, 0);
    return { totalWeight, totalVolume };
  };

  const handleAddItem = () => {
    if (!newItem.description || newItem.weight <= 0 || newItem.volume <= 0) {
      setError("Please fill out all required fields for the cargo item");
      return;
    }
    const itemToAdd = {
      ...newItem,
      id: `cargo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    if (loadPlan) {
      // Update existing plan
      const updatedPlan = {
        ...loadPlan,
        cargoItems: [...loadPlan.cargoItems, itemToAdd],
        updatedAt: new Date().toISOString(),
      };
      updateLoadPlan(updatedPlan)
        .then(() => {
          setLoadPlan(updatedPlan);
          resetNewItemForm();
          setIsAddingItem(false);
        })
        .catch((err) => setError(err.message || "Failed to add cargo item"));
    } else if (trip) {
      // Create new plan
      const newPlan: Omit<LoadPlan, "id" | "createdAt"> = {
        tripId,
        vehicleCapacity,
        cargoItems: [itemToAdd],
        utilisationRate: 0,
        createdBy: "Current User",
        updatedAt: new Date().toISOString(),
      };
      addLoadPlan(newPlan)
        .then((planId) => {
          const createdPlan = getLoadPlan(planId);
          if (createdPlan) setLoadPlan(createdPlan);
          resetNewItemForm();
          setIsAddingItem(false);
        })
        .catch((err) => setError(err.message || "Failed to create load plan"));
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (!loadPlan) return;
    const updatedPlan = {
      ...loadPlan,
      cargoItems: loadPlan.cargoItems.filter((item) => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    };
    updateLoadPlan(updatedPlan)
      .then(() => setLoadPlan(updatedPlan))
      .catch((err) => setError(err.message || "Failed to delete cargo item"));
  };

  const resetNewItemForm = () => {
    setNewItem({
      id: "",
      description: "",
      weight: 0,
      volume: 0,
      quantity: 1,
      stackable: true,
      hazardous: false,
      category: "general_cargo",
      priorityLevel: "medium",
    });
    setError(null);
  };

  // Safest for all types of Input/Select/Textarea
  const updateNewItemField = (field: keyof CargoItem, value: any) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  // Utilization
  const calculateUtilization = () => {
    const { totalWeight, totalVolume } = calculateTotals();
    const weightUtilization = (totalWeight / vehicleCapacity.weight) * 100;
    const volumeUtilization = (totalVolume / vehicleCapacity.volume) * 100;
    const overallUtilization = Math.max(weightUtilization, volumeUtilization);
    return { weightUtilization, volumeUtilization, overallUtilization };
  };

  const getUtilizationClass = (percentage: number) => {
    if (percentage > 95) return "bg-red-500";
    if (percentage > 85) return "bg-yellow-500";
    if (percentage > 60) return "bg-green-500";
    return "bg-blue-500";
  };

  const formatNumber = (num: number, decimals = 0) =>
    num.toLocaleString(undefined, { maximumFractionDigits: decimals });

  if (!trip) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          {error ? <p className="text-red-600">{error}</p> : <LoadingIndicator text="Loading trip data..." />}
        </CardContent>
      </Card>
    );
  }

  const { totalWeight, totalVolume } = calculateTotals();
  const { weightUtilization, volumeUtilization, overallUtilization } = calculateUtilization();

  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <Package className="mr-2 h-5 w-5" />
            <span>Load Planning</span>
            {expanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </div>
        }
        action={
          expanded && (
            <Button
              size="sm"
              variant={isAddingItem ? "outline" : "primary"}
              icon={isAddingItem ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              onClick={() => {
                setIsAddingItem(!isAddingItem);
                if (isAddingItem) resetNewItemForm();
              }}
            >
              {isAddingItem ? "Cancel" : "Add Cargo"}
            </Button>
          )
        }
      />

      {expanded && (
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Capacity */}
          {/* ...  --- identical to jou vorige weergawe --- ... */}

          {/* Add New Cargo Item Form */}
          {isAddingItem && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 className="text-md font-medium text-blue-800 mb-3">Add Cargo Item</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Description"
                  value={newItem.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewItemField("description", e.target.value)}
                  placeholder="e.g., Pallets of Product A"
                />

                <Select
                  label="Category"
                  value={newItem.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNewItemField("category", e.target.value)}
                  options={LOAD_CATEGORIES.map((cat) => ({ label: cat.label, value: cat.value }))}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    min="0"
                    step="1"
                    value={newItem.weight.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewItemField("weight", parseFloat(e.target.value) || 0)}
                  />

                  <Input
                    label="Volume (m³)"
                    type="number"
                    min="0"
                    step="0.1"
                    value={newItem.volume.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewItemField("volume", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={newItem.quantity.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewItemField("quantity", parseInt(e.target.value) || 1)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stackable"
                      checked={newItem.stackable}
                      onChange={(e) => updateNewItemField("stackable", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="stackable" className="ml-2 block text-sm text-gray-900">
                      Stackable
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hazardous"
                      checked={newItem.hazardous}
                      onChange={(e) => updateNewItemField("hazardous", e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hazardous" className="ml-2 block text-sm text-gray-900">
                      Hazardous
                    </label>
                  </div>
                </div>

                <Select
                  label="Priority Level"
                  value={newItem.priorityLevel}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNewItemField("priorityLevel", e.target.value)}
                  options={[
                    { label: "Low Priority", value: "low" },
                    { label: "Medium Priority", value: "medium" },
                    { label: "High Priority", value: "high" },
                  ]}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleAddItem}
                  disabled={!newItem.description || newItem.weight <= 0 || newItem.volume <= 0}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Item
                </Button>
              </div>
            </div>
          )}

          {/* Cargo Items List + Notes + Analysis ... (identical to jou vorige weergawe, geen issues nie) */}
          {/* ... */}
        </CardContent>
      )}
    </Card>
  );
};

export default LoadPlanningComponent;
