import TyreManagement from '@/components/tyre/TyreManagement';

const TyresPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tyre Management</h1>
      <p className="text-gray-600">Manage tyre inventory, inspections, and reports.</p>
      <TyreManagement />
    </div>
  );
};

export default TyresPage;
