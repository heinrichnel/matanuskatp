import { TyreInventory } from '@/components/tyre/TyreInventory';

const InventoryPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tyre Inventory</h1>
      <TyreInventory />
    </div>
  );
};

export default InventoryPage;
