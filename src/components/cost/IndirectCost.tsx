// ─── React ───────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────
import { Trip, SystemCostRates, DEFAULT_SYSTEM_COST_RATES, CostEntry } from '../../types';

// ─── Utilities ───────────────────────────────────────────────────
import { formatCurrency } from '../../utils/helpers';

interface IndirectCostProps {
  trip: Trip;
  onGenerateSystemCosts: (systemCosts: Omit<CostEntry, 'id' | 'attachments'>[]) => void;
}

const IndirectCost: React.FC<IndirectCostProps> = ({ trip, onGenerateSystemCosts }) => {
  const [systemRates, setSystemRates] = useState<SystemCostRates>(DEFAULT_SYSTEM_COST_RATES);

  useEffect(() => {
    // Fetch system rates from context or API
  }, []);

  const handleGenerate = () => {
    const systemCosts: Omit<CostEntry, 'id' | 'attachments'>[] = [];
    onGenerateSystemCosts(systemCosts);
  };

  return (
    <div>
      <h3>Indirect Costs</h3>
      <button onClick={handleGenerate}>Generate Costs</button>
    </div>
  );
};

export default IndirectCost;
