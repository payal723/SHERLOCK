import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  User,
  MapPin,
  Wrench,
  Pill,
  Car,
  Building2,
  HelpCircle,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Entity, Relationship } from "@/types/investigation";
import { entityTypeColors } from "@/types/investigation";

interface GraphViewerProps {
  entities: Entity[];
  relationships: Relationship[];
  selectedNodeId: number | null;
  onNodeSelect: (id: number | null) => void;
}

const entityIcons: Record<string, typeof User> = {
  person: User,
  location: MapPin,
  object: Wrench,
  drug: Pill,
  vehicle: Car,
  organization: Building2,
  other: HelpCircle,
  weapon: Shield,
};

export default function GraphViewer({
  entities,
  relationships,
  selectedNodeId: _selectedNodeId,
  onNodeSelect,
}: GraphViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Entity | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  const width = 1200;
  const height = 800;

  const connectedEdges = selectedNode
    ? relationships.filter(
        (r) => r.sourceId === selectedNode.id || r.targetId === selectedNode.id
      )
    : [];

  const connectedEntities = selectedNode
    ? entities.filter((e) =>
        relationships.some(
          (r) =>
            (r.sourceId === selectedNode.id && r.targetId === e.id) ||
            (r.targetId === selectedNode.id && r.sourceId === e.id)
        )
      )
    : [];

  const initGraph = useCallback(() => {
    if (!svgRef.current || entities.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        setTransform(event.transform);
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    const g = svg.append("g");

    // Define arrow markers
    const defs = svg.append("defs");
    const types = [...new Set(relationships.map((r) => r.relationType))];
    types.forEach((_relType, idx) => {
      defs
        .append("marker")
        .attr("id", `arrow-${idx}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 28)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "rgba(148,163,184,0.5)");
    });

    // Prepare nodes and links
    const nodes: any[] = entities.map((e) => ({
      ...e,
      x: e.x ?? Math.random() * width,
      y: e.y ?? Math.random() * height,
    }));

    const links: any[] = relationships.map((r) => ({
      ...r,
      source: r.sourceId,
      target: r.targetId,
      markerIndex: types.indexOf(r.relationType) ?? 0,
    }));

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;

    // Draw edges
    const linkGroup = g
      .append("g")
      .attr("class", "links")
      .selectAll("g")
      .data(links)
      .join("g");

    const linkLines = linkGroup
      .append("line")
      .attr("class", "graph-edge")
      .attr("stroke", "rgba(148,163,184,0.3)")
      .attr("stroke-width", 1.5)
      .attr("marker-end", (d: any) => `url(#arrow-${types.indexOf(d.relationType)})`);

    // Edge labels
    const linkLabels = linkGroup
      .append("text")
      .attr("font-size", "9px")
      .attr("fill", "rgba(148,163,184,0.7)")
      .attr("text-anchor", "middle")
      .attr("dy", -5)
      .text((d: any) => d.relationType.replace(/_/g, " "));

    // Draw nodes
    const nodeGroup = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "graph-node")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<any, any>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        onNodeSelect(d.id);
      });

    // Node circles with glow
    nodeGroup
      .append("circle")
      .attr("r", 22)
      .attr("fill", (d: any) => `${entityTypeColors[d.entityType as keyof typeof entityTypeColors] ?? "#6b7280"}20`)
      .attr("stroke", (d: any) => entityTypeColors[d.entityType as keyof typeof entityTypeColors] ?? "#6b7280")
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-200");

    // Inner circle
    nodeGroup
      .append("circle")
      .attr("r", 8)
      .attr("fill", (d: any) => entityTypeColors[d.entityType as keyof typeof entityTypeColors] ?? "#6b7280");

    // Node labels
    nodeGroup
      .append("text")
      .attr("dy", 38)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", "#e2e8f0")
      .text((d: any) => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name);

    // Role labels
    nodeGroup
      .append("text")
      .attr("dy", 50)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("fill", "rgba(148,163,184,0.6)")
      .text((d: any) => d.role ?? "");

    // Update positions
    simulation.on("tick", () => {
      linkLines
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkLabels
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Click background to deselect
    svg.on("click", () => {
      setSelectedNode(null);
      onNodeSelect(null);
    });
  }, [entities, relationships]);

  useEffect(() => {
    initGraph();
    return () => {
      simulationRef.current?.stop();
    };
  }, [initGraph]);

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(
        (d3.zoom() as any).transform,
        transform.scale(transform.k * 1.3)
      );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(
        (d3.zoom() as any).transform,
        transform.scale(transform.k / 1.3)
      );
  };

  const handleFit = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(500)
      .call((d3.zoom() as any).transform, d3.zoomIdentity);
  };

  return (
    <div ref={containerRef} className="flex h-full">
      {/* Graph Area */}
      <div className="flex-1 relative">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="bg-[#0a0a0f]"
        />

        {/* Graph Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-[#1a1a2e] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-[#1a1a2e] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleFit}
            className="p-2 rounded-lg bg-[#1a1a2e] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-[#0f0f18]/95 border border-white/5 backdrop-blur">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Entity Types</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(entityTypeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] text-gray-400 capitalize">{type}</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="w-80 border-l border-white/5 bg-[#0c0c14] flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Entity Details</h3>
            <button
              onClick={() => {
                setSelectedNode(null);
                onNodeSelect(null);
              }}
              className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Entity Header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${entityTypeColors[selectedNode.entityType as keyof typeof entityTypeColors] ?? "#6b7280"}20`,
                    border: `1px solid ${entityTypeColors[selectedNode.entityType as keyof typeof entityTypeColors] ?? "#6b7280"}40`,
                  }}
                >
                  {(() => {
                    const Icon = entityIcons[selectedNode.entityType] ?? HelpCircle;
                    return (
                      <Icon
                        className="h-5 w-5"
                        style={{
                          color: entityTypeColors[selectedNode.entityType as keyof typeof entityTypeColors] ?? "#6b7280",
                        }}
                      />
                    );
                  })()}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{selectedNode.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 py-0"
                      style={{
                        borderColor: `${entityTypeColors[selectedNode.entityType as keyof typeof entityTypeColors] ?? "#6b7280"}40`,
                        color: entityTypeColors[selectedNode.entityType as keyof typeof entityTypeColors] ?? "#6b7280",
                      }}
                    >
                      {selectedNode.entityType}
                    </Badge>
                    {selectedNode.role && (
                      <span className="text-[10px] text-gray-500">{selectedNode.role}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedNode.description && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>
              )}

              {/* Confidence */}
              {selectedNode.confidence !== null && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Confidence
                    </p>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        (selectedNode.confidence ?? 0) >= 0.9
                          ? "text-green-400"
                          : (selectedNode.confidence ?? 0) >= 0.7
                          ? "text-yellow-400"
                          : "text-red-400"
                      )}
                    >
                      {Math.round((selectedNode.confidence ?? 0) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        (selectedNode.confidence ?? 0) >= 0.9
                          ? "bg-green-500"
                          : (selectedNode.confidence ?? 0) >= 0.7
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                      style={{ width: `${(selectedNode.confidence ?? 0) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Connected Entities */}
              {connectedEntities.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                    Connected ({connectedEntities.length})
                  </p>
                  <div className="space-y-1.5">
                    {connectedEntities.map((entity) => {
                      const rel = connectedEdges.find(
                        (r) =>
                          (r.sourceId === selectedNode.id && r.targetId === entity.id) ||
                          (r.targetId === selectedNode.id && r.sourceId === entity.id)
                      );
                      const Icon = entityIcons[entity.entityType] ?? HelpCircle;
                      return (
                        <div
                          key={entity.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedNode(entity);
                            onNodeSelect(entity.id);
                          }}
                        >
                          <Icon
                            className="h-3 w-3 shrink-0"
                            style={{
                              color: entityTypeColors[entity.entityType as keyof typeof entityTypeColors] ?? "#6b7280",
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-300 truncate">{entity.name}</p>
                            {rel && (
                              <p className="text-[9px] text-gray-500">
                                {rel.relationType.replace(/_/g, " ")}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Relationships */}
              {connectedEdges.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                    Relationships
                  </p>
                  <div className="space-y-1.5">
                    {connectedEdges.map((rel) => {
                      const isSource = rel.sourceId === selectedNode.id;
                      const otherId = isSource ? rel.targetId : rel.sourceId;
                      const other = entities.find((e) => e.id === otherId);
                      return (
                        <div
                          key={rel.id}
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/5"
                        >
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-gray-400">
                              {isSource ? "→" : "←"}
                            </span>
                            <span className="text-blue-400 font-medium">
                              {rel.relationType.replace(/_/g, " ")}
                            </span>
                            <span className="text-gray-500">{isSource ? "to" : "from"}</span>
                            <span className="text-gray-300">{other?.name}</span>
                          </div>
                          {rel.description && (
                            <p className="text-[10px] text-gray-500 mt-1">{rel.description}</p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(rel.confidence ?? 1) * 100}%` }}
                              />
                            </div>
                            <span className="text-[9px] text-gray-500">
                              {Math.round((rel.confidence ?? 1) * 100)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
