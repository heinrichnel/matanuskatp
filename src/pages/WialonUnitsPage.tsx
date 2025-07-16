import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    wialon: any;
  }
}

interface Unit {
  name: string;
  lat: number;
  lon: number;
}

const WialonUnitsPage: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const token = "c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053";

  useEffect(() => {
    const session = window.wialon.core.Session.getInstance();
    session.initSession("https://hosting.wialon.com");
    session.loginToken(token, "", (code: number) => {
      if (code) {
        console.error("Login failed:", window.wialon.core.Errors.getErrorText(code));
        return;
      }

      const flags = window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastMessage;
      session.loadLibrary("itemIcon");
      session.updateDataFlags([{ type: "type", data: "avl_unit", flags, mode: 0 }], (code: number) => {
        if (code) {
          console.error("Data flag update failed:", window.wialon.core.Errors.getErrorText(code));
          return;
        }

        const rawUnits = session.getItems("avl_unit");
        const processedUnits = rawUnits.map((u: any) => {
          const pos = u.getPosition ? u.getPosition() : null;
          return {
            name: u.getName(),
            lat: pos?.y ?? 0,
            lon: pos?.x ?? 0
          };
        });

        setUnits(processedUnits);
      });
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Wialon Units</h2>
      {units.length === 0 && <p>No units found or loading...</p>}
      <ul>
        {units.map((unit, idx) => (
          <li key={idx}>
            <strong>{unit.name}</strong> – Lat: {unit.lat}, Lon: {unit.lon} –
            <a href={`https://maps.google.com/?q=${unit.lat},${unit.lon}`} target="_blank" rel="noreferrer"> [Map]</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WialonUnitsPage;
