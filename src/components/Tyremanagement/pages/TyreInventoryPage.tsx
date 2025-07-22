import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { TyreInventory } from '../TyreInventory';

const TyreInventoryPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tyre Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <TyreInventory />
        </CardContent>
      </Card>
    </div>
  );
};

export default TyreInventoryPage;
