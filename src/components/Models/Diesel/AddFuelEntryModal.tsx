import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Alert,
  Upload,
  message
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Truck } from 'lucide-react';

const { Text } = Typography;
const { Option } = Select;

interface FuelEntry {
  vehicleId: string;
  driverId: string;
  date: string;
  fuelAmount: number;
  odometerReading: number;
  costPerLiter: number;
  totalCost: number;
  location: string;
  fuelCardNumber?: string;
  notes?: string;
  receiptImage?: File | null;
}

interface AddFuelEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FuelEntry) => Promise<void>;
  initialValues?: Partial<FuelEntry>;
}

const AddFuelEntryModal: React.FC<AddFuelEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues = {}
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
      setCalculatedCost(null);
    }
  }, [isOpen, form, initialValues]);

  const vehicles = [
    { id: 'V001', name: 'Truck 101 - Kenworth T680' },
    { id: 'V002', name: 'Truck 102 - Freightliner Cascadia' },
    { id: 'V003', name: 'Truck 103 - Peterbilt 579' },
    { id: 'V004', name: 'Truck 104 - Volvo VNL' }
  ];

  const drivers = [
    { id: 'D001', name: 'John Doe' },
    { id: 'D002', name: 'Jane Smith' },
    { id: 'D003', name: 'Mike Johnson' },
    { id: 'D004', name: 'Sarah Williams' }
  ];

  const fuelCards = [
    { id: 'FC001', number: '**** **** **** 1234' },
    { id: 'FC002', number: '**** **** **** 5678' },
    { id: 'FC003', number: '**** **** **** 9012' }
  ];

  const calculateTotalCost = (amount: number | null, costPerLiter: number | null) => {
    if (amount && costPerLiter) {
      const total = amount * costPerLiter;
      setCalculatedCost(total);
      form.setFieldsValue({ totalCost: total });
    }
  };

  const handleFuelAmountChange = (value: number | null) => {
    if (value === null) return;
    const costPerLiter = form.getFieldValue('costPerLiter');
    calculateTotalCost(value, costPerLiter);
  };

  const handleCostPerLiterChange = (value: number | null) => {
    if (value === null) return;
    const fuelAmount = form.getFieldValue('fuelAmount');
    calculateTotalCost(fuelAmount, value);
  };

  const handleFinish = async (values: FuelEntry) => {
    setLoading(true);
    try {
      await onSubmit(values);
      message.success('Fuel entry added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding fuel entry:', error);
      message.error('Failed to add fuel entry');
    } finally {
      setLoading(false);
    }
  };

  // Display a truck icon with vehicle information
  const renderVehicleIcon = () => {
    const selectedVehicleId = form.getFieldValue('vehicleId');
    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    return (
      <div className="vehicle-icon-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Truck className="w-6 h-6 mr-2 text-blue-500" />
        <span>{selectedVehicle ? selectedVehicle.name : 'Select a vehicle'}</span>
      </div>
    );
  };

  return (
    <Modal
      title="Add Fuel Entry"
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
      destroyOnClose
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        Record a new fuel purchase for your fleet vehicles
      </Text>

      {/* Use the Truck component */}
      {form.getFieldValue('vehicleId') && renderVehicleIcon()}

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          date: null,
          fuelAmount: null,
          odometerReading: null,
          costPerLiter: null,
          totalCost: null,
          ...initialValues
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="vehicleId"
              label="Vehicle"
              rules={[{ required: true, message: 'Please select a vehicle' }]}
            >
              <Select placeholder="Select vehicle">
                {vehicles.map(vehicle => (
                  <Option key={vehicle.id} value={vehicle.id}>{vehicle.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="driverId"
              label="Driver"
              rules={[{ required: true, message: 'Please select a driver' }]}
            >
              <Select placeholder="Select driver">
                {drivers.map(driver => (
                  <Option key={driver.id} value={driver.id}>{driver.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="date"
              label="Date of Purchase"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="location"
              label="Fuel Station Location"
              rules={[{ required: true, message: 'Please enter the location' }]}
            >
              <Input placeholder="E.g., Shell Station, Highway 95" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="fuelAmount"
              label="Fuel Amount (Liters)"
              rules={[{ required: true, message: 'Please enter fuel amount' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                onChange={handleFuelAmountChange}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="costPerLiter"
              label="Cost Per Liter ($)"
              rules={[{ required: true, message: 'Please enter cost per liter' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={3}
                onChange={handleCostPerLiterChange}
                placeholder="0.000"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="totalCost"
              label="Total Cost ($)"
              rules={[{ required: true, message: 'Please enter total cost' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                disabled
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="odometerReading"
              label="Odometer Reading (km)"
              rules={[{ required: true, message: 'Please enter odometer reading' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={0}
                placeholder="Enter current odometer reading"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="fuelCardNumber"
              label="Fuel Card Used"
            >
              <Select placeholder="Select fuel card (optional)">
                <Option value="">No fuel card used</Option>
                {fuelCards.map(card => (
                  <Option key={card.id} value={card.id}>{card.number}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea
            rows={3}
            placeholder="Any additional information about this fuel purchase"
          />
        </Form.Item>

        <Form.Item
          name="receiptImage"
          label="Receipt Image"
          valuePropName="fileList"
          getValueFromEvent={e => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            name="receiptImage"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Receipt</Button>
          </Upload>
        </Form.Item>

        {calculatedCost !== null && (
          <Alert
            message={`Calculated Cost: $${calculatedCost.toFixed(2)}`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Divider />

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button
              onClick={onClose}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              Submit Entry
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFuelEntryModal;
