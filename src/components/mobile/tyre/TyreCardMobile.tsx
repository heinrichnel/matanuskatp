import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/consolidated';
import { Button } from '../../ui/Button';
import {
  Scan,
  Edit,
  MapPin,
  Calendar,
  DollarSign,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';

interface TyreCardMobileProps {
  tyre: {
    id: string;
    tyreNumber: string;
    manufacturer: string;
    tyreSize: string;
    pattern?: string;
    condition: string;
    status: string;
    mountStatus: string;
    axlePosition?: string;
    vehicleId?: string;
    cost?: number;
    datePurchased?: string;
    kmRun?: number;
    lastInspection?: string;
  };
  onScan?: () => void;
  onEdit?: () => void;
  onViewDetails?: () => void;
  compact?: boolean;
}
