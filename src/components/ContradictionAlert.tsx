import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  Lightbulb,
} from "lucide-react";
import type { Contradiction } from "@/types/investigation";

interface ContradictionAlertProps {
  contradictions: Contradiction[];
}

const severityConfig = {
  critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertTriangle },
  moderate: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: AlertCircle },
  minor: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Info },
};

export default function ContradictionAlert({ contradictions }: ContradictionAlertProps) {
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState<number[]>([]);

  const active = contradictions.filter((c) => !dismissed.includes(c.id));

  if (active.length === 0) return null;

  const criticalCount = active.filter((c) => c.severity === "critical").length;

  return (
    <Card className="bg-[#0f0f18] border-red-500/20 glow-red">
      <CardHeader className="py-2.5 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <CardTitle className="text-sm font-semibold text-red-400">
              Contradiction Alerts
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-red-500/15 text-red-400 border-red-500/30 text-[10px]"
            >
              {criticalCount} critical
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/5 text-gray-400 border-white/10 text-[10px]"
            >
              {active.length} total
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-7 w-7 p-0 text-gray-400 hover:text-white"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 pb-3 px-4">
          <ScrollArea className={cn("w-full", active.length > 2 && "h-48")}>
            <div className="space-y-2">
              {active.map((c) => {
                const sev = severityConfig[c.severity] ?? severityConfig.moderate;
                const Icon = sev.icon;
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      sev.bg,
                      sev.border
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", sev.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-xs font-semibold", sev.color)}>
                            {c.severity.toUpperCase()}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[9px] bg-white/5 text-gray-400 border-white/10"
                          >
                            {c.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {c.description}
                        </p>
                        {c.suggestedFollowUp && (
                          <div className="mt-2 p-2 rounded bg-white/5 border border-white/5">
                            <p className="text-[10px] text-yellow-400 font-medium flex items-center gap-1 mb-1">
                              <Lightbulb className="h-3 w-3" />
                              Suggested Follow-up
                            </p>
                            <p className="text-[11px] text-gray-400">{c.suggestedFollowUp}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setDismissed([...dismissed, c.id])}
                        className="text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
