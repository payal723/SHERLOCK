import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  float,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── CASES ───────────────────────────────────────────────
export const cases = mysqlTable("cases", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["active", "cold", "solved", "archived"])
    .default("active")
    .notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"])
    .default("medium")
    .notNull(),
  victimName: varchar("victim_name", { length: 255 }),
  location: varchar("location", { length: 255 }),
  dateOpened: timestamp("date_opened").defaultNow().notNull(),
  dateClosed: timestamp("date_closed"),
  leadInvestigator: varchar("lead_investigator", { length: 255 }),
  tags: text("tags"),
  confidence: float("confidence").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Case = typeof cases.$inferSelect;
export type InsertCase = typeof cases.$inferInsert;

// ── EVIDENCE ────────────────────────────────────────────
export const evidence = mysqlTable("evidence", {
  id: serial("id").primaryKey(),
  caseId: bigint("case_id", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  evidenceType: mysqlEnum("evidence_type", [
    "statement",
    "physical",
    "digital",
    "forensic",
    "cctv",
    "photo",
    "document",
    "audio",
    "other",
  ]).notNull(),
  source: varchar("source", { length: 255 }),
  confidence: float("confidence").default(1.0),
  timestamp: varchar("timestamp", { length: 100 }),
  fileUrl: text("file_url"),
  metadata: text("metadata"),
  extractedEntities: text("extracted_entities"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Evidence = typeof evidence.$inferSelect;
export type InsertEvidence = typeof evidence.$inferInsert;

// ── ENTITIES (People, Locations, Objects) ──────────────
export const entities = mysqlTable("entities", {
  id: serial("id").primaryKey(),
  caseId: bigint("case_id", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  entityType: mysqlEnum("entity_type", [
    "person",
    "location",
    "object",
    "organization",
    "vehicle",
    "weapon",
    "drug",
    "other",
  ]).notNull(),
  role: varchar("role", { length: 100 }),
  description: text("description"),
  metadata: text("metadata"),
  confidence: float("confidence").default(1.0),
  x: float("x"),
  y: float("y"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Entity = typeof entities.$inferSelect;
export type InsertEntity = typeof entities.$inferInsert;

// ── RELATIONSHIPS ───────────────────────────────────────
export const relationships = mysqlTable("relationships", {
  id: serial("id").primaryKey(),
  caseId: bigint("case_id", { mode: "number", unsigned: true }).notNull(),
  sourceId: bigint("source_id", { mode: "number", unsigned: true }).notNull(),
  targetId: bigint("target_id", { mode: "number", unsigned: true }).notNull(),
  relationType: varchar("relation_type", { length: 100 }).notNull(),
  description: text("description"),
  evidenceId: bigint("evidence_id", { mode: "number", unsigned: true }),
  confidence: float("confidence").default(1.0),
  timestamp: varchar("timestamp", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = typeof relationships.$inferInsert;

// ── CONTRADICTIONS ──────────────────────────────────────
export const contradictions = mysqlTable("contradictions", {
  id: serial("id").primaryKey(),
  caseId: bigint("case_id", { mode: "number", unsigned: true }).notNull(),
  evidenceAId: bigint("evidence_a_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  evidenceBId: bigint("evidence_b_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  entityId: bigint("entity_id", { mode: "number", unsigned: true }),
  description: text("description").notNull(),
  severity: mysqlEnum("severity", ["minor", "moderate", "critical"])
    .default("moderate")
    .notNull(),
  status: mysqlEnum("status", ["open", "resolved", "under_review"])
    .default("open")
    .notNull(),
  suggestedFollowUp: text("suggested_follow_up"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Contradiction = typeof contradictions.$inferSelect;
export type InsertContradiction = typeof contradictions.$inferInsert;

// ── COGNEE MEMORY LOG (for audit/demo) ──────────────────
export const cogneeLogs = mysqlTable("cognee_logs", {
  id: serial("id").primaryKey(),
  caseId: bigint("case_id", { mode: "number", unsigned: true }).notNull(),
  operation: mysqlEnum("operation", ["remember", "recall", "improve", "forget"])
    .notNull(),
  query: text("query"),
  result: text("result"),
  confidence: float("confidence"),
  processingTime: int("processing_time_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CogneeLog = typeof cogneeLogs.$inferSelect;
export type InsertCogneeLog = typeof cogneeLogs.$inferInsert;

// ── INVESTIGATION QUERIES ───────────────────────────────
export const investigationQueries = mysqlTable("investigation_queries", {
  id: serial("id").primaryKey(),
  caseId: bigint("case_id", { mode: "number", unsigned: true }).notNull(),
  query: text("query").notNull(),
  response: text("response"),
  reasoningPath: text("reasoning_path"),
  confidence: float("confidence"),
  evidenceChain: text("evidence_chain"),
  processingTime: int("processing_time_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InvestigationQuery = typeof investigationQueries.$inferSelect;
export type InsertInvestigationQuery = typeof investigationQueries.$inferInsert;
