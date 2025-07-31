import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWasteEntrySchema, insertBinReportSchema, insertClassSchema } from "@shared/schema";
import { z } from "zod";

// ingrams
const WASTE_WEIGHTS = {
  stock_paper: 5,
  food_waste: 532,
  plastic_bottles: 25,
  plastic_cutlery: 50,
  plastic_wrappers: 10,
  plastic_packets: 20,
  chart_paper: 120,
  disposable_cups: 60,
  pens: 30,
  paper_tissues: 5,
};

// Carbon footprint multilplying algorithm
const CARBON_MULTIPLIERS = {
  stock_paper: 1.2,
  food_waste: 4.3,
  plastic_bottles: 6.0,
  plastic_cutlery: 6.0,
  plastic_wrappers: 6.0,
  plastic_packets: 6.0,
  chart_paper: 1.2,
  disposable_cups: 2.5,
  pens: 8.0,
  paper_tissues: 1.2,
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const stats = await storage.getTodayWasteStats();
      
      // algorithm calculat show during presentation
      const greenPoints = Math.floor(stats.recycled * 100) + Math.floor((stats.totalWaste - stats.recycled) * -50);
      
      res.json({
        ...stats,
        greenPoints: Math.max(0, greenPoints),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/activities", async (_req, res) => {
    try {
      const activities = await storage.getRecentActivities(20);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const leaderboard = await storage.getClassLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/classes", async (_req, res) => {
    try {
      const classes = await storage.getClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const classData = insertClassSchema.parse(req.body);
      const newClass = await storage.createClass(classData);
      res.json(newClass);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid class data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create class" });
      }
    }
  });

  app.post("/api/waste/report", async (req, res) => {
    try {
      const wasteData = req.body;
      
      // wegith adn footprint calc
      const unitWeight = WASTE_WEIGHTS[wasteData.wasteType as keyof typeof WASTE_WEIGHTS];
      const totalWeight = unitWeight * wasteData.quantity;
      const carbonFootprint = totalWeight * CARBON_MULTIPLIERS[wasteData.wasteType as keyof typeof CARBON_MULTIPLIERS];
      
      const wasteEntry = insertWasteEntrySchema.parse({
        ...wasteData,
        weight: totalWeight.toString(),
        carbonFootprint: carbonFootprint.toString(),
      });
      
      const newEntry = await storage.createWasteEntry(wasteEntry);
      res.json(newEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid waste entry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to report waste" });
      }
    }
  });

  
  app.post("/api/bins/report", async (req, res) => {
    try {
      const binReport = insertBinReportSchema.parse(req.body);
      const newReport = await storage.createBinReport(binReport);
      res.json(newReport);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid bin report data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to report bin status" });
      }
    }
  });

  app.get("/api/analytics/waste-trends", async (_req, res) => {
    try {
      const trends = await storage.getWasteTrendsByGrade();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch waste trends" });
    }
  });

  
  app.get("/api/analytics/carbon-footprint", async (_req, res) => {
    try {
      const footprint = await storage.getCarbonFootprintByWasteType();
      res.json(footprint);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch carbon footprint data" });
    }
  });

  
  app.get("/api/waste", async (req, res) => {
    try {
      const { startDate, endDate, classId } = req.query;
      
      let entries;
      if (classId) {
        entries = await storage.getWasteEntriesByClass(
          classId as string,
          startDate ? new Date(startDate as string) : undefined,
          endDate ? new Date(endDate as string) : undefined
        );
      } else {
        entries = await storage.getWasteEntries(
          startDate ? new Date(startDate as string) : undefined,
          endDate ? new Date(endDate as string) : undefined
        );
      }
      
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch waste entries" });
    }
  });

  
  app.get("/api/bins", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const reports = await storage.getBinReports(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bin reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
