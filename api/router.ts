import { authRouter } from "./auth-router";
import { casesRouter } from "./cases-router";
import { evidenceRouter } from "./evidence-router";
import { queryRouter } from "./query-router";
import { seedRouter } from "./seed-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  cases: casesRouter,
  evidence: evidenceRouter,
  query: queryRouter,
  seed: seedRouter,
});

export type AppRouter = typeof appRouter;
