import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["student", "teacher", "janitor", "admin"]);
export const houseEnum = pgEnum("house", ["green", "blue", "red", "yellow"]);
export const wasteTypeEnum = pgEnum("waste_type", [
  "stock_paper", "food_waste", "plastic_bottles", "plastic_cutlery", 
  "plastic_wrappers", "plastic_packets", "chart_paper", "disposable_cups",
  "pens", "paper_tissues"
]);
export const binStatusEnum = pgEnum("bin_status", ["normal", "overflowing", "wrong_usage"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  name: text("name").notNull(),
  classId: varchar("class_id").references(() => classes.id),
  house: houseEnum("house"),
});

export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // e.g., "10-A", "9-B"
  grade: integer("grade").notNull(),
  section: text("section").notNull(),
  house: houseEnum("house").notNull(),
  points: integer("points").notNull().default(0),
});

export const wasteEntries = pgTable("waste_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wasteType: wasteTypeEnum("waste_type").notNull(),
  quantity: integer("quantity").notNull(), // number of items
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(), // total weight in grams
  carbonFootprint: decimal("carbon_footprint", { precision: 10, scale: 2 }).notNull(), // in grams CO2
  classId: varchar("class_id").references(() => classes.id),
  reportedBy: varchar("reported_by").references(() => users.id),
  location: text("location"), // e.g., "Floor 2", "Canteen"
  properlySegregated: boolean("properly_segregated").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const binReports = pgTable("bin_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  status: binStatusEnum("status").notNull(),
  classId: varchar("class_id").references(() => classes.id),
  reportedBy: varchar("reported_by").references(() => users.id).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // "waste_report", "bin_status", "cleanup_drive"
  description: text("description").notNull(),
  points: integer("points").notNull().default(0),
  classId: varchar("class_id").references(() => classes.id),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  class: one(classes, {
    fields: [users.classId],
    references: [classes.id],
  }),
  wasteEntries: many(wasteEntries),
  binReports: many(binReports),
  activities: many(activities),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  users: many(users),
  wasteEntries: many(wasteEntries),
  binReports: many(binReports),
  activities: many(activities),
}));

export const wasteEntriesRelations = relations(wasteEntries, ({ one }) => ({
  class: one(classes, {
    fields: [wasteEntries.classId],
    references: [classes.id],
  }),
  reportedByUser: one(users, {
    fields: [wasteEntries.reportedBy],
    references: [users.id],
  }),
}));

export const binReportsRelations = relations(binReports, ({ one }) => ({
  class: one(classes, {
    fields: [binReports.classId],
    references: [classes.id],
  }),
  reportedByUser: one(users, {
    fields: [binReports.reportedBy],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  class: one(classes, {
    fields: [activities.classId],
    references: [classes.id],
  }),
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  points: true,
});

export const insertWasteEntrySchema = createInsertSchema(wasteEntries).omit({
  id: true,
  createdAt: true,
});

export const insertBinReportSchema = createInsertSchema(binReports).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type WasteEntry = typeof wasteEntries.$inferSelect;
export type InsertWasteEntry = z.infer<typeof insertWasteEntrySchema>;
export type BinReport = typeof binReports.$inferSelect;
export type InsertBinReport = z.infer<typeof insertBinReportSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
