import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  FileText,
  Camera,
  Video,
  MessageSquare,
  FlaskConical,
  Fingerprint,
  Smartphone,
  Scroll,
  Mic,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { EvidenceItem, Entity } from "@/types/investigation";
import { evidenceTypeLabels } from "@/types/investigation";

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  entities: Entity[];
}

const typeIcons: Record<string, typeof FileText> = {
  statement: MessageSquare,
  physical: Fingerprint,
  digital: Smartphone,
  forensic: FlaskConical,
  cctv: Video,
  photo: Camera,
  document: Scroll,
  audio: Mic,
  other: HelpCircle,
};

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  statement: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  physical: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  digital: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  forensic: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  cctv: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  photo: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  document: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  audio: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  other: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" },
};

export default function EvidencePanel({ evidence, selectedId, onSelect }: EvidencePanelProps) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? evidence : evidence.filter((e) => e.evidenceType === filter);

  const selected = evidence.find((e) => e.id === selectedId);

  const types = ["all", ...new Set(evidence.map((e) => e.evidenceType))];

  return (
    <div className="flex h-full">
      {/* Evidence List */}
      <div className="w-96 border-r border-white/5 flex flex-col">
        <div className="p-3 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Evidence Files
            </h3>
            <Badge variant="outline" className="text-[10px] bg-white/5">
              {filtered.length} items
            </Badge>
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="w-full h-7 bg-white/5">
              {types.map((t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="text-[10px] px-2 py-0.5 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                >
                  {t === "all" ? "All" : evidenceTypeLabels[t as keyof typeof evidenceTypeLabels] ?? t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filtered.map((item) => {
              const colors = typeColors[item.evidenceType] ?? typeColors.other;
              const Icon = typeIcons[item.evidenceType] ?? HelpCircle;
              const isSelected = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all border",
                    isSelected
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={cn(
                        "p-1.5 rounded-lg shrink-0",
                        colors.bg
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5", colors.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs font-medium truncate",
                          isSelected ? "text-blue-400" : "text-gray-300"
                        )}
                      >
                        {item.title}
                      </p>
                      <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">
                        {item.description.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge
                          variant="outline"
                          className={cn("text-[9px] px-1 py-0", colors.bg, colors.text, colors.border)}
                        >
                          {evidenceTypeLabels[item.evidenceType as keyof typeof evidenceTypeLabels] ?? item.evidenceType}
                        </Badge>
                        {item.confidence !== null && (
                          <span
                            className={cn(
                              "text-[9px]",
                              item.confidence >= 0.9
                                ? "text-green-400"
                                : item.confidence >= 0.7
                                ? "text-yellow-400"
                                : "text-red-400"
                            )}
                          >
                            {Math.round(item.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Evidence Detail */}
      <div className="flex-1 p-4 overflow-auto">
        {selected ? (
          <Card className="bg-[#0f0f18] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      (typeColors[selected.evidenceType] ?? typeColors.other).bg
                    )}
                  >
                    {((): any => {
                      const Icon =
                        typeIcons[selected.evidenceType] ?? HelpCircle;
                      return (
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            (typeColors[selected.evidenceType] ?? typeColors.other).text
                          )}
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">{selected.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          (typeColors[selected.evidenceType] ?? typeColors.other).bg,
                          (typeColors[selected.evidenceType] ?? typeColors.other).text,
                          (typeColors[selected.evidenceType] ?? typeColors.other).border
                        )}
                      >
                        {evidenceTypeLabels[selected.evidenceType as keyof typeof evidenceTypeLabels] ??
                          selected.evidenceType}
                      </Badge>
                      {selected.source && (
                        <span className="text-xs text-gray-500">Source: {selected.source}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selected.confidence !== null && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
                      {selected.confidence >= 0.9 ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-yellow-400" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          selected.confidence >= 0.9
                            ? "text-green-400"
                            : selected.confidence >= 0.7
                            ? "text-yellow-400"
                            : "text-red-400"
                        )}
                      >
                        {Math.round(selected.confidence * 100)}% confidence
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div>
                <h4 className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
                  Description
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selected.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-3 gap-3">
                {selected.timestamp && (
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-gray-500 mb-0.5">Timestamp</p>
                    <p className="text-xs text-gray-300">{selected.timestamp}</p>
                  </div>
                )}
                {selected.source && (
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-gray-500 mb-0.5">Source</p>
                    <p className="text-xs text-gray-300">{selected.source}</p>
                  </div>
                )}
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-gray-500 mb-0.5">Added</p>
                  <p className="text-xs text-gray-300">
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Confidence visualization */}
              {selected.confidence !== null && (
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                    Confidence Analysis
                  </h4>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Evidence Reliability</span>
                      <span
                        className={cn(
                          "text-sm font-bold",
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
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          selected.confidence >= 0.9
                            ? "bg-gradient-to-r from-green-500 to-green-400"
                            : selected.confidence >= 0.7
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                            : "bg-gradient-to-r from-red-500 to-red-400"
                        )}
                        style={{ width: `${selected.confidence * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">
                      {selected.confidence >= 0.9
                        ? "High-confidence evidence with strong corroboration"
                        : selected.confidence >= 0.7
                        ? "Moderate confidence — additional verification recommended"
                        : "Low confidence — this evidence may be unreliable or contradictory"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Select an evidence item to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
