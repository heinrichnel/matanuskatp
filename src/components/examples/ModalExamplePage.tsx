import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import ModalFormExample from './ModalFormExample';
import ModalFormDemo from './ModalFormDemo';
import FormModalExample from './FormModalExample';
import DynamicFormModal from './DynamicFormModal';
import Card, { CardContent, CardHeader } from '../ui/Card';

const ModalExamplePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Modal Form Examples</h1>
      <p className="text-gray-600">
        These examples demonstrate different ways to implement modal forms in your application.
      </p>

      <Card>
        <CardHeader title="Modal Form Components" />
        <CardContent>
          <p className="mb-4">
            The following components are available for creating modal forms:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>ModalForm</strong> - A complete form solution with field definitions, validation, and submission handling
            </li>
            <li>
              <strong>FormModal</strong> - A simpler wrapper for custom forms when you need more control over the form content
            </li>
            <li>
              <strong>Modal</strong> - The base modal component that can be used for any content, not just forms
            </li>
          </ul>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Example</TabsTrigger>
          <TabsTrigger value="crud">CRUD Operations</TabsTrigger>
          <TabsTrigger value="custom">Custom Form</TabsTrigger>
          <TabsTrigger value="dynamic">Dynamic Fields</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader title="Basic Modal Form" />
            <CardContent>
              <p className="mb-4">
                This example shows a basic modal form with various field types, validation, and submission handling.
              </p>
              <ModalFormExample />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="crud" className="space-y-6">
          <Card>
            <CardHeader title="CRUD Operations with Modal Forms" />
            <CardContent>
              <p className="mb-4">
                This example demonstrates how to use modal forms for Create, Read, Update, and Delete operations.
              </p>
              <ModalFormDemo />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader title="Custom Form Layout" />
            <CardContent>
              <p className="mb-4">
                This example shows how to create a custom form layout inside a modal using the FormModal component.
              </p>
              <FormModalExample />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dynamic" className="space-y-6">
          <Card>
            <CardHeader title="Dynamic Form Fields" />
            <CardContent>
              <p className="mb-4">
                This example demonstrates a form with dynamic fields that can be added or removed by the user.
              </p>
              <DynamicFormModal />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModalExamplePage;