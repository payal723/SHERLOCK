export type EntityType = "person" | "location" | "object" | "organization" | "vehicle" | "weapon" | "drug" | "other";
export type EvidenceType = "statement" | "physical" | "digital" | "forensic" | "cctv" | "photo" | "document" | "audio" | "other";
export type CaseStatus = "active" | "cold" | "solved" | "archived";
export type Severity = "low" | "medium" | "high" | "critical";
export type CogneeOperation = "remember" | "recall" | "improve" | "forget";

export interface InvestigationCase {
  id: number;
  title: string;
  description: string | null;
  status: CaseStatus;
  severity: Severity;
  victimName: string | null;
  location: string | null;
  dateOpened: Date;
  dateClosed: Date | null;
  leadInvestigator: string | null;
  tags: string | null;
  confidence: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvidenceItem {
  id: number;
  caseId: number;
  title: string;
  description: string;
  evidenceType: EvidenceType;
  source: string | null;
  confidence: number | null;
  timestamp: string | null;
  fileUrl: string | null;
  metadata: string | null;
  extractedEntities: string | null;
  createdAt: Date;
}

export interface Entity {
  id: number;
  caseId: number;
  name: string;
  entityType: EntityType;
  role: string | null;
  description: string | null;
  metadata: string | null;
  confidence: number | null;
  x: number | null;
  y: number | null;
  createdAt: Date;
}

export interface Relationship {
  id: number;
  caseId: number;
  sourceId: number;
  targetId: number;
  relationType: string;
  description: string | null;
  evidenceId: number | null;
  confidence: number | null;
  timestamp: string | null;
  createdAt: Date;
}

export interface Contradiction {
  id: number;
  caseId: number;
  evidenceAId: number;
  evidenceBId: number;
  entityId: number | null;
  description: string;
  severity: "minor" | "moderate" | "critical";
  status: "open" | "resolved" | "under_review";
  suggestedFollowUp: string | null;
  resolution: string | null;
  createdAt: Date;
}

export interface CogneeLog {
  id: number;
  caseId: number;
  operation: CogneeOperation;
  query: string | null;
  result: string | null;
  confidence: number | null;
  processingTime: number | null;
  createdAt: Date;
}

export interface InvestigationQuery {
  id: number;
  caseId: number;
  query: string;
  response: string | null;
  reasoningPath: string | null;
  confidence: number | null;
  evidenceChain: string | null;
  processingTime: number | null;
  createdAt: Date;
}

export interface CaseStats {
  evidenceCount: number;
  entityCount: number;
  relationshipCount: number;
  contradictionCount: number;
}

export interface FullCaseData {
  case: InvestigationCase;
  evidence: EvidenceItem[];
  entities: Entity[];
  relationships: Relationship[];
  contradictions: Contradiction[];
  cogneeLogs: CogneeLog[];
  queries: InvestigationQuery[];
}

export interface GraphNode {
  id: number;
  name: string;
  type: EntityType;
  role: string | null;
  description: string | null;
  confidence: number | null;
  x: number;
  y: number;
}

export interface GraphLink {
  id: number;
  source: number;
  target: number;
  type: string;
  description: string | null;
  confidence: number | null;
}

export const entityTypeColors: Record<EntityType, string> = {
  person: "#3b82f6",
  location: "#f59e0b",
  object: "#22c55e",
  organization: "#8b5cf6",
  vehicle: "#06b6d4",
  weapon: "#ef4444",
  drug: "#ec4899",
  other: "#6b7280",
};

export const entityTypeIcons: Record<EntityType, string> = {
  person: "👤",
  location: "📍",
  object: "🔧",
  organization: "🏢",
  vehicle: "🚗",
  weapon: "🔫",
  drug: "💊",
  other: "❓",
};

export const evidenceTypeIcons: Record<EvidenceType, string> = {
  statement: "📝",
  physical: "🔬",
  digital: "💻",
  forensic: "🧬",
  cctv: "📹",
  photo: "📷",
  document: "📄",
  audio: "🎙️",
  other: "❓",
};

export const evidenceTypeLabels: Record<EvidenceType, string> = {
  statement: "Witness Statement",
  physical: "Physical Evidence",
  digital: "Digital Evidence",
  forensic: "Forensic Report",
  cctv: "CCTV Footage",
  photo: "Photograph",
  document: "Document",
  audio: "Audio Recording",
  other: "Other",
};
