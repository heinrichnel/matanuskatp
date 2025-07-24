impor  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [inspectionData, setInspectionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);act, { useState, useEffect } from "react";
import { QRCode } from "qrcode.react";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useLocation } from "react-router-dom";

// Using a relative import instead of an alias import to fix build issues
import { TyreInspectionPDFGenerator } from "../../components/TyreInspectionPDFGenerator";

interface TyreInspectionFormProps {
  fleetNumber?: string;
  position?: string;
  onComplete?: (data: any) => void;
}

const EnhancedTyreInspectionForm: React.FC<TyreInspectionFormProps> = ({
  fleetNumber,
  position,
  onComplete
}) => {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Use provided props or extract from URL params/query
  const vehicleId = fleetNumber || params.fleetId || queryParams.get('fleet') || '';
  const tyrePosition = position || params.position || queryParams.get('position') || '';
  
  const [odometer, setOdometer] = useState<number | "">("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
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



HOOKS

use-mobile.tsx

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

useCapacitor.ts

import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      const status = await BarcodeScanner.checkPermission({ force: false });
      setHasPermissions(status.granted);
    } catch (error) {
      console.error('Permission check failed:', error);
    }
  };

  const requestPermissions = async () => {
    if (!Capacitor.isNativePlatform()) return false;
    
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      setHasPermissions(status.granted);
      return status.granted;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  const scanQRCode = async (): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) return null;
    
    try {
      await requestPermissions();
      if (!hasPermissions) return null;

      // Hide the website background
      document.body.style.background = 'transparent';
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();
      
      // Show the website background again
      document.body.style.background = '';
      BarcodeScanner.showBackground();

      if (result.hasContent) {
        return result.content;
      }
      return null;
    } catch (error) {
      console.error('QR scan failed:', error);
      // Ensure background is restored on error
      document.body.style.background = '';
      BarcodeScanner.showBackground();
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) return null;
    
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      
      return image.base64String || null;
    } catch (error) {
      console.error('Photo capture failed:', error);
      return null;
    }
  };

  const stopScan = () => {
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
      document.body.style.background = '';
      BarcodeScanner.showBackground();
    }
  };

  return {
    isNative,
    hasPermissions,
    scanQRCode,
    takePhoto,
    stopScan,
    requestPermissions
  };
};



capacitor.config.ts

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f9673ef592af4161819b7d91c56bee83',
  appName: 'matanuskatransport',
  webDir: 'dist',
  server: {
    url: 'https://f9673ef5-92af-4161-819b-7d91c56bee83.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BarcodeScanner: {
      allowDuplicates: true,
      showZoom: true,
      showFlip: true,
      androidScanningLibrary: 'zxing'
    },
    Camera: {
      saveToGallery: false,
      resultType: 'base64'
    }
  }
};

export default config;