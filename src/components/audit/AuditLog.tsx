import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { AuditLog as AuditLogType } from '../../types/audit';
import { formatDateTime } from '../../utils/helpers';

const AuditLog: React.FC = () => {
  const { auditLogs } = useAppContext();

  if (!auditLogs) {
    return <div className="text-gray-500">Loading audit logs...</div>;
  }

  if (auditLogs.length === 0) {
    return <div className="text-gray-500">No audit logs available.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Audit Log</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {auditLogs.map((log: AuditLogType) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(log.timestamp)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.action === 'create' ? 'bg-green-100 text-green-800' :
                    log.action === 'delete' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.entity} ({log.entityId})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;