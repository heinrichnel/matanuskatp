import React from "react";
import { Button, Card, CardContent, Modal } from "@/components/ui";
import { FileWarning, CheckCircle, AlertTriangle, FileText, ArrowRight, Wrench } from "lucide-react";

interface InspectionDetailsModalProps {
  inspection: {
    report: string;
    date: string;
    vehicle: string;
    vehicleName?: string;
    vin?: string;
    meterReading?: string;
    location: string;
    inspector: string;
    form: string;
    notes: string;
    faultCount: number;
    correctiveAction: string;
    workOrder: string;
    defects?: {
      repair: string[];
      replace: string[];
    };
    status?: {
      inspection: string;
      workOrder: string | null;
      completion: string | null;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function InspectionDetailsModal({ inspection, isOpen, onClose }: InspectionDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inspection Details: ${inspection.report}`}
      maxWidth="2xl"
    >
      <div className="p-6">
        {/* Inspection Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Basic Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-medium">Inspection Date:</span>
                  <span className="col-span-2">{inspection.date}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-medium">Vehicle:</span>
                  <span className="col-span-2">{inspection.vehicle}</span>
                </div>
                {inspection.vehicleName && (
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Vehicle Name:</span>
                    <span className="col-span-2">{inspection.vehicleName}</span>
                  </div>
                )}
                {inspection.vin && (
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">VIN:</span>
                    <span className="col-span-2">{inspection.vin}</span>
                  </div>
                )}
                {inspection.meterReading && (
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Meter Reading:</span>
                    <span className="col-span-2">{inspection.meterReading}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-medium">Location:</span>
                  <span className="col-span-2">{inspection.location}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-medium">Inspector:</span>
                  <span className="col-span-2">{inspection.inspector}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" /> Status Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-medium">Form Type:</span>
                  <span className="col-span-2">{inspection.form}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-medium">Fault Count:</span>
                  <span className="col-span-2 font-semibold text-red-600">{inspection.faultCount}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-medium">Work Order:</span>
                  <span className="col-span-2 text-blue-600 font-semibold">{inspection.workOrder}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-medium">Corrective Action:</span>
                  <span className={`col-span-2 font-semibold ${
                    inspection.correctiveAction === "TAKEN"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}>
                    {inspection.correctiveAction}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Status */}
        {inspection.status && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Workflow Status</h3>
              <div className="flex items-center justify-between px-2 py-4 overflow-x-auto">
                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-2 ${inspection.status.inspection === "COMPLETED" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    <FileWarning className="h-6 w-6" />
                  </div>
                  <span className="text-sm mt-1">Inspection</span>
                  <span className="text-xs text-gray-500">COMPLETED</span>
                </div>

                <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />

                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-2 ${inspection.status.workOrder ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="text-sm mt-1">Work Order</span>
                  <span className="text-xs text-gray-500">{inspection.status.workOrder || "PENDING"}</span>
                </div>

                <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />

                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-2 ${inspection.correctiveAction === "TAKEN" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    <Wrench className="h-6 w-6" />
                  </div>
                  <span className="text-sm mt-1">Repair</span>
                  <span className="text-xs text-gray-500">{inspection.correctiveAction === "TAKEN" ? "COMPLETED" : "PENDING"}</span>
                </div>

                <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />

                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-2 ${inspection.status.completion ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <span className="text-sm mt-1">Closed</span>
                  <span className="text-xs text-gray-500">{inspection.status.completion || "PENDING"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Inspector Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{inspection.notes}</p>
          </CardContent>
        </Card>

        {/* Defect Items */}
        {inspection.defects && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" /> Defect Items ({inspection.faultCount})
              </h3>

              {inspection.defects.repair.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Repair Required:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {inspection.defects.repair.map((item, index) => (
                      <li key={`repair-${index}`} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {inspection.defects.replace.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Replacements Required:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {inspection.defects.replace.map((item, index) => (
                      <li key={`replace-${index}`} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {inspection.defects.repair.length === 0 && inspection.defects.replace.length === 0 && (
                <p className="text-gray-500 italic">No detailed defect information available</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm/6 font-semibold text-gray-900" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Work Order
          </button>
        </div>
      </div>
    </Modal>
  );
}
