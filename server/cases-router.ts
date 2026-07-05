import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { cases, evidence, entities, relationships, contradictions, cogneeLogs, investigationQueries } from "../../db/schema.js";
import { sql, eq, desc } from "drizzle-orm";

export const casesRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(cases).orderBy(desc(cases.createdAt));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(cases)
        .where(eq(cases.id, input.id));
      return result[0] ?? null;
    }),

  getStats: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [evidenceCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(evidence)
        .where(eq(evidence.caseId, input.id));
      const [entityCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(entities)
        .where(eq(entities.caseId, input.id));
      const [relationshipCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(relationships)
        .where(eq(relationships.caseId, input.id));
      const [contradictionCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(contradictions)
        .where(eq(contradictions.caseId, input.id));

      return {
        evidenceCount: evidenceCount.count,
        entityCount: entityCount.count,
        relationshipCount: relationshipCount.count,
        contradictionCount: contradictionCount.count,
      };
    }),

  getFullCase: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const caseData = await db
        .select()
        .from(cases)
        .where(eq(cases.id, input.id));
      if (!caseData[0]) return null;

      const evidenceData = await db
        .select()
        .from(evidence)
        .where(eq(evidence.caseId, input.id))
        .orderBy(evidence.timestamp);

      const entitiesData = await db
        .select()
        .from(entities)
        .where(eq(entities.caseId, input.id));

      const relationshipsData = await db
        .select()
        .from(relationships)
        .where(eq(relationships.caseId, input.id));

      const contradictionsData = await db
        .select()
        .from(contradictions)
        .where(eq(contradictions.caseId, input.id));

      const cogneeLogsData = await db
        .select()
        .from(cogneeLogs)
        .where(eq(cogneeLogs.caseId, input.id))
        .orderBy(desc(cogneeLogs.createdAt));

      const queriesData = await db
        .select()
        .from(investigationQueries)
        .where(eq(investigationQueries.caseId, input.id))
        .orderBy(desc(investigationQueries.createdAt));

      return {
        case: caseData[0],
        evidence: evidenceData,
        entities: entitiesData,
        relationships: relationshipsData,
        contradictions: contradictionsData,
        cogneeLogs: cogneeLogsData,
        queries: queriesData,
      };
    }),
});