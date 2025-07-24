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
    // Removed invalid eslint-disable-next-line
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
