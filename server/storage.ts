import { 
  users, 
  vulnerabilities, 
  analysisResults, 
  type User, 
  type InsertUser, 
  type Vulnerability, 
  type InsertVulnerability,
  type AnalysisResult,
  type InsertAnalysisResult
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vulnerability methods
  createVulnerability(vulnerability: InsertVulnerability): Promise<Vulnerability>;
  
  // Analysis Result methods
  saveAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResult(id: number): Promise<AnalysisResult | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vulns: Map<number, Vulnerability>;
  private analyses: Map<number, AnalysisResult>;
  currentUserId: number;
  currentVulnId: number;
  currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.vulns = new Map();
    this.analyses = new Map();
    this.currentUserId = 1;
    this.currentVulnId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createVulnerability(insertVulnerability: InsertVulnerability): Promise<Vulnerability> {
    const id = this.currentVulnId++;
    const vulnerability: Vulnerability = { ...insertVulnerability, id };
    this.vulns.set(id, vulnerability);
    return vulnerability;
  }
  
  async saveAnalysisResult(insertAnalysisResult: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = this.currentAnalysisId++;
    const analysisResult: AnalysisResult = { ...insertAnalysisResult, id };
    this.analyses.set(id, analysisResult);
    return analysisResult;
  }
  
  async getAnalysisResult(id: number): Promise<AnalysisResult | undefined> {
    return this.analyses.get(id);
  }
}

export const storage = new MemStorage();
