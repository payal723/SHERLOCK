import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Link2,
  AlertTriangle,
  BrainCircuit,
  Activity,
} from "lucide-react";
import type { CaseStats } from "@/types/investigation";

interface StatsOverlayProps {
  stats?: CaseStats;
  className?: string;
}

export default function StatsOverlay({ stats, className }: StatsOverlayProps) {
  if (!stats) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge
        variant="outline"
        className="bg-[#0f0f18]/90 text-gray-300 border-white/10 text-[10px] backdrop-blur"
      >
        <FileText className="h-2.5 w-2.5 mr-1 text-blue-400" />
        {stats.evidenceCount}
      </Badge>
      <Badge
        variant="outline"
        className="bg-[#0f0f18]/90 text-gray-300 border-white/10 text-[10px] backdrop-blur"
      >
        <Users className="h-2.5 w-2.5 mr-1 text-yellow-400" />
        {stats.entityCount}
      </Badge>
      <Badge
        variant="outline"
        className="bg-[#0f0f18]/90 text-gray-300 border-white/10 text-[10px] backdrop-blur"
      >
        <Link2 className="h-2.5 w-2.5 mr-1 text-green-400" />
        {stats.relationshipCount}
      </Badge>
      {stats.contradictionCount > 0 && (
        <Badge
          variant="outline"
          className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] backdrop-blur"
        >
          <AlertTriangle className="h-2.5 w-2.5 mr-1" />
          {stats.contradictionCount}
        </Badge>
      )}
      <Badge
        variant="outline"
        className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px] backdrop-blur"
      >
        <BrainCircuit className="h-2.5 w-2.5 mr-1" />
        Cognee
      </Badge>
      <Badge
        variant="outline"
        className="bg-[#0f0f18]/90 text-green-400 border-white/10 text-[10px] backdrop-blur"
      >
        <Activity className="h-2.5 w-2.5 mr-1" />
        Live
      </Badge>
    </div>
  );
}
