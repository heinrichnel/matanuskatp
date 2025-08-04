import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase"; // Pas aan as jou firebase config elders is

import { BarChart2, PieChart, Download, Filter, Plus, Search, CheckCircle2, XCircle, Truck, Circle, CircleDot, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import {  Card, CardContent  } from '@/components/ui/consolidated/Card';
import SyncIndicator from "@/components/ui/SyncIndicator";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Pie, PieChart as PieChartC, Cell, ResponsiveContainer, Legend } from "recharts";

type TyreStatus = "In-Service" | "In-Stock" | "Repair" | "Scrap";
type TyreCondition = "New" | "Good" | "Fair" | "Poor" | "Retreaded";

interface TyreRecord {
  id: string;
  tyreNumber: string;
  manufacturer: string;
  condition: TyreCondition;
  status: TyreStatus;
  vehicleAssignment: string;
  km: number;
  kmLimit: number;
  treadDepth: number;
  mountStatus: string;
  axlePosition?: string;
  lastInspection?: string;
  datePurchased?: string;
  size?: string;
  pattern?: string;
}

const STATUS_COLORS = {
  "In-Service": "bg-green-100 text-green-800",
  "In-Stock": "bg-blue-100 text-blue-800",
  "Repair": "bg-yellow-100 text-yellow-800",
  "Scrap": "bg-red-100 text-red-800",
};
const CONDITION_COLORS = {
  "New": "bg-green-100 text-green-800",
  "Good": "bg-blue-100 text-blue-800",
  "Fair": "bg-yellow-100 text-yellow-800",
  "Poor": "bg-red-100 text-red-800",
  "Retreaded": "bg-purple-100 text-purple-800",
};

const PIE_COLORS = ["#22d3ee", "#4ade80", "#fde047", "#f87171", "#c084fc", "#60a5fa", "#fbbf24"];

