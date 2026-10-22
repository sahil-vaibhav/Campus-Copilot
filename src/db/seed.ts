import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import * as schema from "./schema.ts";

// Load .env manually if not already populated in process.env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key] && value) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

export const DEFAULT_USERS = [
  {
    name: "Campus Administrator",
    email: "admin@silveroak.edu",
    password: "AdminPassword123!",
    role: "admin" as const,
  },
  {
    name: "Sahil Vaibhav",
    email: "sahil.v@silveroak.edu",
    password: "StudentPassword123!",
    role: "student" as const,
  },
  {
    name: "Jane Doe",
    email: "student@silveroak.edu",
    password: "StudentPassword123!",
    role: "student" as const,
  },
  {
    name: "Dr. A. Sharma",
    email: "asharma@silveroak.edu",
    password: "FacultyPassword123!",
    role: "faculty" as const,
  },
  {
    name: "Prof. N. Patel",
    email: "npatel@silveroak.edu",
    password: "FacultyPassword123!",
    role: "faculty" as const,
  },
];

export const DEFAULT_NOTICES = [
  {
    title: "Mid-Semester Examination Schedule",
    content: "Mid-Semester Examinations commence from Monday at 09:00 AM. Please verify your examination room allocation and seat numbers on the department bulletin board. Bring your student ID card to every session.",
    type: "Examination",
    isImportant: true,
  },
  {
    title: "Campus Placement Drive: TechCorp",
    content: "TechCorp campus recruitment drive is scheduled for final and pre-final year students. Online coding round begins this Friday at 10:00 AM in Lab 1 & 2. Register on the placement portal by tomorrow 5:00 PM.",
    type: "Placement",
    isImportant: true,
  },
  {
    title: "Annual Tech Fest 'HackSilver 2026' Registrations Open",
    content: "Registrations are now open for HackSilver 2026! Events include 24-hour Hackathon, Robowar, Web3 sprints, and competitive coding. Exciting cash prizes and internship opportunities await top teams.",
    type: "Events",
    isImportant: false,
  },
  {
    title: "Library Book Return Deadline",
    content: "All books issued before the mid-term break must be renewed or returned to the central library before the end of the month to avoid overdue charges.",
    type: "Academic",
    isImportant: false,
  },
  {
    title: "Scholarship Renewal Applications",
    content: "Applications for merit and need-based scholarship renewals for the upcoming semester are now open. Submit completed forms along with marksheets to the Student Affairs desk by Oct 30.",
    type: "General",
    isImportant: false,
  },
  {
    title: "CSE Department Project Review Calendar",
    content: "Capstone project preliminary review for 6th and 8th semester Computer Science students will be held next Tuesday in the Innovation Hub. Prepare your slides and prototype demo.",
    type: "Academic",
    isImportant: false,
  },
  {
    title: "Emergency Contact Information Update",
    content: "All registered students and faculty members are requested to review and update their emergency contact details and blood group records on the student portal.",
    type: "Emergency",
    isImportant: true,
  },
];

