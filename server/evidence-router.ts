import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { evidence } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const evidenceRouter = createRouter({
  listByCase: publicQuery
    .input(z.object({ caseId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(evidence)
        .where(eq(evidence.caseId, input.caseId))
        .orderBy(desc(evidence.createdAt));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(evidence)
        .where(eq(evidence.id, input.id));
      return result[0] ?? null;
    }),

  listByType: publicQuery
    .input(z.object({ caseId: z.number(), type: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(evidence)
        .where(
          and(
            eq(evidence.caseId, input.caseId),
            eq(evidence.evidenceType, input.type as any)
          )
        )
        .orderBy(desc(evidence.createdAt));
    }),
});
