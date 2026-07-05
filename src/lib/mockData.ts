import type {
  InvestigationCase,
  EvidenceItem,
  Entity,
  Relationship,
  Contradiction,
  CogneeLog,
  InvestigationQuery,
  CaseStats,
} from "@/types/investigation";

export const mockCase: InvestigationCase = {
  id: 1,
  title: "The Vegas Mystery",
  description:
    "John Doe, a 34-year-old software engineer, was found deceased in his penthouse suite at the Grand Vista Hotel, Las Vegas. The cause of death is initially ruled as a drug overdose, but circumstantial evidence suggests possible foul play. The victim was discovered at 6:47 AM by hotel housekeeping.",
  status: "active",
  severity: "critical",
  victimName: "John Doe",
  location: "Grand Vista Hotel, Las Vegas, NV",
  dateOpened: new Date("2024-01-16T06:47:00"),
  dateClosed: null,
  leadInvestigator: "Detective Sarah Chen",
  tags: "murder,overdose,vegas,hotel,penthouse",
  confidence: 0.87,
  createdAt: new Date("2024-01-16T06:47:00"),
  updatedAt: new Date("2024-01-16T06:47:00"),
};

export const mockEntities: Entity[] = [
  { id: 1, caseId: 1, name: "John Doe", entityType: "person", role: "victim", description: "34-year-old software engineer, found deceased in penthouse suite", metadata: null, confidence: 1.0, x: 500, y: 300, createdAt: new Date() },
  { id: 2, caseId: 1, name: "Mike Ross", entityType: "person", role: "suspect", description: "Victim's business partner, last person to call victim, owed $250,000", metadata: null, confidence: 0.9, x: 300, y: 150, createdAt: new Date() },
  { id: 3, caseId: 1, name: "Elena Vasquez", entityType: "person", role: "suspect", description: "Victim's ex-girlfriend, seen arguing with victim at bar", metadata: null, confidence: 0.85, x: 700, y: 150, createdAt: new Date() },
  { id: 4, caseId: 1, name: "Marcus Webb", entityType: "person", role: "suspect", description: "Underground pharmacy supplier, sold pills to victim", metadata: null, confidence: 0.8, x: 100, y: 300, createdAt: new Date() },
  { id: 5, caseId: 1, name: "Lisa Park", entityType: "person", role: "witness", description: "Hotel bartender, witnessed argument at 10 PM", metadata: null, confidence: 0.95, x: 600, y: 100, createdAt: new Date() },
  { id: 6, caseId: 1, name: "David Kim", entityType: "person", role: "witness", description: "Hotel security guard, saw suspect leave at 9:45 PM", metadata: null, confidence: 0.9, x: 400, y: 100, createdAt: new Date() },
  { id: 7, caseId: 1, name: "Amanda Foster", entityType: "person", role: "witness", description: "Victim's neighbor on floor 15, heard loud voices", metadata: null, confidence: 0.75, x: 800, y: 300, createdAt: new Date() },
  { id: 8, caseId: 1, name: "Dr. James Harper", entityType: "person", role: "forensic_examiner", description: "Forensic pathologist, conducted autopsy", metadata: null, confidence: 1.0, x: 900, y: 500, createdAt: new Date() },
  { id: 9, caseId: 1, name: "Grand Vista Hotel", entityType: "location", role: "crime_scene", description: "Luxury hotel on Las Vegas Strip, penthouse suite 1502", metadata: null, confidence: 1.0, x: 500, y: 500, createdAt: new Date() },
  { id: 10, caseId: 1, name: "Penthouse Suite 1502", entityType: "location", role: "crime_scene", description: "Victim's hotel room where body was found", metadata: null, confidence: 1.0, x: 500, y: 400, createdAt: new Date() },
  { id: 11, caseId: 1, name: "Skyline Bar", entityType: "location", role: "scene", description: "Hotel rooftop bar where argument occurred", metadata: null, confidence: 0.95, x: 650, y: 50, createdAt: new Date() },
  { id: 12, caseId: 1, name: "Underground Pharmacy", entityType: "location", role: "supplier_location", description: "Illegal pill supplier location on Fremont St", metadata: null, confidence: 0.7, x: 50, y: 200, createdAt: new Date() },
  { id: 13, caseId: 1, name: "Empty Pill Bottle", entityType: "object", role: "evidence", description: "Prescription bottle with victim's fingerprints, no label", metadata: null, confidence: 0.95, x: 450, y: 350, createdAt: new Date() },
  { id: 14, caseId: 1, name: "Whiskey Glass", entityType: "object", role: "evidence", description: "Glass with suspect Mike Ross's fingerprints and victim's DNA", metadata: null, confidence: 0.9, x: 550, y: 350, createdAt: new Date() },
  { id: 15, caseId: 1, name: "Smartphone", entityType: "object", role: "evidence", description: "Victim's phone, last call to Mike Ross at 9:30 PM", metadata: null, confidence: 0.95, x: 350, y: 250, createdAt: new Date() },
  { id: 16, caseId: 1, name: "CCTV Recording", entityType: "object", role: "evidence", description: "Lobby footage showing 4 people entering elevator at 8 PM", metadata: null, confidence: 0.9, x: 500, y: 600, createdAt: new Date() },
  { id: 17, caseId: 1, name: "Fentanyl", entityType: "drug", role: "cause_of_death", description: "Toxicology report: lethal dose of fentanyl detected", metadata: null, confidence: 0.98, x: 350, y: 450, createdAt: new Date() },
  { id: 18, caseId: 1, name: "Black SUV", entityType: "vehicle", role: "suspect_vehicle", description: "Seen on hotel parking camera, registered to Mike Ross", metadata: null, confidence: 0.85, x: 200, y: 50, createdAt: new Date() },
];

