import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  Video,
  Smartphone,
  MessageSquare,
  FlaskConical,
  Fingerprint,
  Scroll,
  Camera,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import type { EvidenceItem, Entity, Relationship } from "@/types/investigation";
import { evidenceTypeLabels } from "@/types/investigation";

interface TimelineViewProps {
  evidence: EvidenceItem[];
  entities: Entity[];
  relationships: Relationship[];
}

const typeIcons: Record<string, typeof Video> = {
  cctv: Video,
  digital: Smartphone,
  statement: MessageSquare,
  forensic: FlaskConical,
  physical: Fingerprint,
  document: Scroll,
  photo: Camera,
  audio: HelpCircle,
  other: HelpCircle,
};

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  cctv: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
  digital: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  statement: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  forensic: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  physical: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400" },
  document: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
  photo: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
  audio: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400" },
  other: { bg: "bg-gray-500/10", border: "border-gray-500/20", text: "text-gray-400" },
};

function formatTime(timestamp: string | null): string {
  if (!timestamp) return "Unknown";
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timestamp;
  }
}

function formatDate(timestamp: string | null): string {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function TimelineView({ evidence }: TimelineViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Sort evidence by timestamp
  const sorted = [...evidence].sort((a, b) => {
    const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return ta - tb;
  });

  const selected = sorted.find((e) => e.id === selectedId);

  // Group by date
  const grouped = sorted.reduce(
    (acc, item) => {
      const date = item.timestamp ? new Date(item.timestamp).toDateString() : "Unknown";
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, EvidenceItem[]>
  );

  return (
    <div className="flex h-full">
      {/* Timeline */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            Event Timeline
          </h3>

          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]"
                >
                  {date === "Unknown" ? "Unknown Date" : formatDate(items[0]?.timestamp ?? null)}
                </Badge>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="relative pl-6 space-y-3">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-0 bottom-0 w-px bg-white/10" />

                {items.map((item) => {
                  const colors = typeColors[item.evidenceType] ?? typeColors.other;
                  const Icon = typeIcons[item.evidenceType] ?? HelpCircle;
                  const isSelected = item.id === selectedId;

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onClick={() => setSelectedId(item.id)}
                    >
                      {/* Dot */}
                      <div
                        className={cn(
                          "absolute left-[-17px] top-3 w-2.5 h-2.5 rounded-full border-2 transition-all",
                          isSelected
                            ? "bg-blue-500 border-blue-400 scale-125"
                            : "bg-[#0a0a0f] border-gray-600"
                        )}
                      />

                      <Card
                        className={cn(
                          "cursor-pointer transition-all border",
                          isSelected
                            ? "bg-blue-500/5 border-blue-500/30"
                            : "bg-[#0f0f18] border-white/5 hover:border-white/10"
                        )}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "p-1.5 rounded-lg shrink-0",
                                colors.bg
                              )}
                            >
                              <Icon className={cn("h-3.5 w-3.5", colors.text)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-blue-400">
                                  {formatTime(item.timestamp)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[9px] px-1 py-0",
                                    colors.bg,
                                    colors.text,
                                    colors.border
                                  )}
                                >
                                  {evidenceTypeLabels[item.evidenceType as keyof typeof evidenceTypeLabels] ??
                                    item.evidenceType}
                                </Badge>
                              </div>
                              <p
                                className={cn(
                                  "text-xs font-medium",
                                  isSelected ? "text-blue-400" : "text-gray-300"
                                )}
                              >
                                {item.title}
                              </p>
                              <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">
                                {item.description.substring(0, 120)}...
                              </p>
                              {item.source && (
                                <p className="text-[10px] text-gray-600 mt-1">
                                  Source: {item.source}
                                </p>
                              )}
                            </div>
                            {isSelected && <ChevronRight className="h-4 w-4 text-blue-400 shrink-0" />}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-80 border-l border-white/5 bg-[#0c0c14] p-4 overflow-auto">
          <h4 className="text-sm font-semibold text-white mb-3">{selected.title}</h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-4">{selected.description}</p>
          <div className="space-y-2">
            {selected.timestamp && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Time</span>
                <span className="text-gray-300 font-mono">{formatTime(selected.timestamp)}</span>
              </div>
            )}
            {selected.source && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Source</span>
                <span className="text-gray-300">{selected.source}</span>
              </div>
            )}
            {selected.confidence !== null && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Confidence</span>
                <span
                  className={cn(
                    selected.confidence >= 0.9
                      ? "text-green-400"
                      : selected.confidence >= 0.7
                      ? "text-yellow-400"
                      : "text-red-400"
                  )}
                >
                  {Math.round(selected.confidence * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
