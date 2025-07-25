import React, { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Scan, Camera as CameraIcon, X, Check, RefreshCw, Info } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader } from '../../ui/Card';

interface TyreScannerProps {
  onScanComplete: (data: { barcode?: string; photo?: string }) => void;
  onCancel: () => void;
  scanMode: 'barcode' | 'photo' | 'both';
  title?: string;
}

interface ScanResult {
  barcode?: string;
  photo?: string;
}

const TyreScanner: React.FC<TyreScannerProps> = ({
  onScanComplete,
  onCancel,
  scanMode = 'both',
  title = 'Scan Tyre'
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult>({});
  const [error, setError] = useState<string | null>(null);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const status = await BarcodeScanner.checkPermission({ force: true });
        setHasPermission(status.granted);
      } else {
        setHasPermission(true); // Web fallback
      }
    } catch (err) {
      console.error('Permission check failed:', err);
      setHasPermission(false);
    }
  };

  const startBarcodeScanning = async () => {
    try {
      setIsScanning(true);
      setError(null);

      if (!isNativeApp) {
        // Web fallback - show manual input
        const barcode = prompt('Enter barcode manually:');
        if (barcode) {
          setScanResult(prev => ({ ...prev, barcode }));
        }
        setIsScanning(false);
        return;
      }

      // Hide background
      await BarcodeScanner.hideBackground();
      document.body.classList.add('scanner-active');

      const result = await BarcodeScanner.startScan();
      
      if (result.hasContent) {
        setScanResult(prev => ({ ...prev, barcode: result.content }));
      }
    } catch (err) {
      console.error('Barcode scanning failed:', err);
      setError('Failed to scan barcode. Please try again.');
    } finally {
      setIsScanning(false);
      document.body.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();
    }
  };

  const takePhoto = async () => {
    try {
      setError(null);

      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        const photoData = `data:image/jpeg;base64,${image.base64String}`;
        setScanResult(prev => ({ ...prev, photo: photoData }));
      }
    } catch (err) {
      console.error('Photo capture failed:', err);
      setError('Failed to take photo. Please try again.');
    }
  };

  const stopScanning = async () => {
    try {
      if (isNativeApp) {
        await BarcodeScanner.stopScan();
        await BarcodeScanner.showBackground();
        document.body.classList.remove('scanner-active');
      }
      setIsScanning(false);
    } catch (err) {
      console.error('Failed to stop scanning:', err);
    }
  };

  const handleComplete = () => {
    onScanComplete(scanResult);
  };

  const handleReset = () => {
    setScanResult({});
    setError(null);
  };

  if (hasPermission === null) {
    return (
      <Card className="mx-4 mt-4">
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p>Checking camera permissions...</p>
        </CardContent>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card className="mx-4 mt-4">
        <CardContent className="p-6 text-center">
          <Info className="h-8 w-8 mx-auto mb-4 text-yellow-500" />
          <h3 className="font-semibold mb-2">Camera Permission Required</h3>
          <p className="text-gray-600 mb-4">
            Please enable camera permissions to scan barcodes and take photos.
          </p>
          <Button onClick={checkPermissions} className="mr-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Again
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={isScanning ? stopScanning : onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Scanning Controls */}
          {(scanMode === 'barcode' || scanMode === 'both') && (
            <div className="space-y-2">
              <Button
                onClick={startBarcodeScanning}
                disabled={isScanning}
                className="w-full"
                variant={scanResult.barcode ? "outline" : "default"}
              >
                <Scan className="h-4 w-4 mr-2" />
                {isScanning ? 'Scanning...' : scanResult.barcode ? 'Scan Again' : 'Scan Barcode'}
              </Button>
              
              {scanResult.barcode && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>Barcode:</strong> {scanResult.barcode}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Photo Controls */}
          {(scanMode === 'photo' || scanMode === 'both') && (
            <div className="space-y-2">
              <Button
                onClick={takePhoto}
                className="w-full"
                variant={scanResult.photo ? "outline" : "default"}
              >
                <CameraIcon className="h-4 w-4 mr-2" />
                {scanResult.photo ? 'Take Another Photo' : 'Take Photo'}
              </Button>
              
              {scanResult.photo && (
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800 mb-2">Photo captured successfully</p>
                    <img 
                      src={scanResult.photo} 
                      alt="Captured" 
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
              disabled={!scanResult.barcode && !scanResult.photo}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={handleComplete}
              className="flex-1"
              disabled={!scanResult.barcode && !scanResult.photo}
            >
              <Check className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 text-center pt-2">
            {isNativeApp ? (
              <p>Point camera at barcode to scan automatically</p>
            ) : (
              <p>Web version - manual barcode entry available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scanner overlay styles */}
      <style>{`
        .scanner-active {
          visibility: hidden;
        }
        .scanner-active .scanner-ui {
          visibility: visible;
        }
      `}</style>
    </div>
  );
};

export default TyreScanner;
