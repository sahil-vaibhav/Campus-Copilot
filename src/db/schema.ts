import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("student"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  isImportant: boolean("is_important").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  category: text("category").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("Medium"),
  status: text("status").default("Submitted"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timetable = pgTable("timetable", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(),
  subject: text("subject").notNull(),
  time: text("time").notNull(),
  endTime: text("end_time").notNull(),
  room: text("room").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const libraryBooks = pgTable("library_books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  available: boolean("available").default(true),
  returnDate: text("return_date"),
  createdAt: timestamp("created_at").defaultNow(),
});
