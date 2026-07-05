import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { investigationQueries, cogneeLogs, evidence, entities, relationships, contradictions } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { runInvestigationQuery } from "./lib/ai";

export const queryRouter = createRouter({
  listByCase: publicQuery
    .input(z.object({ caseId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(investigationQueries)
        .where(eq(investigationQueries.caseId, input.caseId))
        .orderBy(desc(investigationQueries.createdAt));
    }),

  create: publicQuery
    .input(z.object({ caseId: z.number(), query: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const startTime = Date.now();

      await db.insert(investigationQueries).values({
        caseId: input.caseId,
        query: input.query,
        response: "Processing...",
        confidence: 0,
        processingTime: 0,
      });

      const [caseEvidence, caseEntities, caseRelationships, caseContradictions] = await Promise.all([
        db.select().from(evidence).where(eq(evidence.caseId, input.caseId)),
        db.select().from(entities).where(eq(entities.caseId, input.caseId)),
        db.select().from(relationships).where(eq(relationships.caseId, input.caseId)),
        db.select().from(contradictions).where(eq(contradictions.caseId, input.caseId)),
      ]);

      const entityNameById = new Map(caseEntities.map((e) => [e.id, e.name]));

      const { answer, reasoningPath, confidence, evidenceChain } = await runInvestigationQuery(
        input.query,
        {
          caseTitle: `Case #${input.caseId}`,
          caseDescription: null,
          evidence: caseEvidence.map((e) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            evidenceType: e.evidenceType,
            source: e.source,
            confidence: e.confidence,
            timestamp: e.timestamp,
          })),
          entities: caseEntities.map((e) => ({
            name: e.name,
            entityType: e.entityType,
            role: e.role,
            description: e.description,
          })),
          relationships: caseRelationships.map((r) => ({
            source: entityNameById.get(r.sourceId) ?? String(r.sourceId),
            target: entityNameById.get(r.targetId) ?? String(r.targetId),
            relationType: r.relationType,
            description: r.description,
            confidence: r.confidence,
          })),
          contradictions: caseContradictions.map((c) => ({
            description: c.description,
            severity: c.severity,
            status: c.status,
          })),
        }
      );

      const processingTime = Date.now() - startTime;

      await db
        .update(investigationQueries)
        .set({ response: answer, reasoningPath, confidence, evidenceChain, processingTime })
        .where(sql`case_id = ${input.caseId} AND query = ${input.query} AND response = 'Processing...'`);

      await db.insert(cogneeLogs).values({
        caseId: input.caseId,
        operation: "recall",
        query: input.query,
        result: answer.substring(0, 200) + "...",
        confidence,
        processingTime,
      });

      return { query: input.query, response: answer, reasoningPath, confidence, evidenceChain, processingTime };
    }),
});