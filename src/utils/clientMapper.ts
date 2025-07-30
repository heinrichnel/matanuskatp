import { Client } from "../types/client";

// This interface represents the client structure used in the UI components
export interface UIClient {
  id: string;
  client: string; // maps to name in Client
  contact: string; // maps to contactPerson in Client
  city: string; // maps to address.city in Client
  area?: string;
  zipCode?: string;
  poBox?: string;
  postalCity?: string;
  postalZip?: string;
  companyReg?: string;
  vatNo?: string;
  telNo1?: string;
  telNo2?: string;
  fax?: string;
  smsNo?: string;
  email: string;
  address?: string;
  isActive: boolean; // maps to status === 'active'
}

// Convert from API Client type to UI Client type
export function toUIClient(client: Client): UIClient {
  return {
    id: client.id,
    client: client.name,
    contact: client.contactPerson,
    city: client.address.city,
    email: client.email,
    telNo1: client.phone,
    address: `${client.address.street}, ${client.address.city}, ${client.address.state} ${client.address.postalCode}, ${client.address.country}`,
    isActive: client.status === "active",
    // Optional fields with empty defaults
    area: "",
    zipCode: client.address.postalCode,
    poBox: "",
    postalCity: "",
    postalZip: "",
    companyReg: client.registrationNumber,
    vatNo: client.vatNumber,
    telNo2: "",
    fax: "",
    smsNo: "",
  };
}

// Convert from UI Client type to API Client type
export function fromUIClient(uiClient: UIClient): Client {
  return {
    id: uiClient.id,
    name: uiClient.client,
    type: "external", // Default
    status: uiClient.isActive ? "active" : "inactive",
    contactPerson: uiClient.contact || "",
    email: uiClient.email || "",
    phone: uiClient.telNo1 || "",
    address: {
      street: "",
      city: uiClient.city || "",
      state: "",
      postalCode: uiClient.zipCode || "",
      country: "",
    },
    currency: "ZAR", // Default
    vatNumber: uiClient.vatNo,
    registrationNumber: uiClient.companyReg,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relationships: [],
  };
}
