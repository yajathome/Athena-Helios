import { 
  type User, type InsertUser, type Class, type InsertClass,
  type WasteEntry, type InsertWasteEntry, type BinReport, type InsertBinReport,
  type Activity, type InsertActivity
} from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  
  getClasses(): Promise<Class[]>;
  getClass(id: string): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClassPoints(classId: string, points: number): Promise<void>;

  
  createWasteEntry(entry: InsertWasteEntry): Promise<WasteEntry>;
  getWasteEntries(startDate?: Date, endDate?: Date): Promise<WasteEntry[]>;
  getWasteEntriesByClass(classId: string, startDate?: Date, endDate?: Date): Promise<WasteEntry[]>;
  getTodayWasteStats(): Promise<{
    totalWaste: number;
    recycled: number;
    carbonFootprint: number;
    wasteByType: Record<string, number>;
  }>;

  
  createBinReport(report: InsertBinReport): Promise<BinReport>;
  getBinReports(startDate?: Date, endDate?: Date): Promise<BinReport[]>;

  
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(limit?: number): Promise<Activity[]>;

  
  getClassLeaderboard(): Promise<Array<Class & { rank: number }>>;
  getWasteTrendsByGrade(): Promise<Record<number, number>>;
  getCarbonFootprintByWasteType(): Promise<Record<string, number>>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private classes: Class[] = [];
  private wasteEntries: WasteEntry[] = [];
  private binReports: BinReport[] = [];
  private activities: Activity[] = [];

  constructor() {
    
    this.initializeDefaultClasses();
  }

  private initializeDefaultClasses() {
    const defaultClasses = [
      { name: "X Fire", grade: 10, section: "A", house: "red" as const },
      { name: "X Water", grade: 10, section: "B", house: "blue" as const },
      { name: "X Air", grade: 10, section: "C", house: "green" as const },
      { name: "X Sky", grade: 10, section: "D", house: "blue" as const },
      { name: "X Light", grade: 10, section: "E", house: "yellow" as const },
    ];
    
    defaultClasses.forEach(classData => {
      const newClass: Class = {
        id: nanoid(),
        name: classData.name,
        grade: classData.grade,
        section: classData.section,
        house: classData.house,
        points: 0,
      };
      this.classes.push(newClass);
    });
  }
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: nanoid(),
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role,
      name: insertUser.name,
      house: insertUser.house,
      classId: insertUser.classId,
    };
    this.users.push(user);
    return user;
  }

  async getClasses(): Promise<Class[]> {
    return this.classes.sort((a, b) => a.grade - b.grade || a.section.localeCompare(b.section));
  }

  async getClass(id: string): Promise<Class | undefined> {
    return this.classes.find(cls => cls.id === id);
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const newClass: Class = {
      id: nanoid(),
      name: classData.name,
      grade: classData.grade,
      section: classData.section,
      house: classData.house,
      points: 0,
    };
    this.classes.push(newClass);
    return newClass;
  }

  calculateWastePoints(wasteType: string, weightInGrams: number, quantity: number): number {
    const wasteTypeMultipliers = {
      plastic_bottles: 8,      
      plastic_cutlery: 6,        
      plastic_wrappers: 4,     
      plastic_packets: 5,      
      
      
      stock_paper: 7,         
      chart_paper: 6,         
      paper_tissues: 3,       
      
      
      food_waste: 5,          
      
      
      disposable_cups: 4,  
      pens: 9,             
    };

    const multiplier = wasteTypeMultipliers[wasteType as keyof typeof wasteTypeMultipliers] || 3;
    
   
    
    const weightPoints = Math.sqrt(weightInGrams / 10); // sqrppt
    const quantityBonus = Math.min(quantity * 2, 20); // bonus
    const basePoints = (weightPoints + quantityBonus) * (multiplier / 5);
    
    return Math.max(3, Math.round(basePoints)); // min 3 points
  }

  async updateClassPoints(classId: string, points: number): Promise<void> {
    const classIndex = this.classes.findIndex(cls => cls.id === classId);
    if (classIndex !== -1) {
      this.classes[classIndex].points += points;
    }
  }

  async createWasteEntry(entry: InsertWasteEntry): Promise<WasteEntry> {
    const wasteEntry: WasteEntry = {
      id: nanoid(),
      wasteType: entry.wasteType,
      quantity: entry.quantity,
      weight: entry.weight,
      carbonFootprint: entry.carbonFootprint,
      classId: entry.classId || null,
      location: entry.location,
      properlySegregated: entry.properlySegregated,
      reportedBy: entry.reportedBy,
      createdAt: new Date(),
    };
    this.wasteEntries.push(wasteEntry);
    
   
    if (entry.properlySegregated && entry.classId) {
      const pointsAwarded = this.calculateWastePoints(entry.wasteType, parseFloat(entry.weight.toString()), entry.quantity);
      await this.updateClassPoints(entry.classId, pointsAwarded);
      
      await this.createActivity({
        type: "waste_report",
        description: `Properly segregated ${entry.quantity} ${entry.wasteType.replace('_', ' ')} items (+${pointsAwarded} points)`,
        points: pointsAwarded,
        classId: entry.classId,
        userId: entry.reportedBy,
      });
    }

    return wasteEntry;
  }

  async getWasteEntries(startDate?: Date, endDate?: Date): Promise<WasteEntry[]> {
    let entries = this.wasteEntries;
    
    if (startDate && endDate) {
      entries = entries.filter(entry => 
        entry.createdAt >= startDate && entry.createdAt <= endDate
      );
    }
    
    return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getWasteEntriesByClass(classId: string, startDate?: Date, endDate?: Date): Promise<WasteEntry[]> {
    let entries = this.wasteEntries.filter(entry => entry.classId === classId);
    
    if (startDate && endDate) {
      entries = entries.filter(entry => 
        entry.createdAt >= startDate && entry.createdAt <= endDate
      );
    }
    
    return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTodayWasteStats(): Promise<{
    totalWaste: number;
    recycled: number;
    carbonFootprint: number;
    wasteByType: Record<string, number>;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntries = await this.getWasteEntries(today, tomorrow);
    
    const totalWaste = todayEntries.reduce((sum, entry) => sum + parseFloat(entry.weight.toString()), 0);
    const recycled = todayEntries
      .filter(entry => entry.properlySegregated)
      .reduce((sum, entry) => sum + parseFloat(entry.weight.toString()), 0);
    const carbonFootprint = todayEntries.reduce((sum, entry) => sum + parseFloat(entry.carbonFootprint.toString()), 0);
    
    const wasteByType: Record<string, number> = {};
    todayEntries.forEach(entry => {
      wasteByType[entry.wasteType] = (wasteByType[entry.wasteType] || 0) + parseFloat(entry.weight.toString());
    });

    return {
      totalWaste: Math.round(totalWaste) / 1000, 
      recycled: Math.round(recycled) / 1000, 
      carbonFootprint: Math.round(carbonFootprint) / 1000, 
      wasteByType
    };
  }

  async createBinReport(report: InsertBinReport): Promise<BinReport> {
    const binReport: BinReport = {
      id: nanoid(),
      status: report.status,
      location: report.location,
      description: report.description || null,
      classId: report.classId || null,
      reportedBy: report.reportedBy,
      createdAt: new Date(),
    };
    this.binReports.push(binReport);
    
    if (report.classId && (report.status === "overflowing" || report.status === "wrong_usage")) {
      const pointsDeducted = report.status === "overflowing" ? -20 : -10;
      await this.updateClassPoints(report.classId, pointsDeducted);
      
      await this.createActivity({
        type: "bin_status",
        description: `Bin ${report.status.replace('_', ' ')} reported at ${report.location}`,
        points: pointsDeducted,
        classId: report.classId,
        userId: report.reportedBy,
      });
    }

    return binReport;
  }

  async getBinReports(startDate?: Date, endDate?: Date): Promise<BinReport[]> {
    let reports = this.binReports;
    
    if (startDate && endDate) {
      reports = reports.filter(report => 
        report.createdAt >= startDate && report.createdAt <= endDate
      );
    }
    
    return reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity: Activity = {
      id: nanoid(),
      type: activity.type,
      description: activity.description,
      points: activity.points || 0,
      classId: activity.classId || null,
      userId: activity.userId || null,
      createdAt: new Date(),
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return this.activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getClassLeaderboard(): Promise<Array<Class & { rank: number }>> {
    const sortedClasses = this.classes
      .sort((a, b) => b.points - a.points);
    
    return sortedClasses.map((cls, index) => ({
      ...cls,
      rank: index + 1
    }));
  }

  async getWasteTrendsByGrade(): Promise<Record<number, number>> {
    const trends: Record<number, number> = {};
    
    this.wasteEntries.forEach(entry => {
      const classData = this.classes.find(cls => cls.id === entry.classId);
      if (classData) {
        trends[classData.grade] = (trends[classData.grade] || 0) + parseFloat(entry.weight.toString());
      }
    });
    
    return trends;
  }

  async getCarbonFootprintByWasteType(): Promise<Record<string, number>> {
    const footprint: Record<string, number> = {};
    
    this.wasteEntries.forEach(entry => {
      footprint[entry.wasteType] = (footprint[entry.wasteType] || 0) + parseFloat(entry.carbonFootprint.toString());
    });
    
    return footprint;
  }
}

export const storage = new MemStorage();
