import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component for displaying and managing pending invoices
 */
const PendingInvoicesPage: React.FC = () => {
  // TODO: implement action handlers
  const onClick = () => {};
  // Mock data
  const pendingInvoices = Array.from({ length: 10 }, (_, i) => ({
    id: `INV-${2023100 + i}`,
    client: `Client ${i + 1}`,
    amount: 1500 * (i + 1),
    issueDate: `2023-07-${15 - (i % 10)}`,
    dueDate: `2023-08-${10 - (i % 10)}`,
    status: 'Pending'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pending Invoices</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={onClick}>
            Send Reminders
          </button>
          <Link to="/invoices/new" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Create Invoice
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="">All Clients</option>
              <option>Client 1</option>
              <option>Client 2</option>
              <option>Client 3</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>Last 30 days</option>
              <option>This month</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Range
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>All</option>
              <option>Under $1,000</option>
              <option>$1,000 - $5,000</option>
              <option>$5,000 - $10,000</option>
              <option>Over $10,000</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Table of pending invoices */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="mr-2" />
                  Invoice #
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <input type="checkbox" className="mr-2" />
                    {invoice.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.client}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">${invoice.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.issueDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.dueDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {invoice.status}

import tkinter as tk
from tkinter import ttk
from tkinter import messagebox

class InspectionForm:
    def __init__(self, master):
        self.master = master
        master.title("Truck and Trailer Inspection Form")

        self.notebook = ttk.Notebook(master)
        self.notebook.pack(pady=10, expand=True, fill="both")

        self.truck_tab = ttk.Frame(self.notebook)
        self.trailer_tab = ttk.Frame(self.notebook)

        self.notebook.add(self.truck_tab, text="Truck Inspection")
        self.notebook.add(self.trailer_tab, text="Trailer Inspection")

        self.create_truck_form(self.truck_tab)
        self.create_trailer_form(self.trailer_tab)

        self.submit_button = tk.Button(master, text="Submit Inspection", command=self.submit_inspection)
        self.submit_button.pack(pady=10)

    def create_truck_form(self, frame):
        # Truck Identification
        tk.Label(frame, text="Truck ID:").grid(row=0, column=0, sticky="w", padx=5, pady=2)
        self.truck_id = tk.Entry(frame)
        self.truck_id.grid(row=0, column=1, sticky="ew", padx=5, pady=2)

        # Date and Inspector
        tk.Label(frame, text="Date:").grid(row=1, column=0, sticky="w", padx=5, pady=2)
        self.truck_date = tk.Entry(frame)
        self.truck_date.grid(row=1, column=1, sticky="ew", padx=5, pady=2)

        tk.Label(frame, text="Inspector:").grid(row=2, column=0, sticky="w", padx=5, pady=2)
        self.truck_inspector = tk.Entry(frame)
        self.truck_inspector.grid(row=2, column=1, sticky="ew", padx=5, pady=2)

        # Truck Inspection Items
        self.truck_items = {
            "Brakes": tk.StringVar(value="Pass"),
            "Lights": tk.StringVar(value="Pass"),
            "Tires": tk.StringVar(value="Pass"),
            "Engine": tk.StringVar(value="Pass"),
            "Steering": tk.StringVar(value="Pass"),
        }

        row_num = 3
        for item, var in self.truck_items.items():
            tk.Label(frame, text=f"{item}:").grid(row=row_num, column=0, sticky="w", padx=5, pady=2)
            radio_pass = tk.Radiobutton(frame, text="Pass", variable=var, value="Pass")
            radio_fail = tk.Radiobutton(frame, text="Fail", variable=var, value="Fail")
            radio_pass.grid(row=row_num, column=1, padx=5, pady=2)
            radio_fail.grid(row=row_num, column=2, padx=5, pady=2)
            row_num += 1

        # Truck Notes
        tk.Label(frame, text="Notes:").grid(row=row_num, column=0, sticky="w", padx=5, pady=2)
        self.truck_notes = tk.Text(frame, height=5, width=30)
        self.truck_notes.grid(row=row_num, column=1, columnspan=2, sticky="ew", padx=5, pady=2)

        # Configure grid layout
        for i in range(3):
            frame.grid_columnconfigure(i, weight=1)

    def create_trailer_form(self, frame):
        # Trailer Identification
        tk.Label(frame, text="Trailer ID:").grid(row=0, column=0, sticky="w", padx=5, pady=2)
        self.trailer_id = tk.Entry(frame)
        self.trailer_id.grid(row=0, column=1, sticky="ew", padx=5, pady=2)

        # Date and Inspector
        tk.Label(frame, text="Date:").grid(row=1, column=0, sticky="w", padx=5, pady=2)
        self.trailer_date = tk.Entry(frame)
        self.trailer_date.grid(row=1, column=1, sticky="ew", padx=5, pady=2)

        tk.Label(frame, text="Inspector:").grid(row=2, column=0, sticky="w", padx=5, pady=2)
        self.trailer_inspector = tk.Entry(frame)
        self.trailer_inspector.grid(row=2, column=1, sticky="ew", padx=5, pady=2)

        # Trailer Inspection Items
        self.trailer_items = {
            "Brakes": tk.StringVar(value="Pass"),
            "Lights": tk.StringVar(value="Pass"),
            "Tires": tk.StringVar(value="Pass"),
            "Coupling": tk.StringVar(value="Pass"),
            "Structure": tk.StringVar(value="Pass"),
        }

        row_num = 3
        for item, var in self.trailer_items.items():
            tk.Label(frame, text=f"{item}:").grid(row=row_num, column=0, sticky="w", padx=5, pady=2)
            radio_pass = tk.Radiobutton(frame, text="Pass", variable=var, value="Pass")
            radio_fail = tk.Radiobutton(frame, text="Fail", variable=var, value="Fail")
            radio_pass.grid(row=row_num, column=1, padx=5, pady=2)
            radio_fail.grid(row=row_num, column=2, padx=5, pady=2)
            row_num += 1

        # Trailer Notes
        tk.Label(frame, text="Notes:").grid(row=row_num, column=0, sticky="w", padx=5, pady=2)
        self.trailer_notes = tk.Text(frame, height=5, width=30)
        self.trailer_notes.grid(row=row_num, column=1, columnspan=2, sticky="ew", padx=5, pady=2)

        # Configure grid layout
        for i in range(3):
            frame.grid_columnconfigure(i, weight=1)

    def submit_inspection(self):
        # Retrieve Truck Data
        truck_data = {
            "Truck ID": self.truck_id.get(),
            "Date": self.truck_date.get(),
            "Inspector": self.truck_inspector.get(),
            "Brakes": self.truck_items["Brakes"].get(),
            "Lights": self.truck_items["Lights"].get(),
            "Tires": self.truck_items["Tires"].get(),
            "Engine": self.truck_items["Engine"].get(),
            "Steering": self.truck_items["Steering"].get(),
            "Notes": self.truck_notes.get("1.0", tk.END).strip(),
        }

        # Retrieve Trailer Data
        trailer_data = {
            "Trailer ID": self.trailer_id.get(),
            "Date": self.trailer_date.get(),
            "Inspector": self.trailer_inspector.get(),
            "Brakes": self.trailer_items["Brakes"].get(),
            "Lights": self.trailer_items["Lights"].get(),
            "Tires": self.trailer_items["Tires"].get(),
            "Coupling": self.trailer_items["Coupling"].get(),
            "Structure": self.trailer_items["Structure"].get(),
            "Notes": self.trailer_notes.get("1.0", tk.END).strip(),
        }

        # Display Data (replace with actual saving logic)
        message = "Truck Inspection Data:\n"
        for key, value in truck_data.items():
            message += f"{key}: {value}\n"

        message += "\nTrailer Inspection Data:\n"
        for key, value in trailer_data.items():
            message += f"{key}: {value}\n"

        messagebox.showinfo("Inspection Data", message)


root = tk.Tk()
form = InspectionForm(root)
root.mainloop()
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" onClick={onClick}>View</button>
                      <button className="text-gray-600 hover:text-gray-800" onClick={onClick}>Edit</button>
                      <button className="text-green-600 hover:text-green-800" onClick={onClick}>Mark Paid</button>
                      <button className="text-red-600 hover:text-red-800" onClick={onClick}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={onClick}}>
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={onClick}}>
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">20</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={onClick}}>
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClick}}>
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-gray-50" onClick={onClick}}>
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClick}}>
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={onClick}}>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingInvoicesPage;
