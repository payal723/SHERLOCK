import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  FileText,
  Link2,
  Users,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InvestigationCase, CaseStats } from "@/types/investigation";

interface CaseHeaderProps {
  caseData: InvestigationCase;
  stats?: CaseStats;
  onBack: () => void;
}

export default function CaseHeader({ caseData, stats, onBack }: CaseHeaderProps) {
  return (
    <header className="border-b border-white/5 bg-[#0c0c14]/90 backdrop-blur-xl">
      <div className="px-3 md:px-4 py-2 md:py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:bg-white/5 -ml-2 shrink-0"
            >
              <ArrowLeft className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">Cases</span>
            </Button>
            <div className="h-4 w-px bg-white/10 shrink-0 hidden md:block" />
            <h1 className="text-sm md:text-base font-semibold text-white truncate">
              {caseData.title}
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] shrink-0 hidden sm:flex",
                caseData.severity === "critical" && "bg-red-500/20 text-red-400 border-red-500/30",
                caseData.severity === "high" && "bg-orange-500/20 text-orange-400 border-orange-500/30",
                caseData.severity === "medium" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                caseData.severity === "low" && "bg-blue-500/20 text-blue-400 border-blue-500/30"
              )}
            >
              {caseData.severity === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
              {caseData.severity.toUpperCase()}
            </Badge>
          </div>

          {/* Right side — date, hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(caseData.dateOpened).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Info Row — hidden on mobile, shown on md+ */}
        <div className="hidden md:flex items-center gap-4 mt-2 text-xs text-gray-400">
          {caseData.victimName && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-gray-500" />
              Victim: <span className="text-gray-300">{caseData.victimName}</span>
            </span>
          )}
          {caseData.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gray-500" />
              <span className="text-gray-300">{caseData.location}</span>
            </span>
          )}
          {caseData.leadInvestigator && (
            <span className="flex items-center gap-1">
              <Search className="h-3 w-3 text-gray-500" />
              Lead: <span className="text-gray-300">{caseData.leadInvestigator}</span>
            </span>
          )}
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3 text-blue-400" />
              <span className="text-blue-400">{stats?.evidenceCount ?? 0}</span> evidence
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-yellow-400" />
              <span className="text-yellow-400">{stats?.entityCount ?? 0}</span> entities
            </span>
            <span className="flex items-center gap-1">
              <Link2 className="h-3 w-3 text-green-400" />
              <span className="text-green-400">{stats?.relationshipCount ?? 0}</span> relations
            </span>
            {(stats?.contradictionCount ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-400" />
                <span className="text-red-400">{stats?.contradictionCount}</span> conflicts
              </span>
            )}
          </div>
        </div>

        {/* Mobile mini stats row */}
        <div className="flex md:hidden items-center gap-3 mt-1.5 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-blue-400" />
            <span className="text-blue-400">{stats?.evidenceCount ?? 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-yellow-400" />
            <span className="text-yellow-400">{stats?.entityCount ?? 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <Link2 className="h-3 w-3 text-green-400" />
            <span className="text-green-400">{stats?.relationshipCount ?? 0}</span>
          </span>
          {(stats?.contradictionCount ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-red-400" />
              <span className="text-red-400">{stats?.contradictionCount}</span>
            </span>
          )}
          {caseData.victimName && (
            <span className="ml-auto text-gray-500 truncate">
              Victim: <span className="text-gray-300">{caseData.victimName}</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}