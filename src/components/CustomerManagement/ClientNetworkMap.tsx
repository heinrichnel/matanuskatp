import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../ui/Button';
import SyncIndicator from '../ui/SyncIndicator';
import { Search, Download, Filter, Network, Plus, X, ZoomIn, ZoomOut, Maximize, Users } from 'lucide-react';
// We'll add the d3 types
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: 'client' | 'partner' | 'supplier' | 'competitor';
  size: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
  strength: number;
  type: 'business' | 'referral' | 'potential' | 'competitive';
}

interface ClientNetworkMapProps {
  clientId?: string;
}

const ClientNetworkMap: React.FC<ClientNetworkMapProps> = ({ clientId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'clients' | 'partners' | 'suppliers'>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLegend, setShowLegend] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Mock network data
  const [networkData, setNetworkData] = useState<{nodes: Node[], links: Link[]}>({
    nodes: [
      { id: 'client1', name: 'Matanuska Transport', type: 'client', size: 25 },
      { id: 'client2', name: 'FastTrack Logistics', type: 'client', size: 20 },
      { id: 'client3', name: 'Global Shipping Inc.', type: 'client', size: 18 },
      { id: 'client4', name: 'Rapid Delivery Co.', type: 'client', size: 15 },
      { id: 'client5', name: 'TransWorld Freight', type: 'client', size: 22 },
      { id: 'partner1', name: 'Insurance Partners Ltd.', type: 'partner', size: 15 },
      { id: 'partner2', name: 'TransTech Solutions', type: 'partner', size: 12 },
      { id: 'partner3', name: 'Fleet Management Group', type: 'partner', size: 14 },
      { id: 'supplier1', name: 'Diesel Direct', type: 'supplier', size: 10 },
      { id: 'supplier2', name: 'Truck Parts Inc.', type: 'supplier', size: 8 },
      { id: 'supplier3', name: 'Tire Warehouse', type: 'supplier', size: 7 },
      { id: 'competitor1', name: 'RapidHaul Transport', type: 'competitor', size: 18 },
      { id: 'competitor2', name: 'Express Logistics', type: 'competitor', size: 16 }
    ],
    links: [
      { source: 'client1', target: 'client2', strength: 0.8, type: 'business' },
      { source: 'client1', target: 'client3', strength: 0.5, type: 'business' },
      { source: 'client1', target: 'client5', strength: 0.3, type: 'referral' },
      { source: 'client1', target: 'partner1', strength: 0.9, type: 'business' },
      { source: 'client1', target: 'partner2', strength: 0.7, type: 'business' },
      { source: 'client1', target: 'partner3', strength: 0.6, type: 'business' },
      { source: 'client1', target: 'supplier1', strength: 1.0, type: 'business' },
      { source: 'client1', target: 'supplier2', strength: 0.8, type: 'business' },
      { source: 'client1', target: 'supplier3', strength: 0.7, type: 'business' },
      { source: 'client1', target: 'competitor1', strength: 0.2, type: 'competitive' },
      { source: 'client2', target: 'client4', strength: 0.6, type: 'referral' },
      { source: 'client2', target: 'partner2', strength: 0.5, type: 'business' },
      { source: 'client3', target: 'client5', strength: 0.4, type: 'referral' },
      { source: 'client3', target: 'partner1', strength: 0.3, type: 'business' },
      { source: 'client4', target: 'supplier2', strength: 0.5, type: 'business' },
      { source: 'client5', target: 'partner3', strength: 0.6, type: 'potential' },
      { source: 'partner1', target: 'partner2', strength: 0.2, type: 'business' },
      { source: 'supplier1', target: 'supplier2', strength: 0.3, type: 'business' },
      { source: 'competitor1', target: 'competitor2', strength: 0.7, type: 'business' },
      { source: 'competitor1', target: 'client4', strength: 0.4, type: 'competitive' }
    ]
  });

  // Filter nodes based on search and view mode
  const filteredData = React.useMemo(() => {
    let nodes = networkData.nodes;
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      nodes = nodes.filter(node => 
        node.name.toLowerCase().includes(lowerSearch) || 
        node.id.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Filter by view mode
    if (viewMode !== 'all') {
      nodes = nodes.filter(node => {
        if (viewMode === 'clients') return node.type === 'client';
        if (viewMode === 'partners') return node.type === 'partner';
        if (viewMode === 'suppliers') return node.type === 'supplier';
        return true;
      });
    }
    
    // Get all links that connect the filtered nodes
    const nodeIds = new Set(nodes.map(node => node.id));
    const links = networkData.links.filter(link => 
      nodeIds.has(link.source as string) && nodeIds.has(link.target as string)
    );
    
    return { nodes, links };
  }, [networkData, searchTerm, viewMode]);

  // Initialize the network graph visualization
  useEffect(() => {
    if (!svgRef.current || filteredData.nodes.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create SVG and append a group for zooming
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    const g = svg.append('g');

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom as any);

    // Define color scale for node types
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['client', 'partner', 'supplier', 'competitor'])
      .range(['#3B82F6', '#10B981', '#F59E0B', '#EF4444']);

    // Define line type based on relationship
    const lineTypeScale = d3.scaleOrdinal<string>()
      .domain(['business', 'referral', 'potential', 'competitive'])
      .range(['5, 0', '10, 5', '5, 5, 2, 5', '2, 2']);

    // Create force simulation
    const simulation = d3.forceSimulation(filteredData.nodes as any)
      .force('link', d3.forceLink(filteredData.links)
        .id((d: any) => d.id)
        .distance(d => 100 / (d as any).strength)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.size + 10));

    // Draw links
    const links = g.selectAll('.link')
      .data(filteredData.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', (d) => {
        if (d.type === 'competitive') return '#EF4444';
        if (d.type === 'potential') return '#8B5CF6';
        return '#9CA3AF';
      })
      .attr('stroke-width', (d) => Math.max(1, d.strength * 3))
      .attr('stroke-dasharray', (d) => lineTypeScale(d.type));

    // Create node groups
    const nodes = g.selectAll('.node')
      .data(filteredData.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .on('click', (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      })
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any
      );

    // Draw node circles
    nodes.append('circle')
      .attr('r', (d) => d.size)
      .attr('fill', (d) => colorScale(d.type))
      .attr('stroke', '#FFF')
      .attr('stroke-width', 2);

    // Add text labels
    nodes.append('text')
      .text((d) => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.size + 15)
      .attr('font-size', '10px')
      .attr('fill', '#4B5563');

    // Update positions on tick
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes
        .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    // Clean up
    return () => {
      simulation.stop();
    };
  }, [filteredData]);

  // Handle clearing the selected node when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setSelectedNode(null);
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Handle zoom controls
  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    const currentZoom = d3.zoomTransform(svg.node() as any);
    svg.transition().duration(300).call(
      d3.zoom().transform as any,
      d3.zoomIdentity
        .translate(currentZoom.x, currentZoom.y)
        .scale(currentZoom.k * 1.2)
    );
    setZoomLevel(prev => prev * 1.2);
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    const currentZoom = d3.zoomTransform(svg.node() as any);
    svg.transition().duration(300).call(
      d3.zoom().transform as any,
      d3.zoomIdentity
        .translate(currentZoom.x, currentZoom.y)
        .scale(currentZoom.k / 1.2)
    );
    setZoomLevel(prev => prev / 1.2);
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      d3.zoom().transform as any,
      d3.zoomIdentity
    );
    setZoomLevel(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Client Network Map</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export Map
          </Button>
          <SyncIndicator />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search network..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Entities</option>
              <option value="clients">Clients Only</option>
              <option value="partners">Partners Only</option>
              <option value="suppliers">Suppliers Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<ZoomIn className="w-4 h-4" />}
            onClick={onClick}
          >
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<ZoomOut className="w-4 h-4" />}
            onClick={onClick}
          >
            Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Maximize className="w-4 h-4" />}
            onClick={onClick}
          >
            Reset
          </Button>
          <Button
            variant={showLegend ? "primary" : "outline"}
            size="sm"
            onClick={onClick}
          >
            Legend
          </Button>
        </div>
      </div>

      {/* Network Graph */}
      <Card className="h-[600px] relative">
        <CardContent className="p-0 h-full">
          <svg ref={svgRef} className="w-full h-full" onClick={onClick}></svg>
          
          {/* Legend */}
          {showLegend && (
            <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md">
              <h4 className="font-medium text-sm mb-2">Legend</h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-700">Client</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-700">Partner</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-xs text-gray-700">Supplier</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs text-gray-700">Competitor</span>
                </div>
              </div>
              
              <h4 className="font-medium text-sm mb-2">Connection Types</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-8 h-0 border-t-2 border-gray-400 mr-2"></div>
                  <span className="text-xs text-gray-700">Business</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-0 border-t-2 border-gray-400 border-dashed mr-2"></div>
                  <span className="text-xs text-gray-700">Referral</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-0 border-t-2 border-purple-400 border-dotted mr-2"></div>
                  <span className="text-xs text-gray-700">Potential</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-0 border-t-2 border-red-400 mr-2"></div>
                  <span className="text-xs text-gray-700">Competitive</span>
                </div>
              </div>
            </div>
          )}

          {/* Node Details */}
          {selectedNode && (
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-md shadow-lg max-w-xs">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{selectedNode.name}</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    setSelectedNode(null);
                    e.stopPropagation();
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    selectedNode.type === 'client' ? 'bg-blue-100 text-blue-800' :
                    selectedNode.type === 'partner' ? 'bg-green-100 text-green-800' :
                    selectedNode.type === 'supplier' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                  </span>
                </div>

                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Connections:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Relationship Strength:</span>
                    <span className="font-medium">High</span>
                  </div>
                </div>

                <div className="mt-3 flex space-x-2">
                  <Button size="xs" variant="outline">View Details</Button>
                  <Button size="xs" variant="primary">Add Connection</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Network Entities</h3>
            <p className="text-2xl font-bold text-blue-600">{networkData.nodes.length}</p>
            <div className="mt-2 text-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span>Clients:</span>
                <span>{networkData.nodes.filter(n => n.type === 'client').length}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span>Partners:</span>
                <span>{networkData.nodes.filter(n => n.type === 'partner').length}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span>Suppliers:</span>
                <span>{networkData.nodes.filter(n => n.type === 'supplier').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Key Connectors</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Matanuska Transport</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">9 connections</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">TransWorld Freight</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">5 connections</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">FastTrack Logistics</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">4 connections</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Network Actions</h3>
            <div className="mt-2 space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                icon={<Plus className="w-4 h-4" />}
              >
                Add New Entity
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                icon={<Network className="w-4 h-4" />}
              >
                Map New Connection
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                icon={<Users className="w-4 h-4" />}
              >
                Identify Opportunity Clusters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientNetworkMap;
