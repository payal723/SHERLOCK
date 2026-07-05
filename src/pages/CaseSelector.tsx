import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Search,
  FolderOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  Snowflake,
  Database,
  BrainCircuit,
  FileText,
  Users,
  Link2,
  AlertCircle,
} from "lucide-react";
import { mockCase, mockStats } from "@/lib/mockData";
import type { InvestigationCase, CaseStats } from "@/types/investigation";

const severityConfig = {
  critical: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertTriangle },
  high: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: AlertCircle },
  medium: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  low: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: CheckCircle },
};

const statusConfig = {
  active: { color: "text-green-400", label: "Active Investigation", icon: Search },
  cold: { color: "text-cyan-400", label: "Cold Case", icon: Snowflake },
  solved: { color: "text-emerald-400", label: "Solved", icon: CheckCircle },
  archived: { color: "text-gray-400", label: "Archived", icon: FolderOpen },
};

export default function CaseSelector() {
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);

  // Use embedded mock data directly
  const cases: InvestigationCase[] = [mockCase];
  const stats: CaseStats = mockStats;

  const handleOpenCase = (caseId: number) => {
    navigate(`/dashboard/${caseId}`);
  };

  const handleSeed = () => {
    setIsSeeding(true);
    setTimeout(() => setIsSeeding(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] investigation-grid">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 md:px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-blue-500" />
              <Search className="h-4 w-4 text-blue-400 absolute -bottom-0.5 -right-0.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">SHERLOCK</h1>
              <p className="text-[10px] text-blue-400 tracking-[0.3em] uppercase">
                AI Crime Scene Investigation
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-400 border-blue-500/20"
            >
              <BrainCircuit className="h-3 w-3 mr-1" />
              Cognee Powered
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-400 border-green-500/20"
            >
              <Database className="h-3 w-3 mr-1" />
              Graph-Vector Hybrid
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 md:px-4 py-4 md:py-8">
        {/* Hero Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#0f0f18] border-white/5 glow-blue">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FolderOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{cases.length}</p>
                <p className="text-xs text-gray-400">Total Cases</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0f0f18] border-white/5 glow-green">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Math.round((mockCase.confidence ?? 0) * 100)}%
                </p>
                <p className="text-xs text-gray-400">Avg. Confidence</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0f0f18] border-white/5 glow-yellow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Users className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {cases.filter((c) => c.status === "active").length}
                </p>
                <p className="text-xs text-gray-400">Active Cases</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0f0f18] border-white/5 glow-red">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {cases.filter((c) => c.severity === "critical").length}
                </p>
                <p className="text-xs text-gray-400">Critical Priority</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cognee Features Banner */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 border border-blue-500/10">
          <div className="flex items-center gap-4 mb-3">
            <BrainCircuit className="h-5 w-5 text-blue-400" />
            <h2 className="text-sm font-semibold text-blue-300">
              Powered by Cognee — Hybrid Graph-Vector Memory System
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { op: "remember", label: "Evidence Ingestion", desc: "Store & extract entities" },
              { op: "recall", label: "Multi-Hop Query", desc: "Graph traversal reasoning" },
              { op: "improve", label: "Contradiction Detection", desc: "Auto-identify conflicts" },
              { op: "forget", label: "Case Archival", desc: "Smart data management" },
            ].map((item) => (
              <div
                key={item.op}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <p className="text-xs font-mono text-blue-400 mb-1">cognee.{item.op}()</p>
                <p className="text-xs font-medium text-gray-300">{item.label}</p>
                <p className="text-[10px] text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cases Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-400" />
            Active Investigations
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={isSeeding}
            className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
          >
            <Database className="h-3 w-3 mr-1" />
            {isSeeding ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c) => {
            const sev = severityConfig[c.severity as keyof typeof severityConfig] ?? severityConfig.medium;
            const st = statusConfig[c.status as keyof typeof statusConfig] ?? statusConfig.active;
            const StatusIcon = st.icon;
            const SevIcon = sev.icon;

            return (
              <Card
                key={c.id}
                className="bg-[#0f0f18] border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                onClick={() => handleOpenCase(c.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {c.title}
                        </CardTitle>
                        <Badge variant="outline" className={`${sev.color} text-[10px]`}>
                          <SevIcon className="h-3 w-3 mr-0.5" />
                          {c.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <StatusIcon className={`h-3 w-3 ${st.color}`} />
                        <span className={st.color}>{st.label}</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>Victim: {c.victimName ?? "Unknown"}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{c.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {stats.evidenceCount} Evidence
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {stats.entityCount} Entities
                      </span>
                      <span className="flex items-center gap-1">
                        <Link2 className="h-3 w-3" />
                        {stats.relationshipCount} Relations
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                    >
                      <Search className="h-3 w-3 mr-1" />
                      Investigate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}