export const DEFAULT_TIMETABLE = [
  { day: "Monday", subject: "Data Structures", time: "09:00 AM", endTime: "10:00 AM", room: "Room 302", type: "Lecture" },
  { day: "Monday", subject: "Database Management", time: "11:00 AM", endTime: "12:00 PM", room: "Lab 4", type: "Lab" },
  { day: "Monday", subject: "Computer Networks", time: "02:00 PM", endTime: "03:00 PM", room: "Room 305", type: "Lecture" },
  { day: "Tuesday", subject: "Operating Systems", time: "10:00 AM", endTime: "11:00 AM", room: "Room 204", type: "Lecture" },
  { day: "Tuesday", subject: "Computer Networks Lab", time: "12:00 PM", endTime: "01:00 PM", room: "Lab 2", type: "Lab" },
  { day: "Tuesday", subject: "Software Engineering", time: "03:00 PM", endTime: "04:00 PM", room: "Room 301", type: "Lecture" },
  { day: "Wednesday", subject: "Artificial Intelligence", time: "09:00 AM", endTime: "10:00 AM", room: "Room 410", type: "Lecture" },
  { day: "Wednesday", subject: "Database Management", time: "11:00 AM", endTime: "12:00 PM", room: "Room 202", type: "Lecture" },
  { day: "Wednesday", subject: "Operating Systems Lab", time: "02:00 PM", endTime: "04:00 PM", room: "Lab 3", type: "Lab" },
  { day: "Thursday", subject: "Data Structures", time: "10:00 AM", endTime: "11:00 AM", room: "Room 302", type: "Lecture" },
  { day: "Thursday", subject: "Software Engineering", time: "12:00 PM", endTime: "01:00 PM", room: "Room 301", type: "Lecture" },
  { day: "Thursday", subject: "Computer Networks", time: "03:00 PM", endTime: "04:00 PM", room: "Room 305", type: "Lecture" },
  { day: "Friday", subject: "Artificial Intelligence", time: "09:00 AM", endTime: "10:00 AM", room: "Room 410", type: "Lecture" },
  { day: "Friday", subject: "Computer Networks Lab", time: "11:00 AM", endTime: "01:00 PM", room: "Lab 2", type: "Lab" },
  { day: "Friday", subject: "Project Studio", time: "02:00 PM", endTime: "04:00 PM", room: "Innovation Hub", type: "Workshop" },
  { day: "Saturday", subject: "Competitive Programming", time: "09:30 AM", endTime: "11:30 AM", room: "Lab 1", type: "Workshop" },
  { day: "Saturday", subject: "Open Source Project Studio", time: "12:00 PM", endTime: "02:00 PM", room: "Innovation Hub", type: "Lab" },
];

export const DEFAULT_LIBRARY_BOOKS = [
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", category: "Computer Science", available: true, returnDate: null },
  { title: "Database System Concepts", author: "Abraham Silberschatz", category: "Computer Science", available: false, returnDate: "Oct 20" },
  { title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", available: true, returnDate: null },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Computer Science", available: true, returnDate: null },
  { title: "Design Patterns", author: "Erich Gamma", category: "Software Engineering", available: true, returnDate: null },
  { title: "Computer Networking: A Top-Down Approach", author: "James Kurose", category: "Computer Networks", available: false, returnDate: "Oct 24" },
  { title: "Operating System Concepts", author: "Abraham Silberschatz", category: "Computer Science", available: true, returnDate: null },
  { title: "The Pragmatic Programmer", author: "David Thomas", category: "Software Engineering", available: true, returnDate: null },
  { title: "Deep Learning", author: "Ian Goodfellow", category: "Artificial Intelligence", available: true, returnDate: null },
  { title: "Computer Organization", author: "David Patterson", category: "Computer Science", available: true, returnDate: null },
  { title: "Discrete Mathematics", author: "Kenneth Rosen", category: "Mathematics", available: true, returnDate: null },
  { title: "Effective TypeScript", author: "Dan Vanderkam", category: "Software Engineering", available: false, returnDate: "Oct 26" },
];

async function seedSupabaseAuth() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.log("ℹ️  VITE_SUPABASE_URL not configured. Skipping Supabase Auth seeding.");
    return;
  }

  if (serviceRoleKey) {
    console.log("🔑 Seeding Supabase Auth users using admin service role...");
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    for (const u of DEFAULT_USERS) {
      try {
        const { error } = await adminClient.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: {
            full_name: u.name,
            role: u.role,
          },
          app_metadata: {
            role: u.role,
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("exists")) {
            console.log(`   ✓ Auth user already exists: ${u.email} (${u.role})`);
          } else {
            console.warn(`   ⚠️  Could not create auth user ${u.email}:`, error.message);
          }
        } else {
          console.log(`   ✓ Created auth user: ${u.email} (${u.role})`);
        }
      } catch (err: any) {
        console.warn(`   ⚠️  Error creating user ${u.email}:`, err?.message || err);
      }
    }
  } else if (anonKey) {
    console.log("ℹ️  SUPABASE_SERVICE_ROLE_KEY not found; attempting sign-up via public anon key...");
    const client = createClient(supabaseUrl, anonKey);
    for (const u of DEFAULT_USERS) {
      try {
        const { error } = await client.auth.signUp({
          email: u.email,
          password: u.password,
          options: {
            data: {
              full_name: u.name,
              role: u.role,
            },
          },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("exists")) {
            console.log(`   ✓ Auth user exists or registered: ${u.email}`);
          } else {
            console.log(`   ℹ️  Auth note for ${u.email}: ${error.message}`);
          }
        } else {
          console.log(`   ✓ Registered auth user: ${u.email}`);
        }
      } catch (err: any) {
        console.warn(`   ⚠️  Sign-up skipped for ${u.email}:`, err?.message || err);
      }
    }
  }
}