export const mockEvidence: EvidenceItem[] = [
  { id: 1, caseId: 1, title: "CCTV: Lobby Entry", description: "Security footage shows John Doe entering the hotel lobby at 7:45 PM with three individuals: Mike Ross, Elena Vasquez, and an unidentified male. They proceed to the elevator bank and ascend to the penthouse floor.", evidenceType: "cctv", source: "Grand Vista Hotel Security", confidence: 0.95, timestamp: "2024-01-15 19:45:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 2, caseId: 1, title: "Phone Records: Final Call", description: "Victim's smartphone shows outgoing call to Mike Ross at 9:30 PM lasting 4 minutes and 23 seconds. Location data confirms call originated from penthouse suite. No further calls or texts after this time.", evidenceType: "digital", source: "AT&T Wireless", confidence: 0.98, timestamp: "2024-01-15 21:30:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 3, caseId: 1, title: "Witness Statement: Bartender Lisa Park", description: "Lisa Park (bartender, Skyline Bar) states: 'John and the woman with dark hair were arguing loudly around 10 PM. She was crying and saying something like you ruined everything. He tried to calm her down. They left the bar separately around 10:15 PM.'", evidenceType: "statement", source: "Lisa Park", confidence: 0.85, timestamp: "2024-01-15 22:00:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 4, caseId: 1, title: "Witness Statement: Security Guard David Kim", description: "David Kim (security) states: 'I saw Mike Ross leave through the service entrance at approximately 9:45 PM. He looked agitated and was checking his phone repeatedly. I remember because he's a regular and usually exits through the main lobby.'", evidenceType: "statement", source: "David Kim", confidence: 0.9, timestamp: "2024-01-15 21:45:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 5, caseId: 1, title: "Witness Statement: Neighbor Amanda Foster", description: "Amanda Foster (room 1504) states: 'I heard loud voices from next door around 9:15 PM. A man was shouting about money. Then it got quiet. I didn't hear anything after that, so I didn't think to call security.'", evidenceType: "statement", source: "Amanda Foster", confidence: 0.75, timestamp: "2024-01-15 21:15:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 6, caseId: 1, title: "Forensic Report: Toxicology", description: "Autopsy reveals lethal concentration of fentanyl (28 ng/mL) in victim's bloodstream. Death occurred between 10:00 PM and 11:00 PM. No defensive wounds. Empty pill bottle found on nightstand bears victim's fingerprints only. No prescription label present.", evidenceType: "forensic", source: "Clark County Coroner's Office", confidence: 0.98, timestamp: "2024-01-16 14:00:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 7, caseId: 1, title: "Physical Evidence: Whiskey Glass", description: "Crystal tumbler on desk contains residue of premium whiskey. Latent fingerprints match Mike Ross (index finger, thumb). Lip print analysis confirms DNA matching John Doe. Glass appears to have been recently washed and placed back.", evidenceType: "physical", source: "LVMPD Crime Lab", confidence: 0.92, timestamp: "2024-01-15 20:30:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 8, caseId: 1, title: "Financial Records: Debt Owed", description: "Bank records show Mike Ross owed John Doe $250,000 from a failed cryptocurrency venture. A promissory note dated November 2023 shows repayment was due January 1, 2024. No payments were made. Mike's bank account shows only $12,400 balance.", evidenceType: "document", source: "Chase Bank / Victim's Records", confidence: 0.95, timestamp: "2024-01-10 00:00:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 9, caseId: 1, title: "Digital Evidence: Text Messages", description: "Recovered texts between victim and Elena Vasquez show deteriorating relationship. Elena: 'I know what you did. You can't hide forever.' Victim: 'Please, I can explain everything. Meet me at the hotel.' Last text from Elena: 'I'm coming. This ends tonight.'", evidenceType: "digital", source: "Victim's Smartphone", confidence: 0.9, timestamp: "2024-01-15 18:30:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 10, caseId: 1, title: "CCTV: Parking Garage", description: "Parking camera captures black SUV (license plate NV-4TR91, registered to Mike Ross) exiting the garage at 9:47 PM. Driver matches Mike's description. Vehicle was not seen re-entering.", evidenceType: "cctv", source: "Hotel Parking Security", confidence: 0.9, timestamp: "2024-01-15 21:47:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 11, caseId: 1, title: "Pharmacy Supplier Intelligence", description: "Undercover informant confirms Marcus Webb supplied fentanyl-laced pills to at least 5 individuals in the past 3 months. Webb was seen at the Grand Vista Hotel on the evening of January 15th by two independent witnesses. Known associate of organized crime figures.", evidenceType: "document", source: "DEA Las Vegas Field Office", confidence: 0.75, timestamp: "2024-01-20 10:00:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
  { id: 12, caseId: 1, title: "Crime Scene Photos", description: "Photographs of penthouse suite 1502 show victim on bed in apparent rest position. No signs of forced entry or struggle. Room service tray with two whiskey glasses. Empty pill bottle on nightstand. Room temperature set to 65°F.", evidenceType: "photo", source: "Crime Scene Photographer", confidence: 0.95, timestamp: "2024-01-16 07:30:00", fileUrl: null, metadata: null, extractedEntities: null, createdAt: new Date() },
];

export const mockRelationships: Relationship[] = [
  { id: 1, caseId: 1, sourceId: 1, targetId: 2, relationType: "business_partner", description: "Co-investors in failed crypto venture, $250K debt owed", evidenceId: 8, confidence: 0.95, timestamp: "2023-11-01", createdAt: new Date() },
  { id: 2, caseId: 1, sourceId: 1, targetId: 3, relationType: "ex_partner", description: "Former romantic relationship, ended under contentious circumstances", evidenceId: 9, confidence: 0.9, timestamp: "2024-01-15", createdAt: new Date() },
  { id: 3, caseId: 1, sourceId: 1, targetId: 4, relationType: "supplier", description: "Webb supplied drugs to victim", evidenceId: 11, confidence: 0.75, timestamp: "2024-01", createdAt: new Date() },
  { id: 4, caseId: 1, sourceId: 2, targetId: 1, relationType: "owed_money", description: "Mike owed John $250,000", evidenceId: 8, confidence: 0.95, timestamp: "2024-01-10", createdAt: new Date() },
  { id: 5, caseId: 1, sourceId: 3, targetId: 1, relationType: "argued_with", description: "Witnessed loud argument at Skyline Bar", evidenceId: 3, confidence: 0.85, timestamp: "2024-01-15 22:00", createdAt: new Date() },
  { id: 6, caseId: 1, sourceId: 2, targetId: 1, relationType: "called", description: "Last phone call to victim, 9:30 PM", evidenceId: 2, confidence: 0.98, timestamp: "2024-01-15 21:30", createdAt: new Date() },
  { id: 7, caseId: 1, sourceId: 2, targetId: 9, relationType: "visited", description: "Seen leaving hotel at 9:45 PM", evidenceId: 4, confidence: 0.9, timestamp: "2024-01-15 21:45", createdAt: new Date() },
  { id: 8, caseId: 1, sourceId: 1, targetId: 9, relationType: "found_at", description: "Victim discovered in penthouse suite", evidenceId: 12, confidence: 1.0, timestamp: "2024-01-16 06:47", createdAt: new Date() },
  { id: 9, caseId: 1, sourceId: 1, targetId: 10, relationType: "discovered_in", description: "Body found in room 1502", evidenceId: 12, confidence: 1.0, timestamp: "2024-01-16 06:47", createdAt: new Date() },
  { id: 10, caseId: 1, sourceId: 13, targetId: 1, relationType: "belonged_to", description: "Bears victim's fingerprints only", evidenceId: 6, confidence: 0.95, timestamp: "2024-01-16", createdAt: new Date() },
  { id: 11, caseId: 1, sourceId: 17, targetId: 1, relationType: "caused_death", description: "Lethal dose found in toxicology report", evidenceId: 6, confidence: 0.98, timestamp: "2024-01-16", createdAt: new Date() },
  { id: 12, caseId: 1, sourceId: 14, targetId: 2, relationType: "has_fingerprints_of", description: "Mike's fingerprints on glass found at scene", evidenceId: 7, confidence: 0.92, timestamp: "2024-01-16", createdAt: new Date() },
  { id: 13, caseId: 1, sourceId: 14, targetId: 1, relationType: "has_dna_of", description: "Victim's DNA on lip print of glass", evidenceId: 7, confidence: 0.9, timestamp: "2024-01-16", createdAt: new Date() },
  { id: 14, caseId: 1, sourceId: 15, targetId: 2, relationType: "last_called", description: "Final call made to Mike Ross at 9:30 PM", evidenceId: 2, confidence: 0.98, timestamp: "2024-01-15 21:30", createdAt: new Date() },
  { id: 15, caseId: 1, sourceId: 16, targetId: 1, relationType: "captures", description: "Shows victim entering with 3 people at 8 PM", evidenceId: 1, confidence: 0.95, timestamp: "2024-01-15 19:45", createdAt: new Date() },
  { id: 16, caseId: 1, sourceId: 18, targetId: 2, relationType: "registered_to", description: "Vehicle registered to Mike Ross", evidenceId: 10, confidence: 0.95, timestamp: "2024-01-15 21:47", createdAt: new Date() },
  { id: 17, caseId: 1, sourceId: 4, targetId: 17, relationType: "supplied", description: "Known supplier of fentanyl-laced pills", evidenceId: 11, confidence: 0.8, timestamp: "2024-01", createdAt: new Date() },
  { id: 18, caseId: 1, sourceId: 3, targetId: 11, relationType: "seen_at", description: "Witnessed arguing with victim at bar", evidenceId: 3, confidence: 0.85, timestamp: "2024-01-15 22:00", createdAt: new Date() },
  { id: 19, caseId: 1, sourceId: 7, targetId: 1, relationType: "heard", description: "Heard shouting from victim's room at 9:15 PM", evidenceId: 5, confidence: 0.75, timestamp: "2024-01-15 21:15", createdAt: new Date() },
];

export const mockContradictions: Contradiction[] = [
  { id: 1, caseId: 1, evidenceAId: 3, evidenceBId: 4, entityId: 2, description: "TIMELINE CONFLICT: Lisa Park states Elena and John left the bar at 10:15 PM. David Kim states Mike Ross left the hotel at 9:45 PM. If Mike left at 9:45, how could he have been present for the argument Lisa witnessed at 10 PM? Or was the argument with Elena, not Mike?", severity: "critical", status: "open", suggestedFollowUp: "Re-interview Lisa Park: clarify WHO was arguing with John. Re-interview David Kim: confirm exact time Mike Ross was seen leaving. Cross-reference CCTV from service entrance.", resolution: null, createdAt: new Date() },
  { id: 2, caseId: 1, evidenceAId: 5, evidenceBId: 2, entityId: 1, description: "AUDIO CONFLICT: Amanda Foster heard loud male voices arguing at 9:15 PM about money. Phone records show John's last call to Mike was at 9:30 PM — a 4-minute call. Was the argument at 9:15 with someone else (perhaps in person)? Or is Amanda's time estimate incorrect?", severity: "moderate", status: "open", suggestedFollowUp: "Check if Amanda Foster's room has a clock visible. Ask if she checked the time or is estimating. Investigate who else was in the room at 9:15 PM if Mike was only on phone at 9:30.", resolution: null, createdAt: new Date() },
  { id: 3, caseId: 1, evidenceAId: 6, evidenceBId: 3, entityId: 1, description: "BEHAVIOR CONFLICT: Toxicology shows lethal fentanyl dose causing death 10-11 PM. Lisa Park saw John at the bar at 10 PM arguing — a person with lethal fentanyl in their system would be severely impaired, not coherent enough to argue. This suggests either: (1) time of death is wrong, (2) fentanyl was administered AFTER the bar, or (3) Lisa's time is incorrect.", severity: "critical", status: "open", suggestedFollowUp: "Re-examine toxicology: could fentanyl have been absorbed slowly? Verify bar receipts for exact time John and Elena were there. Review CCTV from bar area.", resolution: null, createdAt: new Date() },
];

export const mockCogneeLogs: CogneeLog[] = [
  { id: 1, caseId: 1, operation: "remember", query: "Ingest CCTV footage: Lobby entry 7:45 PM", result: "Stored with 95% confidence. Extracted entities: John Doe, Mike Ross, Elena Vasquez, Unidentified Male. Location: Grand Vista Hotel Lobby.", confidence: 0.95, processingTime: 1200, createdAt: new Date() },
  { id: 2, caseId: 1, operation: "remember", query: "Ingest phone records: Last call to Mike Ross 9:30 PM", result: "Stored with 98% confidence. Extracted temporal entity: 9:30 PM. Relationship: John Doe called Mike Ross.", confidence: 0.98, processingTime: 800, createdAt: new Date() },
  { id: 3, caseId: 1, operation: "remember", query: "Ingest 3 witness statements + forensic report", result: "Stored 5 evidence items. Extracted 8 entities. Built relationship graph with 19 connections.", confidence: 0.92, processingTime: 3400, createdAt: new Date() },
  { id: 4, caseId: 1, operation: "recall", query: "Who was last with the victim?", result: "Multi-hop path found: John Doe → Penthouse Suite → Whiskey Glass (Mike's fingerprints) + Phone Call (Mike, 9:30 PM). Mike Ross is the strongest candidate.", confidence: 0.88, processingTime: 2100, createdAt: new Date() },
  { id: 5, caseId: 1, operation: "recall", query: "Find connections between all suspects", result: "Mike Ross: financial motive ($250K debt). Elena Vasquez: personal motive (ended relationship). Marcus Webb: supplier connection. No direct link between Elena and Marcus found.", confidence: 0.82, processingTime: 2800, createdAt: new Date() },
  { id: 6, caseId: 1, operation: "improve", query: "Detect contradictions across all evidence", result: "Found 3 critical contradictions. Confidence scores updated: Lisa Park statement reduced 0.95→0.85. Amanda Foster reduced 0.85→0.75. Added 3 contradiction nodes to graph.", confidence: 0.9, processingTime: 4500, createdAt: new Date() },
];

export const mockQueries: InvestigationQuery[] = [
  { id: 1, caseId: 1, query: "Who was the last person to see John Doe alive?", response: "Based on the evidence graph, **Mike Ross** is the most likely last person to see John Doe alive. The reasoning path is:\n\n1. **Phone Call** at 9:30 PM — Last outgoing call from John's phone to Mike (4 min 23 sec)\n2. **Whiskey Glass** — Found at scene with Mike's fingerprints AND John's DNA\n3. **Security Guard** — Saw Mike leave at 9:45 PM via service entrance\n\nHowever, there's a **timeline contradiction**: Bartender Lisa Park states she saw John arguing at 10 PM, which would be AFTER Mike left. This needs resolution.", reasoningPath: "John Doe → Phone Call → Mike Ross (9:30 PM) → Whiskey Glass (physical evidence) → Mike leaves hotel (9:45 PM)", confidence: 0.88, evidenceChain: "Phone Records: Final Call, Physical Evidence: Whiskey Glass, Witness Statement: Security Guard David Kim", processingTime: 2100, createdAt: new Date() },
  { id: 2, caseId: 1, query: "What connects Mike Ross to the crime scene?", response: "Mike Ross has **multiple connections** to the crime scene (Penthouse Suite 1502):\n\n1. **Financial motive**: Owed victim $250,000 (promissory note overdue)\n2. **Physical evidence**: His fingerprints on whiskey glass found at scene\n3. **Digital evidence**: Last phone call with victim at 9:30 PM\n4. **Witness sighting**: Seen leaving hotel via service entrance at 9:45 PM (unusual behavior)\n5. **Vehicle**: Black SUV captured exiting parking garage at 9:47 PM\n\n**Confidence Score: 92%** — Mike Ross is the primary suspect.", reasoningPath: "Mike Ross → owes $250K (motive) → fingerprints on glass (physical) → phone call 9:30 PM (digital) → leaves 9:45 PM (witness) → vehicle exits 9:47 PM (CCTV)", confidence: 0.92, evidenceChain: "Financial Records: Debt Owed, Physical Evidence: Whiskey Glass, Phone Records: Final Call, Witness Statement: Security Guard David Kim, CCTV: Parking Garage", processingTime: 3200, createdAt: new Date() },
  { id: 3, caseId: 1, query: "Find contradictions in witness statements", response: "I found **3 critical contradictions** in the evidence:\n\n**🔴 CRITICAL #1 — Timeline Gap:**\n- Lisa Park: Saw argument at 10 PM, John left bar at 10:15 PM\n- David Kim: Saw Mike Ross leave hotel at 9:45 PM\n- **Contradiction**: Mike cannot be at 10 PM argument if he left at 9:45 PM. Was the argument with Elena instead?\n\n**🟡 MODERATE #2 — Audio Timing:**\n- Amanda Foster: Heard argument at 9:15 PM\n- Phone records: Call to Mike at 9:30 PM\n- **Contradiction**: Who was arguing at 9:15 if Mike only called at 9:30?\n\n**🔴 CRITICAL #3 — Medical Impossibility:**\n- Toxicology: Lethal fentanyl dose, death 10-11 PM\n- Lisa Park: Saw John coherent and arguing at 10 PM\n- **Contradiction**: Person with lethal fentanyl dose would not be coherent enough to argue", reasoningPath: "Cross-reference all witness timestamps → Compare with digital evidence → Flag inconsistencies → Update confidence scores", confidence: 0.9, evidenceChain: "All witness statements + forensic report + phone records", processingTime: 4500, createdAt: new Date() },
  { id: 4, caseId: 1, query: "What's the murder weapon and where did it come from?", response: "The **murder weapon is fentanyl** administered via the empty pill bottle found at the scene.\n\n**Chain of custody analysis:**\n1. **Fentanyl source**: Marcus Webb (underground pharmacy supplier on Fremont St)\n2. **Distribution**: Webb supplied fentanyl-laced pills to multiple buyers\n3. **Delivery to victim**: Unknown intermediary — no direct evidence of Webb meeting John\n4. **Method**: Pills were in an unlabeled prescription bottle with only John's fingerprints\n\n**Key insight**: The absence of prescription label + victim's fingerprints ONLY suggests the bottle was planted to look like self-administration. A suicide would likely have a prescription label.\n\n**Confidence: 85%** — Strong evidence for foul play, but the direct supplier-to-victim transaction is unproven.", reasoningPath: "Empty Pill Bottle → Fentanyl (toxicology) → Marcus Webb (supplier) → Underground Pharmacy → Fremont St location", confidence: 0.85, evidenceChain: "Forensic Report: Toxicology, Empty Pill Bottle, Pharmacy Supplier Intelligence", processingTime: 3800, createdAt: new Date() },
];

export const mockStats: CaseStats = {
  evidenceCount: 12,
  entityCount: 18,
  relationshipCount: 19,
  contradictionCount: 3,
};

export const mockFullCaseData = {
  case: mockCase,
  evidence: mockEvidence,
  entities: mockEntities,
  relationships: mockRelationships,
  contradictions: mockContradictions,
  cogneeLogs: mockCogneeLogs,
  queries: mockQueries,
};
