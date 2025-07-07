import React, { useState } from 'react';

interface TyreInventoryFormProps {
  onSubmit: (tyre: Tyre) => void;
}

interface Tyre {
  brand: string;
  model: string;
  dot: string;
  tyreType: 'Steer' | 'Drive' | 'Trailer' | 'Spare';
  tyreSize: string;
  pressureRating: number;
  initialTreadDepth: number;
  vendor: string;
  purchaseCostZAR: number;
  purchaseCostUSD: number;
  depotLocation: string;
  status: 'In Stock' | 'Fitted' | 'Scrapped' | 'Under Warranty';
}

const TyreInventoryForm: React.FC<TyreInventoryFormProps> = ({ onSubmit }) => {
  const [tyre, setTyre] = useState<Tyre>({
    brand: '',
    model: '',
    dot: '',
    tyreType: 'Drive',
    tyreSize: '',
    pressureRating: 0,
    initialTreadDepth: 0,
    vendor: '',
    purchaseCostZAR: 0,
    purchaseCostUSD: 0,
    depotLocation: '',
    status: 'In Stock',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTyre(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(tyre);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 grid grid-cols-2 gap-4 bg-white rounded shadow">
      <input name="brand" value={tyre.brand} onChange={handleChange} placeholder="Brand" required />
      <input name="model" value={tyre.model} onChange={handleChange} placeholder="Model" required />
      <input name="dot" value={tyre.dot} onChange={handleChange} placeholder="DOT (e.g. 1423)" required />
      
      <select name="tyreType" value={tyre.tyreType} onChange={handleChange}>
        <option>Steer</option>
        <option>Drive</option>
        <option>Trailer</option>
        <option>Spare</option>
      </select>
      
      <input name="tyreSize" value={tyre.tyreSize} onChange={handleChange} placeholder="Tyre Size (e.g. 315/80R22.5)" required />
      <input name="pressureRating" type="number" value={tyre.pressureRating} onChange={handleChange} placeholder="Pressure Rating (kPa)" required />
      <input name="initialTreadDepth" type="number" value={tyre.initialTreadDepth} onChange={handleChange} placeholder="Initial Tread Depth (mm)" required />
      <input name="vendor" value={tyre.vendor} onChange={handleChange} placeholder="Vendor" required />
      <input name="purchaseCostZAR" type="number" value={tyre.purchaseCostZAR} onChange={handleChange} placeholder="Cost in ZAR" required />
      <input name="purchaseCostUSD" type="number" value={tyre.purchaseCostUSD} onChange={handleChange} placeholder="Cost in USD" required />
      <input name="depotLocation" value={tyre.depotLocation} onChange={handleChange} placeholder="Depot Location" required />
      
      <select name="status" value={tyre.status} onChange={handleChange}>
        <option>In Stock</option>
        <option>Fitted</option>
        <option>Scrapped</option>
        <option>Under Warranty</option>
      </select>
      
      <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded">
        Submit Tyre
      </button>
    </form>
  );
};

export default TyreInventoryForm;