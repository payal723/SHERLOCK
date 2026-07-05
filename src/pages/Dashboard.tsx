import { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "@/components/Sidebar";
import GraphViewer from "@/components/GraphViewer";
import EvidencePanel from "@/components/EvidencePanel";
import QueryPanel from "@/components/QueryPanel";
import ContradictionAlert from "@/components/ContradictionAlert";
import CaseHeader from "@/components/CaseHeader";
import TimelineView from "@/components/TimelineView";
import CogneePanel from "@/components/CogneePanel";
import StatsOverlay from "@/components/StatsOverlay";
import { mockFullCaseData, mockStats } from "@/lib/mockData";
import {
  Network,
  FileText,
  MessageSquareCode,
  Clock,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "graph" | "evidence" | "query" | "timeline" | "cognee";

const bottomTabs: { id: TabType; label: string; icon: typeof Network }[] = [
  { id: "graph", label: "Graph", icon: Network },
  { id: "evidence", label: "Evidence", icon: FileText },
  { id: "query", label: "AI Query", icon: MessageSquareCode },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "cognee", label: "Memory", icon: BrainCircuit },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("graph");
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<number | null>(null);

  const caseData = mockFullCaseData;
  const stats = mockStats;

  return (
    <div className="min-h-screen bg-[#0a0a0f] investigation-grid flex flex-col md:flex-row">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} caseData={caseData} stats={stats} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Case Header */}
        <CaseHeader caseData={caseData.case} stats={stats} onBack={() => navigate("/")} />

        {/* Contradiction Alerts */}
        {caseData.contradictions.length > 0 && (
          <div className="px-3 pt-2">
            <ContradictionAlert contradictions={caseData.contradictions} />
          </div>
        )}

        {/* Main View */}
        <div className="flex-1 overflow-hidden relative pb-16 md:pb-0">
          {/* Stats Overlay — hide on mobile */}
          <StatsOverlay stats={stats} className="absolute top-2 right-2 z-10 hidden md:flex" />

          {activeTab === "graph" && (
            <GraphViewer
              entities={caseData.entities}
              relationships={caseData.relationships}
              selectedNodeId={selectedNodeId}
              onNodeSelect={setSelectedNodeId}
            />
          )}
          {activeTab === "evidence" && (
            <EvidencePanel
              evidence={caseData.evidence}
              selectedId={selectedEvidenceId}
              onSelect={setSelectedEvidenceId}
              entities={caseData.entities}
            />
          )}
          {activeTab === "query" && (
            <QueryPanel caseId={1} queries={caseData.queries} />
          )}
          {activeTab === "timeline" && (
            <TimelineView
              evidence={caseData.evidence}
              entities={caseData.entities}
              relationships={caseData.relationships}
            />
          )}
          {activeTab === "cognee" && (
            <CogneePanel logs={caseData.cogneeLogs} caseId={1} />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0c0c14]/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around px-1 py-2">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-0",
                  isActive
                    ? "text-blue-400 bg-blue-500/15"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}