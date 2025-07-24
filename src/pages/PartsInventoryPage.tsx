import React from "react";
import { Button } from "../components/ui/Button";
import Card, { CardContent } from "../components/ui/Card";
import Table from "../components/ui/Table";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Settings, Plus, Upload, Search } from "lucide-react";

const inventory = [
  {
    sku: "SKU367308",
    part: "Battery Plugs",
    quantity: "15 Piece",
    cost: "0",
    itemType: "",
    manufacturer: "MAT",
    supplier: "",
    description: "",
    site: "Matanuska Transport"
  },
  {
    sku: "SKU340314",
    part: "Female Air Coupling",
    quantity: "3 Piece",
    cost: "0",
    itemType: "",
    manufacturer: "MAT",
    supplier: "",
    description: "",
    site: "Matanuska Transport"
  },
  {
    sku: "SKU312825",
    part: "Air Cleaner (Sinotruck) K2436B4",
    quantity: "1 Piece",
    cost: "0",
    itemType: "",
    manufacturer: "MAT",
    supplier: "",
    description: "",
    site: "Matanuska Transport"
  },
  {
    sku: "SKU346825",
    part: "Rear Cab Air Bag",
    quantity: "1 Piece",
    cost: "0",
    itemType: "",
    manufacturer: "MAT",
    supplier: "",
    description: "",
    site: "Matanuska Transport"
  },
  {
    sku: "SKU393395",
    part: "Air Bag (BPW Eco Plus)",
    quantity: "0.0 Piece",
    cost: "0",
    itemType: "",
    manufacturer: "BPW",
    supplier: "",
    description: "",
    site: "Matanuska Transport"
  },
  {
    sku: "SKU217290",
    part: "Outsourced Repairs Labour",
    quantity: "1 Piece",
    cost: "100.47",
    itemType: "",
    manufacturer: "MAKHAZA TRUCK BODIES (PTY) LTD",
    supplier: "MAKHAZA TRUCK BODIES (PTY) LTD",
    description: "",
    site: "Matanuska Transport"
  },
  {
    sku: "SKU159281",
    part: "Turbo Charger - Shacman X3000 / 420HP (Weichai engine)",
    quantity: "1 Piece",
    cost: "10955",
    itemType: "NON STOCK ITEM",
    manufacturer: "Amcotts",
    supplier: "Amcotts",
    description: "Turbo Charger",
    site: "Matanuska Transport"
  }
];

export default function PartsInventoryPage() {
  // Add event handlers for all buttons
  const handlePartsCategoryClick = () => {
    console.log("Parts Category settings clicked");
  };
  
  const handleAddPartsClick = () => {
    console.log("Add Parts Item clicked");
  };
  
  const handleBulkUploadClick = () => {
    console.log("Bulk Upload clicked");
  };
  
  const handleActionClick = (sku: string) => {
    console.log(`Action clicked for item ${sku}`);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Search query: ${e.target.value}`);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Parts Inventory</h1>
        <Button 
          variant="outline" 
          onClick={handlePartsCategoryClick}
        >
          <Settings className="mr-2 h-4 w-4" /> Parts Category
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={handleAddPartsClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Parts Item
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleBulkUploadClick}
        >
          <Upload className="mr-2 h-4 w-4" /> Bulk Upload
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search" 
              className="w-64 pr-8 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Parts</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Item Cost</TableHead>
                <TableHead>Item Type</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Site</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => handleActionClick(item.sku)}
                    >
                      Action
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{item.sku}</div>
                    <div className="text-gray-500">{item.part}</div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>{item.itemType}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.site}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
