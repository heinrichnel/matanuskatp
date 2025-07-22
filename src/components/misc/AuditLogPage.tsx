import React from 'react';
import PageWrapper from '../components/ui/PageWrapper';
import AuditLog from '../components/audit/AuditLog';

const AuditLogPage: React.FC = () => {
  return (
    <PageWrapper title="Audit Log">
      <AuditLog />
    </PageWrapper>
  );
};

export default AuditLogPage;