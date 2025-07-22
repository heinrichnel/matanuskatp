
import React, { useState } from 'react';

type Tyre = {
  brand: string;
  size: string;
  history: string[];
};

const AddNewTyrePage: React.FC = () => {
  const [tyres, setTyres] = useState<Tyre[]>([
    {
      brand: "Michelin",
      size: "205/55R16",
      history: [
        "Installed on vehicle A on 2023-01-01",
        "Rotation performed on 2023-07-01"
      ]
    },
    {
      brand: "Bridgestone",
      size: "225/45R17",
      history: [
        "Installed on vehicle B on 2023-03-15"
      ]
    }
  ]);

  const getTyreByBrand = (brand: string) => tyres.filter(t => t.brand === brand);
  const getTyreBySize = (size: string) => tyres.filter(t => t.size === size);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All tyres:</h1>
      <ul>
        {tyres.map((tyre, idx) => (
          <li key={idx}>
            Tyre: Brand={tyre.brand}, Size={tyre.size}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 font-semibold">Michelin tyres:</h2>
      <ul>
        {getTyreByBrand("Michelin").map((tyre, idx) => (
          <li key={idx}>
            Tyre: Brand={tyre.brand}, Size={tyre.size}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 font-semibold">225/45R17 tyres:</h2>
      <ul>
        {getTyreBySize("225/45R17").map((tyre, idx) => (
          <li key={idx}>
            Tyre: Brand={tyre.brand}, Size={tyre.size}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 font-semibold">
        History for Michelin 205/55R16:
      </h2>
      <ul>
        {tyres[0].history.map((event, idx) => (
          <li key={idx}>{event}</li>
        ))}
      </ul>
    </div>
  );
};

export default AddNewTyrePage;
