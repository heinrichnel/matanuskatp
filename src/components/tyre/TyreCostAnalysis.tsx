import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/FormElements";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Download
} from "lucide-react";
import { SAMPLE_TIRES, TIRE_BRANDS, TIRE_PATTERNS, Tire } from "@/data/tireData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TireCostMetrics {
  brand: string;
  pattern: string;
  averageCost: number;
  averageLifespan: number;
  costPerKm: number;
  totalTires: number;
  recommendationScore: number;
}

export const TireCostAnalysis: React.FC = () => {
  const [filterBrand, setFilterBrand] = useState('');
  const [filterPattern, setFilterPattern] = useState('');
  const [sortBy, setSortBy] = useState('costPerKm');

  const calculateTireMetrics = (): TireCostMetrics[] => {
    const metricsMap = new Map<string, {
      costs: number[];
      lifespans: number[];
      tires: Tire[];
    }>();

    SAMPLE_TIRES.forEach(tire => {
      const key = `${tire.brand}-${tire.pattern}`;
      if (!metricsMap.has(key)) {
        metricsMap.set(key, { costs: [], lifespans: [], tires: [] });
      }
      
      const group = metricsMap.get(key)!;
      group.costs.push(tire.purchaseDetails.cost);
      group.tires.push(tire);
      
      const estimatedLifespan = estimateTireLifespan(tire);
      group.lifespans.push(estimatedLifespan);
    });

    const metrics: TireCostMetrics[] = [];
    metricsMap.forEach((data, key) => {
      const [brand, pattern] = key.split('-');
      const averageCost = data.costs.reduce((sum, cost) => sum + cost, 0) / data.costs.length;
      const averageLifespan = data.lifespans.reduce((sum, life) => sum + life, 0) / data.lifespans.length;
      const costPerKm = averageLifespan > 0 ? averageCost / averageLifespan : 0;
      
      const recommendationScore = costPerKm > 0 ? Math.max(0, 100 - (costPerKm * 10)) : 0;

      metrics.push({
        brand,
        pattern,
        averageCost: Math.round(averageCost),
        averageLifespan: Math.round(averageLifespan),
        costPerKm: Math.round(costPerKm * 100) / 100,
        totalTires: data.tires.length,
        recommendationScore: Math.round(recommendationScore)
      });
    });

    return metrics;
  };

  const estimateTireLifespan = (tire: Tire): number => {
    const newTreadDepth = 20;
    const currentTread = tire.condition.treadDepth;
    const minimumTread = 3;
    
    const usedTread = newTreadDepth - currentTread;
    const remainingTread = currentTread - minimumTread;
    
    if (usedTread <= 0) return 100000;
    
    const treadWearRate = usedTread / 50000;
    const remainingLife = remainingTread / treadWearRate;
    
    return Math.max(remainingLife, 0);
  };

  const metrics = calculateTireMetrics();

  const filteredMetrics = metrics.filter(metric => {
    const brandMatch = !filterBrand || metric.brand === filterBrand;
    const patternMatch = !filterPattern || metric.pattern === filterPattern;
    return brandMatch && patternMatch;
  });

  const sortedMetrics = [...filteredMetrics].sort((a, b) => {
    switch (sortBy) {
      case 'costPerKm':
        return a.costPerKm - b.costPerKm;
      case 'averageCost':
        return a.averageCost - b.averageCost;
      case 'averageLifespan':
        return b.averageLifespan - a.averageLifespan;
      case 'recommendationScore':
        return b.recommendationScore - a.recommendationScore;
      default:
        return a.costPerKm - b.costPerKm;
    }
  });

  const getRecommendationBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  const exportData = () => {
    const csvContent = [
      ['Brand', 'Pattern', 'Avg Cost (R)', 'Est. Lifespan (km)', 'Cost per KM (R)', 'Total Tires', 'Score'].join(','),
      ...sortedMetrics.map(m => 
        [m.brand, m.pattern, m.averageCost, m.averageLifespan, m.costPerKm, m.totalTires, m.recommendationScore].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tire-cost-analysis.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Tyre Cost per Kilometer Analysis</h3>
          <p className="text-gray-600">Compare tyre brands and patterns for best value</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Brand"
              value={filterBrand}
              onChange={setFilterBrand}
              options={[
                { label: 'All Brands', value: '' },
                ...TIRE_BRANDS.map(brand => ({ label: brand, value: brand }))
              ]}
            />
            <Select
              label="Pattern"
              value={filterPattern}
              onChange={setFilterPattern}
              options={[
                { label: 'All Patterns', value: '' },
                ...TIRE_PATTERNS.map(pattern => ({ label: pattern, value: pattern }))
              ]}
            />
            <Select
              label="Sort By"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: 'Cost per KM', value: 'costPerKm' },
                { label: 'Purchase Cost', value: 'averageCost' },
                { label: 'Lifespan', value: 'averageLifespan' },
                { label: 'Recommendation Score', value: 'recommendationScore' }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Best Value</p>
                <p className="text-lg font-bold">
                  {sortedMetrics[0] ? `${sortedMetrics[0].brand} ${sortedMetrics[0].pattern}` : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  {sortedMetrics[0] ? `R${sortedMetrics[0].costPerKm}/km` : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Longest Lasting</p>
                <p className="text-lg font-bold">
                  {[...sortedMetrics].sort((a, b) => b.averageLifespan - a.averageLifespan)[0]?.brand || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  {[...sortedMetrics].sort((a, b) => b.averageLifespan - a.averageLifespan)[0]?.averageLifespan.toLocaleString() || ''} km
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Lowest Cost</p>
                <p className="text-lg font-bold">
                  {[...sortedMetrics].sort((a, b) => a.averageCost - b.averageCost)[0]?.brand || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  R{[...sortedMetrics].sort((a, b) => a.averageCost - b.averageCost)[0]?.averageCost || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Brands Analyzed</p>
                <p className="text-2xl font-bold">{new Set(metrics.map(m => m.brand)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Pattern</TableHead>
                <TableHead>Avg Cost (R)</TableHead>
                <TableHead>Est. Lifespan (km)</TableHead>
                <TableHead>Cost/km (R)</TableHead>
                <TableHead>Sample Size</TableHead>
                <TableHead>Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMetrics.map((metric, index) => (
                <TableRow key={`${metric.brand}-${metric.pattern}`}>
                  <TableCell className="font-medium">{metric.brand}</TableCell>
                  <TableCell>{metric.pattern}</TableCell>
                  <TableCell>R{metric.averageCost.toLocaleString()}</TableCell>
                  <TableCell>{metric.averageLifespan.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    R{metric.costPerKm}
                  </TableCell>
                  <TableCell>{metric.totalTires}</TableCell>
                  <TableCell>{getRecommendationBadge(metric.recommendationScore)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};