async function seedPostgresDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes("your-password") || databaseUrl.startsWith("https://")) {
    console.log("\n⚠️  DATABASE_URL is not set to a valid PostgreSQL connection string in .env.");
    console.log("   Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres");
    console.log("   (Or use the pooler string from Supabase Project Settings > Database).");
    console.log("   💡 Tip: You can also run 'supabase/seed.sql' directly in the Supabase SQL Editor!\n");
    return;
  }

  console.log("\n📦 Connecting to PostgreSQL via Drizzle ORM to seed database tables...");
  const sql = postgres(databaseUrl, { max: 1 });
  const db = drizzle(sql, { schema });

  try {
    // 1. Seed Users
    console.log("   Seeding users table...");
    for (const u of DEFAULT_USERS) {
      await db
        .insert(schema.users)
        .values({
          name: u.name,
          email: u.email,
          role: u.role,
        })
        .onConflictDoNothing({ target: schema.users.email });
    }
    console.log(`   ✓ ${DEFAULT_USERS.length} users verified in database`);

    // Fetch user IDs for feedback foreign keys
    const insertedUsers = await db.select().from(schema.users);
    const studentUser = insertedUsers.find((u) => u.email === "sahil.v@silveroak.edu") || insertedUsers[0];

    // 2. Seed Notices
    console.log("   Seeding notices table...");
    for (const n of DEFAULT_NOTICES) {
      await db.insert(schema.notices).values(n);
    }
    console.log(`   ✓ ${DEFAULT_NOTICES.length} notices inserted`);

    // 3. Seed Timetable
    console.log("   Seeding timetable table...");
    for (const t of DEFAULT_TIMETABLE) {
      await db.insert(schema.timetable).values(t);
    }
    console.log(`   ✓ ${DEFAULT_TIMETABLE.length} timetable sessions inserted`);

    // 4. Seed Library Books
    console.log("   Seeding library books table...");
    for (const b of DEFAULT_LIBRARY_BOOKS) {
      await db.insert(schema.libraryBooks).values(b);
    }
    console.log(`   ✓ ${DEFAULT_LIBRARY_BOOKS.length} library books inserted`);

    // 5. Seed Initial Feedback
    console.log("   Seeding feedback table...");
    if (studentUser) {
      await db.insert(schema.feedback).values([
        {
          userId: studentUser.id,
          category: "Facilities",
          description: "Projector in Room 302 flickers occasionally during morning lectures.",
          priority: "Low",
          status: "In Review",
        },
        {
          userId: studentUser.id,
          category: "Academics",
          description: "Request for additional reference textbooks for Distributed Systems in the central library.",
          priority: "Medium",
          status: "Resolved",
        },
      ]);
      console.log("   ✓ Sample feedback records inserted");
    }

    console.log("🎉 Database tables successfully seeded!");
  } catch (err: any) {
    console.error("❌ Error seeding database:", err?.message || err);
  } finally {
    await sql.end();
  }
}

function printSummary() {
  console.log("\n=======================================================");
  console.log(" 🎓 CAMPUS COPILOT — DEFAULT USER LOGIN CREDENTIALS");
  console.log("=======================================================");
  console.table(
    DEFAULT_USERS.map((u) => ({
      Role: u.role.toUpperCase(),
      Name: u.name,
      Email: u.email,
      Password: u.password,
    }))
  );
  console.log("=======================================================");
  console.log("💡 Notes:");
  console.log(" • Demo Mode (No Supabase): Any valid email + password (min 6 chars) logs in.");
  console.log("   Use 'admin@silveroak.edu' to access the Admin Portal directly.");
  console.log(" • Supabase Mode: Use the default credentials above once seeded or created.");
  console.log("=======================================================\n");
}

async function main() {
  console.log("\n🌱 Starting Campus Copilot Database Seeding...\n");
  await seedSupabaseAuth();
  await seedPostgresDatabase();
  printSummary();
}

void main();
