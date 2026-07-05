import { cn } from "@/lib/utils";
import {
  Network,
  FileText,
  MessageSquareCode,
  Clock,
  BrainCircuit,
  Shield,
  Search,
  AlertTriangle,
  Users,
  Link2,
  FileCheck,
} from "lucide-react";
import type { FullCaseData, CaseStats } from "@/types/investigation";

type TabType = "graph" | "evidence" | "query" | "timeline" | "cognee";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  caseData: FullCaseData;
  stats?: CaseStats;
}

const tabs: { id: TabType; label: string; icon: typeof Network }[] = [
  { id: "graph", label: "Knowledge Graph", icon: Network },
  { id: "evidence", label: "Evidence", icon: FileText },
  { id: "query", label: "AI Query", icon: MessageSquareCode },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "cognee", label: "Cognee Memory", icon: BrainCircuit },
];

export default function Sidebar({ activeTab, onTabChange, caseData, stats }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0c0c14] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Shield className="h-6 w-6 text-blue-500" />
            <Search className="h-3 w-3 text-blue-400 absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-white">SHERLOCK</h1>
            <p className="text-[9px] text-blue-400 tracking-[0.2em] uppercase">
              Investigation AI
            </p>
          </div>
        </div>
      </div>

      {/* Case Info */}
      <div className="p-3 border-b border-white/5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Active Case</p>
        <p className="text-xs font-medium text-white truncate">{caseData.case.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
              caseData.case.severity === "critical" &&
                "bg-red-500/20 text-red-400",
              caseData.case.severity === "high" &&
                "bg-orange-500/20 text-orange-400",
              caseData.case.severity === "medium" &&
                "bg-yellow-500/20 text-yellow-400",
              caseData.case.severity === "low" && "bg-blue-500/20 text-blue-400"
            )}
          >
            {caseData.case.severity}
          </span>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
              caseData.case.status === "active" && "bg-green-500/20 text-green-400",
              caseData.case.status === "cold" && "bg-cyan-500/20 text-cyan-400",
              caseData.case.status === "solved" && "bg-emerald-500/20 text-emerald-400",
              caseData.case.status === "archived" && "bg-gray-500/20 text-gray-400"
            )}
          >
            {caseData.case.status}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider px-2 mb-1">
          Investigation Tools
        </p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all mb-0.5",
                isActive
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-300"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
              {tab.id === "evidence" && stats && (
                <span className="ml-auto text-[10px] bg-white/5 px-1.5 rounded-full">
                  {stats.evidenceCount}
                </span>
              )}
              {tab.id === "graph" && stats && (
                <span className="ml-auto text-[10px] bg-white/5 px-1.5 rounded-full">
                  {stats.entityCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-3 border-t border-white/5">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">
          Case Statistics
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-1.5">
              <FileCheck className="h-3 w-3" />
              Evidence
            </span>
            <span className="text-white font-medium">{stats?.evidenceCount ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              Entities
            </span>
            <span className="text-white font-medium">{stats?.entityCount ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Link2 className="h-3 w-3" />
              Relationships
            </span>
            <span className="text-white font-medium">{stats?.relationshipCount ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" />
              Contradictions
            </span>
            <span
              className={cn(
                "font-medium",
                (stats?.contradictionCount ?? 0) > 0
                  ? "text-red-400"
                  : "text-green-400"
              )}
            >
              {stats?.contradictionCount ?? 0}
            </span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-gray-500">Case Confidence</span>
            <span className="text-blue-400 font-medium">
              {Math.round((caseData.case.confidence ?? 0) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
              style={{ width: `${(caseData.case.confidence ?? 0) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cognee Badge */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-blue-500/5 border border-blue-500/10">
          <BrainCircuit className="h-3 w-3 text-blue-400" />
          <span className="text-[10px] text-blue-400 font-medium">
            Cognee Memory Active
          </span>
        </div>
      </div>
    </aside>
  );
}
