import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Send,
  MessageSquareCode,
  BrainCircuit,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  User,
  Network,
  ChevronRight,
} from "lucide-react";
import type { InvestigationQuery } from "@/types/investigation";

interface QueryPanelProps {
  caseId: number;
  queries: InvestigationQuery[];
}

const suggestedQueries = [
  "Who was the last person to see the victim?",
  "What connects Mike Ross to the crime scene?",
  "Find contradictions in witness statements",
  "What's the murder weapon and where did it come from?",
  "Who are the primary suspects and what's the evidence?",
  "Show me the timeline of events",
];

function ConfidenceBadge({ score }: { score: number }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px]",
        score >= 0.9
          ? "bg-green-500/15 text-green-400 border-green-500/30"
          : score >= 0.7
          ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
          : "bg-red-500/15 text-red-400 border-red-500/30"
      )}
    >
      {score >= 0.9 ? (
        <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
      ) : (
        <AlertCircle className="h-2.5 w-2.5 mr-1" />
      )}
      {Math.round(score * 100)}% confidence
    </Badge>
  );
}

function generateResponse(query: string): { response: string; reasoningPath: string; confidence: number; evidenceChain: string } {
  const q = query.toLowerCase();

  if (q.includes("last") || q.includes("see") || q.includes("alive")) {
    return {
      response: `Based on the evidence graph, **Mike Ross** is the most likely last person to see John Doe alive.\n\n**Reasoning path:**\n1. Phone Call at 9:30 PM — Last outgoing call from John's phone to Mike (4 min 23 sec)\n2. Whiskey Glass — Found at scene with Mike's fingerprints AND John's DNA\n3. Security Guard — Saw Mike leave at 9:45 PM via service entrance\n\n**Confidence: 88%**\n\n⚠️ **Contradiction detected**: Bartender Lisa Park states she saw John arguing at 10 PM, which would be AFTER Mike left. This needs resolution.`,
      reasoningPath: "John Doe → Phone Call → Mike Ross (9:30 PM) → Whiskey Glass → Mike leaves (9:45 PM)",
      confidence: 0.88,
      evidenceChain: "Phone Records: Final Call, Physical Evidence: Whiskey Glass, Witness Statement: Security Guard David Kim",
    };
  }
  if (q.includes("connect") || q.includes("mike") || q.includes("ross")) {
    return {
      response: `Mike Ross has **multiple connections** to the crime scene:\n\n1. **Financial motive**: Owed victim $250,000 (promissory note overdue)\n2. **Physical evidence**: His fingerprints on whiskey glass found at scene\n3. **Digital evidence**: Last phone call with victim at 9:30 PM\n4. **Witness sighting**: Seen leaving hotel via service entrance at 9:45 PM (unusual behavior)\n5. **Vehicle**: Black SUV captured exiting parking garage at 9:47 PM\n\n**Confidence Score: 92%** — Mike Ross is the primary suspect.`,
      reasoningPath: "Mike Ross → $250K debt (motive) → fingerprints (physical) → phone call 9:30 PM (digital) → leaves 9:45 PM (witness) → SUV exits 9:47 PM (CCTV)",
      confidence: 0.92,
      evidenceChain: "Financial Records, Whiskey Glass, Phone Records, Security Guard Statement, CCTV Parking",
    };
  }
  if (q.includes("contradiction") || q.includes("conflict")) {
    return {
      response: `I found **3 critical contradictions** in the evidence:\n\n**🔴 CRITICAL #1 — Timeline Gap:**\n- Lisa Park: Saw argument at 10 PM\n- David Kim: Saw Mike leave at 9:45 PM\n- **Contradiction**: Mike cannot be at 10 PM argument if he left at 9:45 PM\n\n**🟡 MODERATE #2 — Audio Timing:**\n- Amanda Foster: Heard argument at 9:15 PM\n- Phone records: Call to Mike at 9:30 PM\n- **Contradiction**: Who was arguing at 9:15 if Mike only called at 9:30?\n\n**🔴 CRITICAL #3 — Medical Impossibility:**\n- Toxicology: Lethal fentanyl dose, death 10-11 PM\n- Lisa Park: Saw John coherent and arguing at 10 PM\n- **Contradiction**: Person with lethal fentanyl dose would not be coherent enough to argue`,
      reasoningPath: "Cross-reference all witness timestamps → Compare with digital evidence → Flag inconsistencies → Update confidence scores",
      confidence: 0.9,
      evidenceChain: "All witness statements + forensic report + phone records",
    };
  }
  if (q.includes("weapon") || q.includes("pill") || q.includes("fentanyl")) {
    return {
      response: `The **murder weapon is fentanyl** administered via the empty pill bottle found at the scene.\n\n**Chain of custody analysis:**\n1. **Fentanyl source**: Marcus Webb (underground pharmacy supplier on Fremont St)\n2. **Distribution**: Webb supplied fentanyl-laced pills to multiple buyers\n3. **Delivery to victim**: Unknown intermediary\n4. **Method**: Pills in unlabeled bottle with only John's fingerprints\n\n**Key insight**: The absence of prescription label + victim's fingerprints ONLY suggests the bottle was planted to look like self-administration.\n\n**Confidence: 85%**`,
      reasoningPath: "Empty Pill Bottle → Fentanyl (toxicology) → Marcus Webb (supplier) → Underground Pharmacy",
      confidence: 0.85,
      evidenceChain: "Forensic Report: Toxicology, Empty Pill Bottle, Pharmacy Supplier Intelligence",
    };
  }
  if (q.includes("suspect") || q.includes("who") || q.includes("kill")) {
    return {
      response: `**Primary Suspect: Mike Ross (Confidence: 92%)**\n\n**Evidence chain:**\n- Financial motive: $250,000 debt (overdue since Jan 1)\n- Physical evidence: Fingerprints on whiskey glass at scene\n- Digital evidence: Last phone call 9:30 PM (4m 23s)\n- Behavioral: Left via unusual service entrance at 9:45 PM\n- Vehicle: Black SUV exited garage at 9:47 PM\n\n**Secondary Suspect: Elena Vasquez (Confidence: 65%)**\n\n**Evidence chain:**\n- Personal motive: Ended relationship, threatening text messages\n- Witnessed: Arguing with victim at Skyline Bar around 10 PM\n- Text: "I'm coming. This ends tonight."\n\n**Tertiary Suspect: Marcus Webb (Confidence: 45%)**\n\n**Evidence chain:**\n- Supplier of fentanyl that caused death\n- Seen at hotel on evening of incident\n- No direct link to victim's room established`,
      reasoningPath: "Multi-hop analysis: Financial records → Physical evidence → Digital traces → Witness statements → Behavioral analysis",
      confidence: 0.92,
      evidenceChain: "All evidence items cross-referenced",
    };
  }
  if (q.includes("timeline") || q.includes("time") || q.includes("when")) {
    return {
      response: `**Event Timeline (January 15, 2024):**\n\n**7:45 PM** — John Doe enters hotel lobby with Mike Ross, Elena Vasquez, and unidentified male\n**8:00 PM** — Group ascends to penthouse floor (CCTV)\n**8:30 PM** — Room service delivers whiskey and appetizers to suite 1502\n**9:15 PM** — Amanda Foster hears loud voices from next door (argument about money)\n**9:30 PM** — Last phone call: John calls Mike (4 min 23 sec)\n**9:45 PM** — Security guard sees Mike leave via service entrance (agitated)\n**9:47 PM** — Mike's black SUV exits parking garage (CCTV)\n**10:00 PM** — Lisa Park witnesses John and Elena arguing at Skyline Bar\n**10:15 PM** — John and Elena leave bar separately\n**10:30-11:00 PM** — **TIME OF DEATH** (forensic estimate)\n\n**⚠️ Contradictions in timeline:**\n- 9:15 PM argument: Amanda heard voices, but Mike was on phone at 9:30\n- 10:00 PM bar sighting: John appears coherent despite lethal fentanyl dose`,
      reasoningPath: "CCTV timestamps → Phone records → Witness statements → Forensic TOD estimate → Cross-reference for inconsistencies",
      confidence: 0.87,
      evidenceChain: "CCTV Lobby, Phone Records, Witness Statements, Forensic Report",
    };
  }
  return {
    response: `Based on my analysis of the evidence graph for "The Vegas Mystery":\n\nI've examined 12 evidence items, 18 entities, and 19 relationships.\n\n**Key findings:**\n- Primary suspect: **Mike Ross** (92% confidence)\n- Murder weapon: **Fentanyl** (85% confidence)\n- **3 contradictions** detected requiring follow-up\n- Critical timeline gaps between 9:15 PM and 10:30 PM\n\nWould you like me to explore any specific aspect of this case in more detail?`,
    reasoningPath: "General case analysis → Entity relationship mapping → Confidence scoring",
    confidence: 0.8,
    evidenceChain: "Complete evidence database",
  };
}

