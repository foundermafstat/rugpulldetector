import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the vulnerability schema
export const vulnerabilities = pgTable("vulnerabilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // backdoor, privileged, tokenomics, phishing, approvals, 2fa, mev, multisig
  severity: text("severity").notNull(), // critical, high, medium, low
  lineStart: integer("line_start").notNull(),
  lineEnd: integer("line_end").notNull(),
  impact: text("impact").notNull(),
  recommendations: text("recommendations").notNull(),
});

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities).omit({
  id: true
});

export type InsertVulnerability = z.infer<typeof insertVulnerabilitySchema>;
export type Vulnerability = typeof vulnerabilities.$inferSelect;

// Define the contract analysis results schema
export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  contractName: text("contract_name").notNull(),
  contractCode: text("contract_code").notNull(),
  criticalCount: integer("critical_count").notNull(),
  highCount: integer("high_count").notNull(),
  mediumCount: integer("medium_count").notNull(),
  lowCount: integer("low_count").notNull(),
  overallRisk: text("overall_risk").notNull(), // high, medium, low
  scanTime: timestamp("scan_time").notNull(),
  scanDuration: integer("scan_duration").notNull(), // in milliseconds
  vulnerabilities: json("vulnerabilities").notNull().$type<Vulnerability[]>(),
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true
});

export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;

// Define the contract input schema for validation
export const contractInputSchema = z.object({
  contractCode: z.string().min(1, "Contract code is required"),
  contractName: z.string().optional(),
  contractAddress: z.string().optional(),
  options: z.object({
    detectBackdoors: z.boolean().default(true),
    detectPrivileged: z.boolean().default(true),
    detectTokenomics: z.boolean().default(true),
    detectPhishing: z.boolean().default(true),
    detectApprovals: z.boolean().default(true),
    detect2FA: z.boolean().default(true),
    detectMEV: z.boolean().default(true),
    detectMultisig: z.boolean().default(true),
    deepScan: z.boolean().default(false)
  }).optional()
});

export type ContractInput = z.infer<typeof contractInputSchema>;
