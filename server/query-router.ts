import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { investigationQueries, cogneeLogs } from "../../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";

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
    .input(
      z.object({
        caseId: z.number(),
        query: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Simulate AI processing
      const startTime = Date.now();

      // Store the query first with "processing" state
      await db.insert(investigationQueries).values({
        caseId: input.caseId,
        query: input.query,
        response: "Processing...",
        confidence: 0,
        processingTime: 0,
      });

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const processingTime = Date.now() - startTime;

      // Generate mock AI response based on query keywords
      const query = input.query.toLowerCase();
      let response = "";
      let reasoningPath = "";
      let confidence = 0.85;
      let evidenceChain = "";

      if (query.includes("last") || query.includes("see") || query.includes("alive")) {
        response = `Based on the evidence graph, **Mike Ross** is the most likely last person to see John Doe alive.\n\n**Reasoning path:**\n1. Phone Call at 9:30 PM — Last outgoing call from John's phone to Mike (4 min 23 sec)\n2. Whiskey Glass — Found at scene with Mike's fingerprints AND John's DNA\n3. Security Guard — Saw Mike leave at 9:45 PM via service entrance\n\n**Confidence: 88%**\n\n⚠️ **Contradiction detected**: Bartender Lisa Park states she saw John arguing at 10 PM, which would be AFTER Mike left. This needs resolution.`;
        reasoningPath = "John Doe → Phone Call → Mike Ross (9:30 PM) → Whiskey Glass → Mike leaves (9:45 PM)";
        confidence = 0.88;
        evidenceChain = "Phone Records: Final Call, Physical Evidence: Whiskey Glass, Witness Statement: Security Guard David Kim";
      } else if (query.includes("connect") || query.includes("mike") || query.includes("ross")) {
        response = `Mike Ross has **multiple connections** to the crime scene:\n\n1. **Financial motive**: Owed victim $250,000 (promissory note overdue)\n2. **Physical evidence**: His fingerprints on whiskey glass found at scene\n3. **Digital evidence**: Last phone call with victim at 9:30 PM\n4. **Witness sighting**: Seen leaving hotel via service entrance at 9:45 PM (unusual behavior)\n5. **Vehicle**: Black SUV captured exiting parking garage at 9:47 PM\n\n**Confidence Score: 92%** — Mike Ross is the primary suspect.`;
        reasoningPath = "Mike Ross → $250K debt (motive) → fingerprints (physical) → phone call 9:30 PM (digital) → leaves 9:45 PM (witness) → SUV exits 9:47 PM (CCTV)";
        confidence = 0.92;
        evidenceChain = "Financial Records, Whiskey Glass, Phone Records, Security Guard Statement, CCTV Parking";
      } else if (query.includes("contradiction") || query.includes("conflict")) {
        response = `I found **3 critical contradictions** in the evidence:\n\n**🔴 CRITICAL #1 — Timeline Gap:**\n- Lisa Park: Saw argument at 10 PM\n- David Kim: Saw Mike leave at 9:45 PM\n- **Contradiction**: Mike cannot be at 10 PM argument if he left at 9:45 PM\n\n**🟡 MODERATE #2 — Audio Timing:**\n- Amanda Foster: Heard argument at 9:15 PM\n- Phone records: Call to Mike at 9:30 PM\n- **Contradiction**: Who was arguing at 9:15 if Mike only called at 9:30?\n\n**🔴 CRITICAL #3 — Medical Impossibility:**\n- Toxicology: Lethal fentanyl dose, death 10-11 PM\n- Lisa Park: Saw John coherent and arguing at 10 PM\n- **Contradiction**: Person with lethal fentanyl dose would not be coherent enough to argue`;
        reasoningPath = "Cross-reference all witness timestamps → Compare with digital evidence → Flag inconsistencies → Update confidence scores";
        confidence = 0.9;
        evidenceChain = "All witness statements + forensic report + phone records";
      } else if (query.includes("weapon") || query.includes("murder") || query.includes("pill") || query.includes("fentanyl")) {
        response = `The **murder weapon is fentanyl** administered via the empty pill bottle found at the scene.\n\n**Chain of custody analysis:**\n1. **Fentanyl source**: Marcus Webb (underground pharmacy supplier on Fremont St)\n2. **Distribution**: Webb supplied fentanyl-laced pills to multiple buyers\n3. **Delivery to victim**: Unknown intermediary\n4. **Method**: Pills in unlabeled bottle with only John's fingerprints\n\n**Key insight**: The absence of prescription label + victim's fingerprints ONLY suggests the bottle was planted to look like self-administration.\n\n**Confidence: 85%**`;
        reasoningPath = "Empty Pill Bottle → Fentanyl (toxicology) → Marcus Webb (supplier) → Underground Pharmacy";
        confidence = 0.85;
        evidenceChain = "Forensic Report: Toxicology, Empty Pill Bottle, Pharmacy Supplier Intelligence";
      } else if (query.includes("suspect") || query.includes("who") || query.includes("kill")) {
        response = `**Primary Suspect: Mike Ross (Confidence: 92%)**\n\n**Evidence chain:**\n- Financial motive: $250,000 debt (overdue since Jan 1)\n- Physical evidence: Fingerprints on whiskey glass at scene\n- Digital evidence: Last phone call 9:30 PM (4m 23s)\n- Behavioral: Left via unusual service entrance at 9:45 PM\n- Vehicle: Black SUV exited garage at 9:47 PM\n\n**Secondary Suspect: Elena Vasquez (Confidence: 65%)**\n\n**Evidence chain:**\n- Personal motive: Ended relationship, threatening text messages\n- Witnessed: Arguing with victim at Skyline Bar around 10 PM\n- Text: "I'm coming. This ends tonight."\n\n**Tertiary Suspect: Marcus Webb (Confidence: 45%)**\n\n**Evidence chain:**\n- Supplier of fentanyl that caused death\n- Seen at hotel on evening of incident\n- No direct link to victim's room established`;
        reasoningPath = "Multi-hop analysis: Financial records → Physical evidence → Digital traces → Witness statements → Behavioral analysis";
        confidence = 0.92;
        evidenceChain = "All evidence items cross-referenced";
      } else if (query.includes("timeline") || query.includes("time") || query.includes("when")) {
        response = `**Event Timeline (January 15, 2024):**\n\n**7:45 PM** — John Doe enters hotel lobby with Mike Ross, Elena Vasquez, and unidentified male\n**8:00 PM** — Group ascends to penthouse floor (CCTV)\n**8:30 PM** — Room service delivers whiskey and appetizers to suite 1502\n**9:15 PM** — Amanda Foster hears loud voices from next door (argument about money)\n**9:30 PM** — Last phone call: John calls Mike (4 min 23 sec)\n**9:45 PM** — Security guard sees Mike leave via service entrance (agitated)\n**9:47 PM** — Mike's black SUV exits parking garage (CCTV)\n**10:00 PM** — Lisa Park witnesses John and Elena arguing at Skyline Bar\n**10:15 PM** — John and Elena leave bar separately\n**10:30-11:00 PM** — **TIME OF DEATH** (forensic estimate)\n\n**⚠️ Contradictions in timeline:**\n- 9:15 PM argument: Amanda heard voices, but Mike was on phone at 9:30\n- 10:00 PM bar sighting: John appears coherent despite lethal fentanyl dose`;
        reasoningPath = "CCTV timestamps → Phone records → Witness statements → Forensic TOD estimate → Cross-reference for inconsistencies";
        confidence = 0.87;
        evidenceChain = "CCTV Lobby, Phone Records, Witness Statements, Forensic Report";
      } else {
        response = `Based on my analysis of the evidence graph for "The Vegas Mystery":\n\nI've examined ${input.caseId === 1 ? "12 evidence items, 18 entities, and 19 relationships" : "the available evidence"}.\n\n**Key findings:**\n- Primary suspect: **Mike Ross** (92% confidence)\n- Murder weapon: **Fentanyl** (85% confidence)\n- **3 contradictions** detected requiring follow-up\n- Critical timeline gaps between 9:15 PM and 10:30 PM\n\nWould you like me to explore any specific aspect of this case in more detail?`;
        reasoningPath = "General case analysis → Entity relationship mapping → Confidence scoring";
        confidence = 0.8;
        evidenceChain = "Complete evidence database";
      }

      // Update with the response
      await db
        .update(investigationQueries)
        .set({
          response,
          reasoningPath,
          confidence,
          evidenceChain,
          processingTime,
        })
        .where(
          sql`case_id = ${input.caseId} AND query = ${input.query} AND response = 'Processing...'`
        );

      // Log Cognee operation
      await db.insert(cogneeLogs).values({
        caseId: input.caseId,
        operation: "recall",
        query: input.query,
        result: response.substring(0, 200) + "...",
        confidence,
        processingTime,
      });

      return {
        query: input.query,
        response,
        reasoningPath,
        confidence,
        evidenceChain,
        processingTime,
      };
    }),
});