export default function QueryPanel({ queries }: QueryPanelProps) {
  const [query, setQuery] = useState("");
  const [localQueries, setLocalQueries] = useState<InvestigationQuery[]>(queries);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localQueries.length, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const q = query.trim();
    setQuery("");
    setIsLoading(true);

    // Simulate processing
    setTimeout(() => {
      const result = generateResponse(q);
      const newQuery: InvestigationQuery = {
        id: Date.now(),
        caseId: 1,
        query: q,
        response: result.response,
        reasoningPath: result.reasoningPath,
        confidence: result.confidence,
        evidenceChain: result.evidenceChain,
        processingTime: Math.floor(Math.random() * 2000) + 1500,
        createdAt: new Date(),
      };
      setLocalQueries((prev) => [...prev, newQuery]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggested = (q: string) => {
    if (isLoading) return;
    setQuery(q);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Query History */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Welcome */}
          {localQueries.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
                <BrainCircuit className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">AI Investigation Assistant</h3>
              <p className="text-sm text-gray-400 mb-6">
                Ask natural language questions about the case. SHERLOCK uses Cognee&apos;s graph-vector memory for multi-hop reasoning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                {suggestedQueries.map((sq) => (
                  <button
                    key={sq}
                    onClick={() => handleSuggested(sq)}
                    className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-blue-500/20 transition-all text-left group"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-300 group-hover:text-white">{sq}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Query Results */}
          {[...localQueries].reverse().map((q) => (
            <div key={q.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{q.query}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {new Date(q.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <BrainCircuit className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <Card className="bg-[#0f0f18] border-purple-500/10">
                    <CardContent className="p-4 space-y-3">
                      <div
                        className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: (q.response ?? "")
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                            .replace(/🔴/g, '<span class="text-red-400">🔴</span>')
                            .replace(/🟡/g, '<span class="text-yellow-400">🟡</span>')
                            .replace(/⚠️/g, '<span class="text-yellow-400">⚠️</span>'),
                        }}
                      />
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        {q.confidence !== null && <ConfidenceBadge score={q.confidence} />}
                        {q.processingTime && (
                          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/20">
                            <Clock className="h-2.5 w-2.5 mr-1" />
                            {(q.processingTime / 1000).toFixed(1)}s
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/20">
                          <Zap className="h-2.5 w-2.5 mr-1" />
                          Cognee recall()
                        </Badge>
                      </div>
                      {q.reasoningPath && (
                        <div className="p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/10">
                          <p className="text-[10px] text-purple-400 font-medium mb-1 flex items-center gap-1">
                            <Network className="h-3 w-3" />
                            Reasoning Path
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono">{q.reasoningPath}</p>
                        </div>
                      )}
                      {q.evidenceChain && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Evidence Chain</p>
                          <div className="flex flex-wrap gap-1">
                            {q.evidenceChain.split(",").map((item, i) => (
                              <span key={i} className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                                {i > 0 && <ChevronRight className="h-2.5 w-2.5 text-gray-600" />}
                                {item.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <BrainCircuit className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Query Input */}
      <div className="border-t border-white/5 p-4 bg-[#0c0c14]/80 backdrop-blur">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <MessageSquareCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask SHERLOCK anything about this case..."
              className="pl-10 bg-[#1a1a2e] border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !query.trim()} className="bg-blue-500 hover:bg-blue-600 text-white px-4">
            {isLoading ? <BrainCircuit className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <p className="text-center text-[10px] text-gray-600 mt-2">
          Powered by Cognee hybrid graph-vector memory with multi-hop reasoning
        </p>
      </div>
    </div>
  );
}
