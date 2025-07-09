import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Form from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Save, X } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface TyrePerformanceData {
  fleetNumber: string;
  tyrePosition: string;
  brand: string;
  model: string;
  serialNumber: string;
  installationDate: string;
  currentMileage: number;
  treadDepth: number;
  pressure: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
}

interface TyrePerformanceFormProps {
  onSubmit: (data: TyrePerformanceData) => void;
  onClose: () => void;
  initialData?: Partial<TyrePerformanceData>;
}

export const TyrePerformanceForm: React.FC<TyrePerformanceFormProps> = ({
  onSubmit,
  onClose,
  initialData
}) => {
  const methods = useForm<TyrePerformanceData>({
    defaultValues: {
      fleetNumber: '',
      tyrePosition: '',
      brand: '',
      model: '',
      serialNumber: '',
      installationDate: '',
      currentMileage: 0,
      treadDepth: 0,
      pressure: 0,
      condition: 'good',
      notes: '',
      ...initialData
    }
  });

  const handleSubmit = (data: TyrePerformanceData) => {
    onSubmit(data);
    methods.reset();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tyre Performance Entry</CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={methods.control}
                name="fleetNumber"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Fleet Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 21H" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />

              <FormField
                control={methods.control}
                name="tyrePosition"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Tyre Position</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full border rounded px-3 py-2">
                          <option value="">Select Position</option>
                          <option value="FL">Front Left</option>
                          <option value="FR">Front Right</option>
                          <option value="RL1">Rear Left Outer</option>
                          <option value="RL2">Rear Left Inner</option>
                          <option value="RR1">Rear Right Inner</option>
                          <option value="RR2">Rear Right Outer</option>
                          <option value="SPARE">Spare</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={methods.control}
                name="brand"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Michelin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />

              <FormField
                control={methods.control}
                name="model"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. X Line Energy D" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />

              <FormField
                control={methods.control}
                name="serialNumber"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Serial/DOT Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={methods.control}
                name="installationDate"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Installation Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />

              <FormField
                control={methods.control}
                name="currentMileage"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Current Mileage (km)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={methods.control}
                name="treadDepth"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Tread Depth (mm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="0.0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />

              <FormField
                control={methods.control}
                name="pressure"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Pressure (PSI)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />

              <FormField
                control={methods.control}
                name="condition"
                render={({ field }: { field: any }) => (
                  <FormField>
                    <FormItem>
                      <FormLabel>Overall Condition</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full border rounded px-3 py-2">
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                )}
              />
            </div>

            <FormField
              control={methods.control}
              name="notes"
              render={({ field }: { field: any }) => (
                <FormField>
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <textarea 
                        {...field}
                        className="w-full border rounded px-3 py-2 h-20 resize-none"
                        placeholder="Additional observations, maintenance notes, etc."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
              <Button size="sm" type="submit">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TyrePerformanceForm;
