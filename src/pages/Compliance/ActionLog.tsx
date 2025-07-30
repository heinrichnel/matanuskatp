// ─── React ───────────────────────────────────────────────────────
import React, { useState } from "react";

// ─── Context ─────────────────────────────────────────────────────
import { useAppContext } from "../../context/AppContext";

// ─── Types ───────────────────────────────────────────────────────
import { ActionItem, RESPONSIBLE_PERSONS } from "../../types/index";

// ─── UI Components ───────────────────────────────────────────────
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import { Input, Select, TextArea } from "../../components/ui/FormElements";
import Modal from "../../components/ui/Modal";

// ─── Icons ───────────────────────────────────────────────────────
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Eye,
  FileUp,
  MessageSquare,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";

// ─── Utilities ───────────────────────────────────────────────────
import SyncIndicator from "../../components/ui/SyncIndicator";
import { formatDate, formatDateTime } from "../../utils/helpers";
import ActionItemDetails from "./ActionItemDetails";

const ActionLog: React.FC = () => {
  const { actionItems, addActionItem, updateActionItem, deleteActionItem, connectionStatus } =
    useAppContext();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    responsiblePerson: "",
    overdue: false,
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsiblePerson: "",
    dueDate: "",
    status: "initiated" as "initiated" | "in_progress" | "completed",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Calculate overdue status and days for each action item
  const enhancedActionItems = actionItems.map((item) => {
    const today = new Date();
    const dueDate = new Date(item.dueDate);
    const isOverdue = today > dueDate && item.status !== "completed";
    const overdueBy = isOverdue ? Math.floor((today.getTime() - dueDate.getTime()) / 86400000) : 0;

    // Check if overdue by 5 or 10 days
    const isOverdueBy5 = overdueBy >= 5;
    const isOverdueBy10 = overdueBy >= 10;

    return {
      ...item,
      isOverdue,
      overdueBy,
      isOverdueBy5,
      isOverdueBy10,
      needsReason: isOverdueBy10 && !item.overdueReason && item.status !== "completed",
    };
  });

  // Apply filters
  const filteredItems = enhancedActionItems.filter((item) => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.responsiblePerson && item.responsiblePerson !== filters.responsiblePerson)
      return false;
    if (filters.overdue && !item.isOverdue) return false;
    return true;
  });

  // Sort items: first by status (incomplete first), then by due date (overdue first)
  const sortedItems = [...filteredItems].sort((a, b) => {
    // Completed items at the bottom
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;

    // Then sort by due date (overdue first)
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    // Then by due date (earliest first)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Calculate summary statistics
  const summary = {
    total: enhancedActionItems.length,
    completed: enhancedActionItems.filter((item) => item.status === "completed").length,
    inProgress: enhancedActionItems.filter((item) => item.status === "in_progress").length,
    initiated: enhancedActionItems.filter((item) => item.status === "initiated").length,
    overdue: enhancedActionItems.filter((item) => item.isOverdue).length,
    overdueBy5: enhancedActionItems.filter((item) => item.isOverdueBy5).length,
    overdueBy10: enhancedActionItems.filter((item) => item.isOverdueBy10).length,
    needReason: enhancedActionItems.filter((item) => item.needsReason).length,
    completionRate:
      enhancedActionItems.length > 0
        ? (enhancedActionItems.filter((item) => item.status === "completed").length /
            enhancedActionItems.length) *
          100
        : 0,
  };

  // Handle form changes
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!String(formData.description || "").trim())
      newErrors.description = "Description is required";
    if (!formData.responsiblePerson) newErrors.responsiblePerson = "Responsible person is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    // Validate due date is not in the past
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    const today = new Date().toISOString().split("T")[0];

    const actionItemData: Omit<ActionItem, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      title: formData.title.trim(),
      description: String(formData.description || "").trim(),
      responsiblePerson: formData.responsiblePerson,
      startDate: today,
      dueDate: formData.dueDate,
      status: formData.status,
      attachments: [],
    };

    // Add action item
    addActionItem(actionItemData);

    // Reset form and close modal
    resetForm();
    setShowAddModal(false);

    alert(
      `Action item created successfully!\n\nTitle: ${actionItemData.title}\nResponsible: ${actionItemData.responsiblePerson}\nDue Date: ${formatDate(actionItemData.dueDate)}`
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      responsiblePerson: "",
      dueDate: "",
      status: "initiated",
    });
    setSelectedFiles(null);
    setErrors({});
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "",
      responsiblePerson: "",
      overdue: false,
    });
  };

  // Handle adding overdue reason
  const handleAddOverdueReason = (item: ActionItem, reason: string) => {
    if (!reason.trim()) {
      alert("Please provide a reason for the overdue action item");
      return;
    }

    updateActionItem({
      ...item,
      overdueReason: reason,
    });

    alert("Overdue reason added successfully");
  };

  // Handle status change
  const handleStatusChange = (
    item: ActionItem,
    newStatus: "initiated" | "in_progress" | "completed"
  ) => {
    const updates: Partial<ActionItem> = {
      status: newStatus,
    };

    // If marking as completed, add completion date and user
    if (newStatus === "completed") {
      updates.completedAt = new Date().toISOString();
      updates.completedBy = "Current User"; // In a real app, use the logged-in user
    }

    updateActionItem({
      ...item,
      ...updates,
    });
  };

  // Handle delete action item
  const handleDelete = (id: string) => {
    if (
      confirm("Are you sure you want to delete this action item? This action cannot be undone.")
    ) {
      deleteActionItem(id);
      alert("Action item deleted successfully");
    }
  };

  // Handle view details
  const handleViewDetails = (item: ActionItem) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // ... (rest of your JSX stays the same)

  return (
    // --- Hier kom jou hele UI, geen verandering nodig nie ---
    // (Ek los die JSX presies soos jy dit gehad het)
    // ...
  );
};

export default ActionLog;
