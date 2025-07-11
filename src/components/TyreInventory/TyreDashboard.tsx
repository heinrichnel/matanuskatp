import React, { useState } from 'react';
import { AddTyreForm, TyreFormValues } from './AddTyreForm';

export const TyreDashboard: React.FC = () => {
  const [tyres, setTyres] = useState<TyreFormValues[]>([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Tire Inventory</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add New Tire
        </button>
      </div>
      {showForm && (
        <AddTyreForm
          onSubmit={newTyre => {
            setTyres(prev => [...prev, newTyre]);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Tire Number</th>
            <th className="px-4 py-2">Manufacturer</th>
            <th className="px-4 py-2">Condition</th>
            <th className="px-4 py-2">Vehicle Assignment</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Miles/Km Run</th>
            <th className="px-4 py-2">Tread Depth</th>
            <th className="px-4 py-2">Mount Status</th>
          </tr>
        </thead>
        <tbody>
          {tyres.map((tyre, idx) => (
            <tr key={idx}>
              <td>
                <button className="text-blue-600 underline">Action</button>
              </td>
              <td>{tyre.tireNumber}</td>
              <td>{tyre.manufacturer}</td>
              <td>
                <span className="bg-green-100 text-green-800 px-2 rounded-full text-xs">{tyre.tireCondition}</span>
              </td>
              <td>
                <span className="text-blue-700">{tyre.vehicleAssign} {tyre.axlePosition}</span>
              </td>
              <td>
                <span className="bg-blue-100 text-blue-800 px-2 rounded-full text-xs">{tyre.tireStatus}</span>
              </td>
              <td>
                <div className="w-24 bg-green-100 rounded">
                  <div className="bg-green-300 h-2 rounded" style={{ width: `${parseInt(tyre.milesKmRun || '0')}%` }} />
                  <span className="text-xs">{tyre.milesKmRun || '0'}%</span>
                </div>
              </td>
              <td>{tyre.treadDepth}</td>
              <td>
                <span className={tyre.mountStatus === 'ON_VEHICLE' ? 'bg-blue-100 text-blue-800 px-2 rounded-full text-xs' : 'bg-gray-100 text-gray-800 px-2 rounded-full text-xs'}>
                  {tyre.mountStatus.replace('_', ' ')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};