const TyreInventoryDashboard: React.FC = () => {
  // Filter, sort, state
  const [tyres, setTyres] = useState<TyreRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterManufacturer, setFilterManufacturer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [sortBy, setSortBy] = useState<keyof TyreRecord>("tyreNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // LOAD FROM FIRESTORE
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetch = async () => {
      try {
        const tyresQ = query(collection(db, "tyres"));
        const snap = await getDocs(tyresQ);
        const result: TyreRecord[] = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            tyreNumber: d.tyreNumber || "",
            manufacturer: d.manufacturer || "",
            condition: d.condition || "Good",
            status: d.status || "In-Stock",
            vehicleAssignment: d.vehicleAssignment || "",
            km: d.km ?? 0,
            kmLimit: d.kmLimit ?? 0,
            treadDepth: d.treadDepth ?? 0,
            mountStatus: d.mountStatus || "",
            axlePosition: d.axlePosition,
            lastInspection: d.lastInspection,
            datePurchased: d.datePurchased,
            size: d.size,
            pattern: d.pattern,
          };
        });
        setTyres(result);
      } catch (e: any) {
        setError("Failed to load tyres.");
        setTyres([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  // FILTER & SORT
  const filteredTyres = useMemo(() => {
    return tyres
      .filter((tyre) => {
        const matchesSearch =
          !searchTerm ||
          tyre.tyreNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tyre.vehicleAssignment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesManufacturer =
          !filterManufacturer || tyre.manufacturer === filterManufacturer;
        const matchesStatus = !filterStatus || tyre.status === filterStatus;
        const matchesCondition = !filterCondition || tyre.condition === filterCondition;
        return matchesSearch && matchesManufacturer && matchesStatus && matchesCondition;
      })
      .sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        if (av === undefined && bv === undefined) return 0;
        if (av === undefined) return 1;
        if (bv === undefined) return -1;
        if (av < bv) return sortDirection === "asc" ? -1 : 1;
        if (av > bv) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [tyres, searchTerm, filterManufacturer, filterStatus, filterCondition, sortBy, sortDirection]);

  // Unique dropdown values
  const manufacturers = useMemo(() => [...new Set(tyres.map((t) => t.manufacturer).filter(Boolean))], [tyres]);
  const conditions = ["New", "Good", "Fair", "Poor", "Retreaded"];
  const statuses = ["In-Service", "In-Stock", "Repair", "Scrap"];

  // Summary cards
  const stats = useMemo(() => ({
    total: tyres.length,
    inService: tyres.filter((t) => t.status === "In-Service").length,
    inStock: tyres.filter((t) => t.status === "In-Stock").length,
    repair: tyres.filter((t) => t.status === "Repair").length,
    scrap: tyres.filter((t) => t.status === "Scrap").length,
  }), [tyres]);

  // Bar chart data (per status)
  const chartData = statuses.map(status => ({
    status,
    count: tyres.filter((t) => t.status === status).length,
  }));

  // Pie chart: manufacturers
  const pieData = manufacturers.map((man, i) => ({
    name: man,
    value: tyres.filter((t) => t.manufacturer === man).length,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  // Sorting
  const handleSort = (field: keyof TyreRecord) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Helpers
  const getBadge = (val: string, dict: any) =>
    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${dict[val] || "bg-gray-100 text-gray-800"}`}>{val}</span>;
  const calculateTreadPerc = (t: number, max = 14) => Math.round((t / max) * 100);
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

  return (
    <div className="space-y-8">
      {/* Header and Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Truck className="text-blue-500 w-8 h-8" />
          <h2 className="text-2xl font-bold">Tyre Inventory Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Add Tyre
          </Button>
          <SyncIndicator />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-blue-400" />
            <div>
              <div className="text-xs text-gray-500">Total Tyres</div>
              <div className="text-xl font-bold">{stats.total}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CircleDot className="w-7 h-7 text-green-400" />
            <div>
              <div className="text-xs text-gray-500">In Service</div>
              <div className="text-xl font-bold text-green-700">{stats.inService}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Circle className="w-7 h-7 text-blue-400" />
            <div>
              <div className="text-xs text-gray-500">In Stock</div>
              <div className="text-xl font-bold text-blue-700">{stats.inStock}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart2 className="w-7 h-7 text-yellow-400" />
            <div>
              <div className="text-xs text-gray-500">Repair</div>
              <div className="text-xl font-bold text-yellow-700">{stats.repair}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="w-7 h-7 text-red-400" />
            <div>
              <div className="text-xs text-gray-500">Scrapped</div>
              <div className="text-xl font-bold text-red-700">{stats.scrap}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2"><BarChart2 className="w-5 h-5" /> Tyres per Status</div>
            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="status" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count">
                    {chartData.map((entry, i) => (
                      <Cell key={entry.status} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2"><PieChart className="w-5 h-5" /> Manufacturer Share</div>
            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChartC>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChartC>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2"><CircleDot className="w-5 h-5" /> Condition Breakdown</div>
            <ul className="space-y-1">
              {conditions.map(cond => (
                <li key={cond} className="flex justify-between">
                  <span>{getBadge(cond, CONDITION_COLORS)}</span>
                  <span className="font-mono">{tyres.filter(t => t.condition === cond).length}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center mb-2">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by tyre number or vehicle..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">Filters:</span>
            <select className="px-3 py-2 border rounded-md" value={filterManufacturer} onChange={e => setFilterManufacturer(e.target.value)}>
              <option value="">All Manufacturers</option>
              {manufacturers.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="px-3 py-2 border rounded-md" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="px-3 py-2 border rounded-md" value={filterCondition} onChange={e => setFilterCondition(e.target.value)}>
              <option value="">All Conditions</option>
              {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterManufacturer("");
                setFilterStatus("");
                setFilterCondition("");
              }}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { field: "tyreNumber", label: "Tyre Number" },
                  { field: "manufacturer", label: "Manufacturer" },
                  { field: "condition", label: "Condition" },
                  { field: "status", label: "Status" },
                  { field: "vehicleAssignment", label: "Vehicle" },
                  { field: "km", label: "KM Run" },
                  { field: "treadDepth", label: "Tread (mm)" },
                  { field: "mountStatus", label: "Mount Status" },
                ].map(col => (
                  <th
                    key={col.field}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(col.field as keyof TyreRecord)}
                  >
                    {col.label} {sortBy === col.field ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center">
                    <Loader2 className="animate-spin inline-block w-10 h-10 text-blue-400" />
                    <div className="mt-2 text-gray-400">Loading tyre inventory...</div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-red-500">{error}</td>
                </tr>
              ) : filteredTyres.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-gray-400">
                    No tyres found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTyres.map((tyre) => (
                  <tr key={tyre.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{tyre.tyreNumber}</td>
                    <td className="px-6 py-4">{tyre.manufacturer}</td>
                    <td className="px-6 py-4">{getBadge(tyre.condition, CONDITION_COLORS)}</td>
                    <td className="px-6 py-4">{getBadge(tyre.status, STATUS_COLORS)}</td>
                    <td className="px-6 py-4">{tyre.vehicleAssignment || "—"}</td>
                    <td className="px-6 py-4">{formatNumber(tyre.km)} / {formatNumber(tyre.kmLimit)} km
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${tyre.km > (tyre.kmLimit ?? 1) * 0.8 ? "bg-red-500" : "bg-blue-500"}`}
                          style={{ width: `${Math.min(100, (tyre.km / (tyre.kmLimit || 1)) * 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{tyre.treadDepth} mm
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            calculateTreadPerc(tyre.treadDepth) > 70
                              ? "bg-green-500"
                              : calculateTreadPerc(tyre.treadDepth) > 30
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${calculateTreadPerc(tyre.treadDepth)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{tyre.mountStatus}
                      {tyre.axlePosition && <div className="text-xs text-gray-400">{tyre.axlePosition}</div>}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="xs" variant="outline" onClick={() => alert(tyre.tyreNumber)}>View</Button>
                      <Button size="xs" variant="secondary" onClick={() => alert(`Edit ${tyre.tyreNumber}`)}>Edit</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TyreInventoryDashboard;
