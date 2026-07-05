import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  Database,
  Search,
  RefreshCw,
  Trash2,
  Clock,
  Sparkles,
  Network,
  ArrowRight,
} from "lucide-react";
import type { CogneeLog } from "@/types/investigation";

interface CogneePanelProps {
  logs: CogneeLog[];
  caseId: number;
}

const operationConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: typeof Database; label: string }
> = {
  remember: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: Database,
    label: "Store Evidence",
  },
  recall: {
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: Search,
    label: "Multi-Hop Query",
  },
  improve: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: RefreshCw,
    label: "Optimize Memory",
  },
  forget: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: Trash2,
    label: "Archive Data",
  },
};

export default function CogneePanel({ logs }: CogneePanelProps) {
  const stats = {
    total: logs.length,
    remember: logs.filter((l) => l.operation === "remember").length,
    recall: logs.filter((l) => l.operation === "recall").length,
    improve: logs.filter((l) => l.operation === "improve").length,
    forget: logs.filter((l) => l.operation === "forget").length,
    avgConfidence: logs.length > 0 ? logs.reduce((a, b) => a + (b.confidence ?? 0), 0) / logs.length : 0,
    avgTime: logs.length > 0 ? logs.reduce((a, b) => a + (b.processingTime ?? 0), 0) / logs.length : 0,
  };

  return (
    <div className="flex h-full">
      {/* Main Log View */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <BrainCircuit className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Cognee Memory System</h3>
                <p className="text-[10px] text-gray-500">
                  Hybrid Graph-Vector Memory Operations Log
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card className="bg-[#0f0f18] border-white/5">
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Ops</p>
                <p className="text-xl font-bold text-white">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0f0f18] border-white/5">
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Confidence</p>
                <p className={cn(
                  "text-xl font-bold",
                  stats.avgConfidence >= 0.9 ? "text-green-400" : "text-yellow-400"
                )}>
                  {Math.round(stats.avgConfidence * 100)}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#0f0f18] border-white/5">
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Time</p>
                <p className="text-xl font-bold text-blue-400">
                  {(stats.avgTime / 1000).toFixed(1)}s
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#0f0f18] border-white/5">
              <CardContent className="p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Memory Layers</p>
                <p className="text-xl font-bold text-purple-400">3</p>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Visualization */}
          <Card className="bg-[#0f0f18] border-white/5 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-400 flex items-center gap-2">
                <Network className="h-3.5 w-3.5" />
                Memory Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 py-2">
                {[
                  { name: "Evidence", desc: "Raw inputs" },
                  { name: "Entities", desc: "Extracted nodes" },
                  { name: "Relations", desc: "Graph edges" },
                ].map((layer, i) => (
                  <div key={layer.name} className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="w-20 h-14 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-300">{layer.name}</span>
                      </div>
                      <p className="text-[9px] text-gray-600 mt-1">{layer.desc}</p>
                    </div>
                    {i < 2 && <ArrowRight className="h-4 w-4 text-gray-700" />}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Badge variant="outline" className="text-[9px] bg-blue-500/5 text-blue-400 border-blue-500/10">
                  Vector Store (Qdrant)
                </Badge>
                <span className="text-gray-600">+</span>
                <Badge variant="outline" className="text-[9px] bg-green-500/5 text-green-400 border-green-500/10">
                  Graph Store (Neo4j)
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Operation Logs */}
          <h4 className="text-xs font-medium text-gray-400 mb-3">Operation Log</h4>
          <div className="space-y-2">
            {logs.map((log) => {
              const op = operationConfig[log.operation] ?? operationConfig.remember;
              const Icon = op.icon;

              return (
                <Card
                  key={log.id}
                  className={cn("border", op.bg, op.border)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-1.5 rounded-lg shrink-0",
                          op.bg
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5", op.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={cn("text-[9px] px-1 py-0", op.bg, op.color, op.border)}
                          >
                            cognee.{log.operation}()
                          </Badge>
                          <span className="text-[10px] text-gray-500">{op.label}</span>
                        </div>
                        {log.query && (
                          <p className="text-xs text-gray-300 font-medium mb-1">{log.query}</p>
                        )}
                        {log.result && (
                          <p className="text-[11px] text-gray-400 leading-relaxed">{log.result}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {log.confidence !== null && (
                            <span className={cn("text-[10px] font-medium", op.color)}>
                              {Math.round(log.confidence * 100)}% confidence
                            </span>
                          )}
                          {log.processingTime && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {(log.processingTime / 1000).toFixed(1)}s
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Stats */}
      <div className="w-64 border-l border-white/5 bg-[#0c0c14] p-4">
        <h4 className="text-xs font-medium text-gray-400 mb-3">Operations Breakdown</h4>
        <div className="space-y-2">
          {Object.entries(operationConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = logs.filter((l) => l.operation === key).length;
            return (
              <div
                key={key}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  config.bg
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", config.color)} />
                <div className="flex-1">
                  <p className={cn("text-xs font-medium", config.color)}>{config.label}</p>
                  <p className="text-[10px] text-gray-500">cognee.{key}()</p>
                </div>
                <span className={cn("text-sm font-bold", config.color)}>{count}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
          <p className="text-[10px] text-purple-400 font-medium mb-1">Memory Status</p>
          <p className="text-[10px] text-gray-500">
            Graph: {logs.filter((l) => l.operation === "remember").length * 3} nodes
          </p>
          <p className="text-[10px] text-gray-500">
            Vectors: {logs.filter((l) => l.operation === "remember").length * 5} embeddings
          </p>
          <p className="text-[10px] text-gray-500">
            Contradictions: {logs.filter((l) => l.operation === "improve").length} detected
          </p>
        </div>
      </div>
    </div>
  );
}
