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

type TabType = "graph" | "evidence" | "query" | "timeline" | "cognee";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("graph");
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<number | null>(null);

  // Use embedded mock data directly - no API calls needed
  const caseData = mockFullCaseData;
  const stats = mockStats;

  return (
    <div className="min-h-screen bg-[#0a0a0f] investigation-grid flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} caseData={caseData} stats={stats} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Case Header */}
        <CaseHeader caseData={caseData.case} stats={stats} onBack={() => navigate("/")} />

        {/* Contradiction Alerts */}
        {caseData.contradictions.length > 0 && (
          <div className="px-4 pt-2">
            <ContradictionAlert contradictions={caseData.contradictions} />
          </div>
        )}

        {/* Main View */}
        <div className="flex-1 overflow-hidden relative">
          {/* Stats Overlay */}
          <StatsOverlay stats={stats} className="absolute top-2 right-2 z-10" />

          {/* Tab Content */}
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
            <QueryPanel
              caseId={1}
              queries={caseData.queries}
            />
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
    </div>
  );
}
