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
      <div className="px-4 py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:bg-white/5 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Cases
            </Button>
            <div className="h-4 w-px bg-white/10" />
            <h1 className="text-base font-semibold text-white">{caseData.title}</h1>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                caseData.severity === "critical" &&
                  "bg-red-500/20 text-red-400 border-red-500/30",
                caseData.severity === "high" &&
                  "bg-orange-500/20 text-orange-400 border-orange-500/30",
                caseData.severity === "medium" &&
                  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                caseData.severity === "low" &&
                  "bg-blue-500/20 text-blue-400 border-blue-500/30"
              )}
            >
              {caseData.severity === "critical" && (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {caseData.severity.toUpperCase()} PRIORITY
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>
                Opened{" "}
                {new Date(caseData.dateOpened).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
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
      </div>
    </header>
  );
}
