import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../ui/consolidated';
import Button from '../../ui/Button';
import { MessageSquare, Edit, Save, X, User, Clock } from 'lucide-react';
import { formatDateTime } from '../../../utils/helpers';

interface JobCardNotesProps {
  notes: {
    id: string;
    text: string;
    createdBy: string;
    createdAt: string;
    type: 'general' | 'technician' | 'customer' | 'internal';
  }[];
  onAddNote: (text: string, type: 'general' | 'technician' | 'customer' | 'internal') => void;
  onEditNote?: (id: string, text: string) => void;
  onDeleteNote?: (id: string) => void;
  readonly?: boolean;
}
