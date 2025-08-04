import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type NotificationType = "success" | "error" | "info" | "loading";

interface DataUpdateNotificationProps {
  type?: NotificationType;
  title?: string;
  message?: string;
  duration?: number; // Auto-dismiss duration in ms, 0 means don't auto-dismiss
  onAction?: () => void;
  actionLabel?: string;
  onDismiss?: () => void;
}

export /**
 * DataUpdateNotification
 *
 * A DataUpdateNotification component
 *
 * @example
 * ```tsx
 * <DataUpdateNotification title="example" message="example" duration={42} onAction={() => {}} actionLabel="example" onDismiss={() => {}} />
 * ```
 *
 * @param props - Component props
 * @param props.type - type of the component
 * @param props.title - title of the component
 * @param props.message - message of the component
 * @param props.duration - Auto-dismiss duration in ms, 0 means don't auto-dismiss
 * @param props.onAction - onAction of the component
 * @param props.actionLabel - actionLabel of the component
 * @param props.onDismiss - onDismiss of the component
 * @returns React component
 */
function DataUpdateNotification({
  type = "info",
  title,
  message,
  duration = 5000, // Default 5 seconds
  onAction,
  actionLabel = "Refresh",
  onDismiss,
}: DataUpdateNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0 && visible && type !== "loading") {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, visible, type, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const handleAction = () => {
    onAction?.();
  };

  // Return null when not visible
  if (!visible) return null;

  // Determine icon based on type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "loading":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  // Determine alert variant based on type
  const getVariant = () => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "destructive";
      case "loading":
        return "default";
      default:
        return "default";
    }
  };

  // Default titles based on type if not provided
  const getTitle = () => {
    if (title) return title;

    switch (type) {
      case "success":
        return "Update Successful";
      case "error":
        return "Error Occurred";
      case "loading":
        return "Loading Data";
      default:
        return "Information";
    }
  };

  return (
    <Alert variant={getVariant() as any}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {getIcon()}
          <div>
            <AlertTitle>{getTitle()}</AlertTitle>
            {message && <AlertDescription>{message}</AlertDescription>}
          </div>
        </div>

        <div className="flex gap-2">
          {onAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAction}
              disabled={type === "loading"}
            >
              {actionLabel}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            disabled={type === "loading" && !onDismiss}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </Alert>
  );
}

export default DataUpdateNotification;
