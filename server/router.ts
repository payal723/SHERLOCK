import { authRouter } from "./auth-router.js";
import { casesRouter } from "./cases-router.js";
import { evidenceRouter } from "./evidence-router.js";
import { queryRouter } from "./query-router.js";
import { seedRouter } from "./seed-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  cases: casesRouter,
  evidence: evidenceRouter,
  query: queryRouter,
  seed: seedRouter,
});

export type AppRouter = typeof appRouter;