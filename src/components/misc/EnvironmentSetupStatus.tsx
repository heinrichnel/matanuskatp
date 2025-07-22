import React from 'react';
import { getEnvVar } from '../../utils/envUtils';

/**
 * Component that shows environment setup status during development
 * This is only rendered in development mode
 */
const EnvironmentSetupStatus: React.FC = () => {
  // Get environment mode
  const mode = getEnvVar('MODE', 'unknown');
  const isEmulator = getEnvVar('USE_EMULATOR', 'false') === 'true';
  
  // Don't show anything in production
  if (mode !== 'development' && process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
      }}
    >
      <div>Environment: {mode}</div>
      <div>Firebase: {isEmulator ? '🔶 Emulator' : '🔷 Production'}</div>
    </div>
  );
};

export default EnvironmentSetupStatus;
