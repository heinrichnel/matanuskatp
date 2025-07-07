import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Target } from 'lucide-react';
import TyreManagementView from './TyreManagementView';
  
interface TyreManagementProps {
  activeTab?: string;
}

const TyreManagement: React.FC<TyreManagementProps> = ({ activeTab = 'dashboard' }) => {
  return (
    <TyreManagementView activeTab={activeTab} />
  );
};

export default TyreManagement;