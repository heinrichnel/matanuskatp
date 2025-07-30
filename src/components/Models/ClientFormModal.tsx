// src/components/Clients/ClientFormModal.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// --- Types ---
import { UIClient } from "../../utils/clientMapper";

// --- UI Components ---
import Button from "../ui/Button";
import { Input } from "../ui/FormElements"; // Assuming you have these
import Modal from "../ui/Modal";
// Assuming you have a Select component for dropdowns if needed in form
// import { Select } from '../ui/FormElements';

// --- Icons ---
import { Save, X } from "lucide-react";

// --- Zod Schema for Validation ---
const clientFormSchema = z.object({
  client: z.string().min(1, "Client name is required").trim(),
  city: z.string().optional(),
  address: z.string().optional(),
  area: z.string().optional(),
  zipCode: z.string().optional(),
  poBox: z.string().optional(),
  postalCity: z.string().optional(),
  postalZip: z.string().optional(),
  companyReg: z.string().optional(),
  vatNo: z.string().optional(),
  contact: z.string().optional(),
  telNo1: z.string().optional(),
  telNo2: z.string().optional(),
  fax: z.string().optional(),
  smsNo: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  isActive: z.boolean().default(true).optional(), // Assuming isActive can be part of the form
});

// Infer the TypeScript type from the Zod schema for form data
type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingClient: UIClient | null; // Null for new, UIClient for edit
  onSave: (client: UIClient) => Promise<void>; // Prop to handle saving
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  editingClient,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      client: "",
      isActive: true, // Default for new clients
    },
  });

  // Effect to reset form data when editingClient changes (for edit mode)
  useEffect(() => {
    if (editingClient) {
      reset({
        client: editingClient.client,
        city: editingClient.city || "",
        address: editingClient.address || "",
        area: editingClient.area || "",
        zipCode: editingClient.zipCode || "",
        poBox: editingClient.poBox || "",
        postalCity: editingClient.postalCity || "",
        postalZip: editingClient.postalZip || "",
        companyReg: editingClient.companyReg || "",
        vatNo: editingClient.vatNo || "",
        contact: editingClient.contact || "",
        telNo1: editingClient.telNo1 || "",
        telNo2: editingClient.telNo2 || "",
        fax: editingClient.fax || "",
        smsNo: editingClient.smsNo || "",
        email: editingClient.email || "",
        isActive: editingClient.isActive ?? true, // Use nullish coalescing for boolean
      });
    } else {
      // Reset to default values for new entry
      reset({
        client: "",
        city: "",
        address: "",
        area: "",
        zipCode: "",
        poBox: "",
        postalCity: "",
        postalZip: "",
        companyReg: "",
        vatNo: "",
        contact: "",
        telNo1: "",
        telNo2: "",
        fax: "",
        smsNo: "",
        email: "",
        isActive: true,
      });
    }
  }, [editingClient, reset, isOpen]); // Added isOpen to dependencies to reset on modal open

  const onSubmit = async (data: ClientFormData) => {
    try {
      // Create a UIClient object from form data
      const uiClient: UIClient = {
        id: editingClient?.id ?? "",
        client: data.client || "",
        contact: data.contact || "",
        city: data.city || "",
        address: data.address || "",
        area: data.area || "",
        zipCode: data.zipCode || "",
        poBox: data.poBox || "",
        postalCity: data.postalCity || "",
        postalZip: data.postalZip || "",
        companyReg: data.companyReg || "",
        vatNo: data.vatNo || "",
        telNo1: data.telNo1 || "",
        telNo2: data.telNo2 || "",
        fax: data.fax || "",
        smsNo: data.smsNo || "",
        email: data.email || "",
        isActive: data.isActive ?? true,
      };

      await onSave(uiClient);
      onClose(); // Close modal on successful save
    } catch (error) {
      console.error("Error saving client:", error);
      // useToast() or global error handler should be integrated here
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingClient ? "Edit Client" : "Add New Client"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="client"
            control={control}
            render={({ field }) => (
              <Input
                label="Client Name *"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="e.g., ABC Logistics"
                error={errors.client?.message}
              />
            )}
          />
          <Controller
            name="contact"
            control={control}
            render={({ field }) => (
              <Input
                label="Contact Person"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="e.g., John Doe"
                error={errors.contact?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                label="Email"
                type="email"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="e.g., contact@client.com"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            name="telNo1"
            control={control}
            render={({ field }) => (
              <Input
                label="Telephone 1"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="e.g., +27 11 123 4567"
                error={errors.telNo1?.message}
              />
            )}
          />
          <Controller
            name="telNo2"
            control={control}
            render={({ field }) => (
              <Input
                label="Telephone 2"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="e.g., +27 82 123 4567"
                error={errors.telNo2?.message}
              />
            )}
          />
          <Controller
            name="fax"
            control={control}
            render={({ field }) => (
              <Input
                label="Fax"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.fax?.message}
              />
            )}
          />
          <Controller
            name="smsNo"
            control={control}
            render={({ field }) => (
              <Input
                label="SMS Number"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.smsNo?.message}
              />
            )}
          />
          <Controller
            name="companyReg"
            control={control}
            render={({ field }) => (
              <Input
                label="Company Reg. No."
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.companyReg?.message}
              />
            )}
          />
          <Controller
            name="vatNo"
            control={control}
            render={({ field }) => (
              <Input
                label="VAT No."
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.vatNo?.message}
              />
            )}
          />
        </div>

        <h4 className="text-lg font-semibold text-gray-800 pt-4 border-t">Physical Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                label="Address"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="e.g., 123 Main St"
                error={errors.address?.message}
              />
            )}
          />
          <Controller
            name="area"
            control={control}
            render={({ field }) => (
              <Input
                label="Area"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="e.g., City Deep"
                error={errors.area?.message}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                label="City"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="e.g., Johannesburg"
                error={errors.city?.message}
              />
            )}
          />
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <Input
                label="Zip Code"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.zipCode?.message}
              />
            )}
          />
        </div>

        <h4 className="text-lg font-semibold text-gray-800 pt-4 border-t">Postal Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="poBox"
            control={control}
            render={({ field }) => (
              <Input
                label="PO Box"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.poBox?.message}
              />
            )}
          />
          <Controller
            name="postalCity"
            control={control}
            render={({ field }) => (
              <Input
                label="Postal City"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.postalCity?.message}
              />
            )}
          />
          <Controller
            name="postalZip"
            control={control}
            render={({ field }) => (
              <Input
                label="Postal Zip"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.postalZip?.message}
              />
            )}
          />
        </div>

        {editingClient && ( // Only show isActive checkbox in edit mode
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Client is Active
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" icon={<Save className="w-4 h-4" />} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingClient ? "Update Client" : "Add Client"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormModal;
