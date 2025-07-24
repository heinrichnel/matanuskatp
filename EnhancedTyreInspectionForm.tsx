import React, { useState } from "react";
import { TyreInspectionPDFGenerator } from "@/components/TyreInspectionPDFGenerator";

const EnhancedTyreInspectionForm: React.FC = () => {
  const [odometer, setOdometer] = useState<number | "">("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [inspectionData, setInspectionData] = useState<any>(null);

  const handlePhotoCapture = () => {
    alert("Photo capture not implemented yet.");
  };

  const handleSignature = () => {
    alert("Signature capture not implemented yet.");
  };

  const handleLocation = () => {
    alert("Location capture not implemented yet.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInspectionData({
      vehicleId: "ABC123",
      position: "Front Left",
      inspectionDate: new Date().toISOString().slice(0, 10),
      inspectorName: "John Doe",
      previousOdometer: 10000,
      currentOdometer: odometer || 0,
      distanceTraveled: (odometer || 0) - 10000,
      treadDepth: 8,
      pressure: 110,
      condition: "good",
      damage: "none",
      location: location ? `${location.lat},${location.lng}` : "",
      notes: "",
      signature: signature || "",
    });
    alert("Inspection submitted (placeholder).");
  };

  return (
    <form className="max-w-lg mx-auto p-4 bg-white rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Enhanced Tyre Inspection</h2>
      <label className="block mb-2">
        Odometer Reading
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={odometer}
          onChange={e => setOdometer(Number(e.target.value))}
          required
        />
      </label>
      <button type="button" className="btn mb-2" onClick={handlePhotoCapture}>
        Capture Photo
      </button>
      {photo && <img src={photo} alt="Tyre" className="mb-2 w-32 h-32 object-cover" />}
      <button type="button" className="btn mb-2" onClick={handleSignature}>
        Sign Inspection
      </button>
      {signature && <img src={signature} alt="Signature" className="mb-2 w-32 h-16 object-contain" />}
      <button type="button" className="btn mb-2" onClick={handleLocation}>
        Capture Location
      </button>
      {location && (
        <div className="mb-2 text-xs">
          Location: {location.lat}, {location.lng}
        </div>
      )}
      <button type="submit" className="btn btn-primary w-full">
        Submit Inspection
      </button>
      {inspectionData && (
        <div className="mt-4">
          <TyreInspectionPDFGenerator
            inspectionData={inspectionData}
            vehicleName="ABC123"
          />
        </div>
      )}
    </form>
  );
};

export default EnhancedTyreInspectionForm;



import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
