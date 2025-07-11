import React, { useState } from 'react';
import { Button } from '../ui/Button';

export type TyreStatus = 'NEW' | 'RETREADED' | 'USED';
export type MountStatus = 'ON_VEHICLE' | 'IN_STORE';
export type StoreLocation = 'ASSET_STORE' | 'HOLDING_BAY' | 'SCRAPPED_STORE' | 'RETREAD_STORE';

export interface TyreFormValues {
  tireNumber: string;
  manufacturer: string;
  tireSize: string;
  tireType: string;
  tirePattern: string;
  year: string;
  tireCost: string;
  tireCondition: string;
  tireStatus: TyreStatus;
  vehicleAssign: string;
  axlePosition: string;
  mountStatus: MountStatus;
  milesKmRun: string;
  milesKmLimit: string;
  treadDepth: string;
  store: StoreLocation;
  note: string;
}

const defaultForm: TyreFormValues = {
  tireNumber: '',
  manufacturer: '',
  tireSize: '',
  tireType: '',
  tirePattern: '',
  year: '',
  tireCost: '',
  tireCondition: 'OK',
  tireStatus: 'NEW',
  vehicleAssign: '',
  axlePosition: '',
  mountStatus: 'IN_STORE',
  milesKmRun: '',
  milesKmLimit: '',
  treadDepth: '',
  store: 'ASSET_STORE',
  note: ''
};

interface AddTyreFormProps {
  onSubmit: (tyre: TyreFormValues) => void;
  onCancel: () => void;
}

export const AddTyreForm: React.FC<AddTyreFormProps> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState<TyreFormValues>(defaultForm);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-4 bg-white rounded shadow">
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium">Tire Number*</label>
          <input
            name="tireNumber"
            value={form.tireNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tire Size*</label>
          <input name="tireSize" value={form.tireSize} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tire Type*</label>
          <input name="tireType" value={form.tireType} onChange={handleChange} required className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tire Pattern</label>
          <input name="tirePattern" value={form.tirePattern} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Manufacturer</label>
          <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Year</label>
          <input name="year" value={form.year} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tire Cost</label>
          <input name="tireCost" value={form.tireCost} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tire Condition</label>
          <select name="tireCondition" value={form.tireCondition} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
            <option value="OK">OK</option>
            <option value="NEED_ATTENTION">Need Attention</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium">Tire Status*</label>
          <select name="tireStatus" value={form.tireStatus} onChange={handleChange} required className="mt-1 block w-full border rounded p-2">
            <option value="NEW">New</option>
            <option value="RETREADED">Retreaded</option>
            <option value="USED">Used</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Vehicle Assign</label>
          <input name="vehicleAssign" value={form.vehicleAssign} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Axle Position</label>
          <input name="axlePosition" value={form.axlePosition} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Mount Status</label>
          <select name="mountStatus" value={form.mountStatus} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
            <option value="ON_VEHICLE">On Vehicle</option>
            <option value="IN_STORE">In Store</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Miles/KM Run</label>
          <input name="milesKmRun" value={form.milesKmRun} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Miles/KM Limit</label>
          <input name="milesKmLimit" value={form.milesKmLimit} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tread Depth</label>
          <input name="treadDepth" value={form.treadDepth} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Store</label>
          <select name="store" value={form.store} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
            <option value="ASSET_STORE">Asset Store</option>
            <option value="HOLDING_BAY">Holding Bay</option>
            <option value="SCRAPPED_STORE">Scrapped Store</option>
            <option value="RETREAD_STORE">Retread Store</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Note</label>
          <input name="note" value={form.note} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div className="flex space-x-2 pt-4">
          <Button type="submit">Create</Button>
          <Button variant="outline" onClick={onCancel} type="button">Cancel</Button>
        </div>
      </div>
    </form>
  );
};
