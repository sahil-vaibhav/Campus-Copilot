-- ==============================================================================
-- Campus Copilot Database Seed Script
-- Compatible with Supabase CLI ('supabase db reset') and Supabase SQL Editor
-- ==============================================================================

-- 1. Seed Users
INSERT INTO "public"."users" ("name", "email", "role")
VALUES
  ('Campus Administrator', 'admin@silveroak.edu', 'admin'),
  ('Sahil Vaibhav', 'sahil.v@silveroak.edu', 'student'),
  ('Jane Doe', 'student@silveroak.edu', 'student'),
  ('Dr. A. Sharma', 'asharma@silveroak.edu', 'faculty'),
  ('Prof. N. Patel', 'npatel@silveroak.edu', 'faculty')
ON CONFLICT ("email") DO NOTHING;

-- 2. Seed Notices
INSERT INTO "public"."notices" ("title", "content", "type", "is_important")
VALUES
  (
    'Mid-Semester Examination Schedule',
    'Mid-Semester Examinations commence from Monday at 09:00 AM. Please verify your examination room allocation and seat numbers on the department bulletin board. Bring your student ID card to every session.',
    'Examination',
    true
  ),
  (
    'Campus Placement Drive: TechCorp',
    'TechCorp campus recruitment drive is scheduled for final and pre-final year students. Online coding round begins this Friday at 10:00 AM in Lab 1 & 2. Register on the placement portal by tomorrow 5:00 PM.',
    'Placement',
    true
  ),
  (
    'Annual Tech Fest ''HackSilver 2026'' Registrations Open',
    'Registrations are now open for HackSilver 2026! Events include 24-hour Hackathon, Robowar, Web3 sprints, and competitive coding. Exciting cash prizes and internship opportunities await top teams.',
    'Events',
    false
  ),
  (
    'Library Book Return Deadline',
    'All books issued before the mid-term break must be renewed or returned to the central library before the end of the month to avoid overdue charges.',
    'Academic',
    false
  ),
  (
    'Scholarship Renewal Applications',
    'Applications for merit and need-based scholarship renewals for the upcoming semester are now open. Submit completed forms along with marksheets to the Student Affairs desk by Oct 30.',
    'General',
    false
  ),
  (
    'CSE Department Project Review Calendar',
    'Capstone project preliminary review for 6th and 8th semester Computer Science students will be held next Tuesday in the Innovation Hub. Prepare your slides and prototype demo.',
    'Academic',
    false
  ),
  (
    'Emergency Contact Information Update',
    'All registered students and faculty members are requested to review and update their emergency contact details and blood group records on the student portal.',
    'Emergency',
    true
  );

-- 3. Seed Timetable
INSERT INTO "public"."timetable" ("day", "subject", "time", "end_time", "room", "type")
VALUES
  ('Monday', 'Data Structures', '09:00 AM', '10:00 AM', 'Room 302', 'Lecture'),
  ('Monday', 'Database Management', '11:00 AM', '12:00 PM', 'Lab 4', 'Lab'),
  ('Monday', 'Computer Networks', '02:00 PM', '03:00 PM', 'Room 305', 'Lecture'),
  ('Tuesday', 'Operating Systems', '10:00 AM', '11:00 AM', 'Room 204', 'Lecture'),
  ('Tuesday', 'Computer Networks Lab', '12:00 PM', '01:00 PM', 'Lab 2', 'Lab'),
  ('Tuesday', 'Software Engineering', '03:00 PM', '04:00 PM', 'Room 301', 'Lecture'),
  ('Wednesday', 'Artificial Intelligence', '09:00 AM', '10:00 AM', 'Room 410', 'Lecture'),
  ('Wednesday', 'Database Management', '11:00 AM', '12:00 PM', 'Room 202', 'Lecture'),
  ('Wednesday', 'Operating Systems Lab', '02:00 PM', '04:00 PM', 'Lab 3', 'Lab'),
  ('Thursday', 'Data Structures', '10:00 AM', '11:00 AM', 'Room 302', 'Lecture'),
  ('Thursday', 'Software Engineering', '12:00 PM', '01:00 PM', 'Room 301', 'Lecture'),
  ('Thursday', 'Computer Networks', '03:00 PM', '04:00 PM', 'Room 305', 'Lecture'),
  ('Friday', 'Artificial Intelligence', '09:00 AM', '10:00 AM', 'Room 410', 'Lecture'),
  ('Friday', 'Computer Networks Lab', '11:00 AM', '01:00 PM', 'Lab 2', 'Lab'),
  ('Friday', 'Project Studio', '02:00 PM', '04:00 PM', 'Innovation Hub', 'Workshop'),
  ('Saturday', 'Competitive Programming', '09:30 AM', '11:30 AM', 'Lab 1', 'Workshop'),
  ('Saturday', 'Open Source Project Studio', '12:00 PM', '02:00 PM', 'Innovation Hub', 'Lab');

-- 4. Seed Library Books
INSERT INTO "public"."library_books" ("title", "author", "category", "available", "return_date")
VALUES
  ('Artificial Intelligence: A Modern Approach', 'Stuart Russell', 'Computer Science', true, NULL),
  ('Database System Concepts', 'Abraham Silberschatz', 'Computer Science', false, 'Oct 20'),
  ('Clean Code', 'Robert C. Martin', 'Software Engineering', true, NULL),
  ('Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', true, NULL),
  ('Design Patterns', 'Erich Gamma', 'Software Engineering', true, NULL),
  ('Computer Networking: A Top-Down Approach', 'James Kurose', 'Computer Networks', false, 'Oct 24'),
  ('Operating System Concepts', 'Abraham Silberschatz', 'Computer Science', true, NULL),
  ('The Pragmatic Programmer', 'David Thomas', 'Software Engineering', true, NULL),
  ('Deep Learning', 'Ian Goodfellow', 'Artificial Intelligence', true, NULL),
  ('Computer Organization', 'David Patterson', 'Computer Science', true, NULL),
  ('Discrete Mathematics', 'Kenneth Rosen', 'Mathematics', true, NULL),
  ('Effective TypeScript', 'Dan Vanderkam', 'Software Engineering', false, 'Oct 26');

-- 5. Seed Feedback (linking to inserted users)
INSERT INTO "public"."feedback" ("user_id", "category", "description", "priority", "status")
SELECT u.id, 'Facilities', 'Projector in Room 302 flickers occasionally during morning lectures.', 'Low', 'In Review'
FROM "public"."users" u WHERE u.email = 'sahil.v@silveroak.edu'
LIMIT 1;

INSERT INTO "public"."feedback" ("user_id", "category", "description", "priority", "status")
SELECT u.id, 'Academics', 'Request for additional reference textbooks for Distributed Systems in the central library.', 'Medium', 'Resolved'
FROM "public"."users" u WHERE u.email = 'sahil.v@silveroak.edu'
LIMIT 1;

INSERT INTO "public"."feedback" ("user_id", "category", "description", "priority", "status")
SELECT u.id, 'IT Support', 'Wi-Fi connectivity drops frequently on the 3rd floor of Block A.', 'High', 'Submitted'
FROM "public"."users" u WHERE u.email = 'student@silveroak.edu'
LIMIT 1;
