import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Input, Select } from '../ui/FormElements';
import { QrCode, Download, Truck, Wrench, Clipboard, ExternalLink } from 'lucide-react';

const QRGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<string>('fleet');
  const [fleetNumber, setFleetNumber] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [partNumber, setPartNumber] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');
  const [qrGenerated, setQrGenerated] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  
  // Mock data for dropdowns
  const fleetNumbers = [
    '21H', '22H', '23H', '24H', '26H', '28H', '31H', '32H', '33H',
    '1T', '2T', '3T', '4T', '4F', '5F', '6F', '7F', '8F'
  ];
  
  const positions = [
    'Front Left', 'Front Right', 'Rear Left', 'Rear Right',
    'Position 1', 'Position 2', 'Position 3', 'Position 4',
    'Position 5', 'Position 6', 'Position 7', 'Position 8'
  ];
  
  // Generate QR code
  const generateQR = () => {
    let value = '';
    
    switch(qrType) {
      case 'fleet':
        value = `FLEET:${fleetNumber}`;
        setDescription(`Fleet Vehicle: ${fleetNumber}`);
        break;
      case 'tyre':
        value = `TYRE:${fleetNumber}:${position}`;
        setDescription(`Tyre: ${fleetNumber} - ${position}`);
        break;
      case 'part':
        value = `PART:${partNumber}`;
        setDescription(`Part: ${partNumber}`);
        break;
      default:
        value = '';
    }
    
    setQrValue(value);
    setQrGenerated(true);
  };
  
  // Reset form
  const resetForm = () => {
    setFleetNumber('');
    setPosition('');
    setPartNumber('');
    setQrValue('');
    setQrGenerated(false);
  };
  
  // Handle QR type change
  const handleTypeChange = (type: string) => {
    setQrType(type);
    resetForm();
  };
  
  // Validate form before generation
  const isFormValid = () => {
    switch(qrType) {
      case 'fleet':
        return !!fleetNumber;
      case 'tyre':
        return !!fleetNumber && !!position;
      case 'part':
        return !!partNumber;
      default:
        return false;
    }
  };
  
  // Mock download function
  const downloadQR = () => {
    alert('In a production environment, this would download a high-resolution QR code image that could be printed and applied to vehicles, tyres, or parts for easy scanning and identification.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <QrCode className="w-7 h-7 mr-2 text-blue-500" />
            QR Code Generator
          </h2>
          <p className="text-gray-600">Generate QR codes for fleet vehicles, tyres, and parts</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Generate QR Code" />
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Type</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${qrType === 'fleet' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
                    onClick={() => handleTypeChange('fleet')}
                  >
                    <Truck className="w-6 h-6 mb-2" />
                    <span>Fleet Vehicle</span>
                  </button>
                  
                  <button
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${qrType === 'tyre' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
                    onClick={() => handleTypeChange('tyre')}
                  >
                    <div className="w-6 h-6 mb-2 rounded-full border-4 flex items-center justify-center">
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    </div>
                    <span>Tyre Position</span>
                  </button>
                  
                  <button
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${qrType === 'part' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white hover:bg-gray-50 border-gray-300'}`}
                    onClick={() => handleTypeChange('part')}
                  >
                    <Wrench className="w-6 h-6 mb-2" />
                    <span>Spare Part</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {qrType === 'fleet' && (
                  <Select
                    label="Fleet Number *"
                    value={fleetNumber}
                    onChange={setFleetNumber}
                    options={[
                      { label: 'Select fleet number...', value: '' },
                      ...fleetNumbers.map(fleet => ({ label: fleet, value: fleet }))
                    ]}
                  />
                )}
                
                {qrType === 'tyre' && (
                  <>
                    <Select
                      label="Fleet Number *"
                      value={fleetNumber}
                      onChange={setFleetNumber}
                      options={[
                        { label: 'Select fleet number...', value: '' },
                        ...fleetNumbers.map(fleet => ({ label: fleet, value: fleet }))
                      ]}
                    />
                    
                    <Select
                      label="Tyre Position *"
                      value={position}
                      onChange={setPosition}
                      options={[
                        { label: 'Select position...', value: '' },
                        ...positions.map(pos => ({ label: pos, value: pos }))
                      ]}
                    />
                  </>
                )}
                
                {qrType === 'part' && (
                  <Input
                    label="Part Number *"
                    value={partNumber}
                    onChange={setPartNumber}
                    placeholder="Enter part number (e.g. BP-1234)"
                  />
                )}
                
                <div className="pt-4">
                  <Button
                    onClick={generateQR}
                    disabled={!isFormValid()}
                    icon={<QrCode className="w-4 h-4" />}
                  >
                    Generate QR Code
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="QR Code Preview" />
          <CardContent>
            {qrGenerated ? (
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border">
                    {/* This would be a real QR code in production */}
                    <QrCode className="w-32 h-32 text-gray-800" />
                  </div>
                </div>
                
                <div className="mt-4 space-y-2 w-full">
                  <p className="font-medium text-gray-900">{description}</p>
                  <p className="text-sm text-gray-600">{qrValue}</p>
                  
                  <div className="pt-4 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={downloadQR}
                      icon={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`https://example.com/qr/${encodeURIComponent(qrValue)}`, '_blank')}
                      icon={<ExternalLink className="w-4 h-4" />}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                <Clipboard className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-gray-900 font-medium">No QR Code Generated</h3>
                <p className="text-gray-500 mt-2">
                  Fill in the required fields and click "Generate QR Code" to see a preview here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-800 mb-4">How to Use QR Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-700">
          <div className="space-y-2">
            <h3 className="font-medium">Fleet Vehicle QR Codes</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Place on vehicle dashboard</li>
              <li>Scan for quick access to vehicle history</li>
              <li>Use for maintenance check-ins</li>
              <li>Track services and inspections</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Tyre Position QR Codes</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Attach to wheel rims or hubs</li>
              <li>Scan during tyre inspections</li>
              <li>Track tyre rotation history</li>
              <li>Monitor tread wear and pressure</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Parts QR Codes</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Label spare parts inventory</li>
              <li>Scan for part specifications</li>
              <li>Track warranty information</li>
              <li>Manage inventory levels</li>
            </ul>
          </div>
        </div>
        <p className="text-blue-700 mt-4">
          In a production environment, these QR codes would link to specific views in the application, 
          allowing for seamless tracking and management of assets. The QR data would be stored in Firestore 
          for validation and tracking purposes.
        </p>
      </div>
    </div>
  );
};

export default QRGenerator;