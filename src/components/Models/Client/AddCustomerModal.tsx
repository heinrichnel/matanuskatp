import { CloseOutlined, SaveOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface NewCustomer {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  industry: string;
  clientType: string;
  contractValue: number;
  contractStartDate: string;
  notes?: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: NewCustomer) => Promise<void>;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  const industries = [
    "Manufacturing",
    "Retail",
    "Construction",
    "Healthcare",
    "Technology",
    "Food & Beverage",
    "Automotive",
    "Energy",
    "Agriculture",
    "Other",
  ];

  const clientTypes = [
    "Enterprise",
    "Small Business",
    "Medium Business",
    "Government",
    "Non-Profit",
  ];

  const handleFinish = async (values: NewCustomer) => {
    setLoading(true);
    try {
      await onSubmit(values);
      message.success("Customer added successfully");
      onClose();
    } catch (error) {
      console.error("Error adding customer:", error);
      message.error("Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <UserAddOutlined style={{ marginRight: "8px" }} />
          <span>Add New Customer</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
      destroyOnClose
    >
      <Text type="secondary" style={{ display: "block", marginBottom: "16px" }}>
        Enter the details for a new client to add them to your customer database
      </Text>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          clientType: "Small Business",
          industry: "Other",
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="contactPerson"
              label="Primary Contact Person"
              rules={[{ required: true, message: "Please enter contact person name" }]}
            >
              <Input placeholder="Enter contact person name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input placeholder="email@company.com" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="(555) 123-4567" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Street Address"
          rules={[{ required: true, message: "Please enter street address" }]}
        >
          <Input placeholder="Enter street address" />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input placeholder="City" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please enter state" }]}
            >
              <Input placeholder="State" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="zipCode"
              label="ZIP Code"
              rules={[{ required: true, message: "Please enter ZIP code" }]}
            >
              <Input placeholder="ZIP Code" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="industry"
              label="Industry"
              rules={[{ required: true, message: "Please select an industry" }]}
            >
              <Select placeholder="Select industry">
                {industries.map((industry) => (
                  <Option key={industry} value={industry}>
                    {industry}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="clientType"
              label="Client Type"
              rules={[{ required: true, message: "Please select client type" }]}
            >
              <Select placeholder="Select client type">
                {clientTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="contractValue"
              label="Initial Contract Value ($)"
              rules={[{ required: true, message: "Please enter contract value" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                precision={2}
                placeholder="0.00"
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, "")) as any}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="contractStartDate"
              label="Contract Start Date"
              rules={[{ required: true, message: "Please select contract start date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="notes" label="Notes">
          <TextArea
            rows={4}
            placeholder="Any additional information about this client (optional)"
          />
        </Form.Item>

        <Divider />

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={onClose} icon={<CloseOutlined />}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
              Add Customer
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
