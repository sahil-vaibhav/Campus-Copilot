export const currentUser = {
  name: "Sahil Vaibhav",
  role: "Student",
  department: "Computer Science & Engineering",
  semester: 4,
  enrollmentNo: "SO24CS0192",
  email: "sahil.v@silveroak.edu",
  attendance: 82,
}

export const timetableMock = [
  { id: 1, day: "Monday", subject: "Data Structures", time: "09:00 AM", endTime: "10:00 AM", room: "Room 302", type: "Lecture", professor: "Prof. N. Patel" },
  { id: 2, day: "Monday", subject: "Database Management", time: "11:00 AM", endTime: "12:00 PM", room: "Lab 4", type: "Lab", professor: "Dr. K. Desai" },
  { id: 3, day: "Monday", subject: "Computer Networks", time: "02:00 PM", endTime: "03:00 PM", room: "Room 305", type: "Lecture", professor: "Prof. R. Mehta" },
  { id: 4, day: "Tuesday", subject: "Operating Systems", time: "10:00 AM", endTime: "11:00 AM", room: "Room 204", type: "Lecture", professor: "Dr. A. Sharma" },
  { id: 5, day: "Tuesday", subject: "Computer Networks Lab", time: "12:00 PM", endTime: "01:00 PM", room: "Lab 2", type: "Lab", professor: "Prof. R. Mehta" },
  { id: 6, day: "Tuesday", subject: "Software Engineering", time: "03:00 PM", endTime: "04:00 PM", room: "Room 301", type: "Lecture", professor: "Dr. P. Shah" },
  { id: 7, day: "Wednesday", subject: "Artificial Intelligence", time: "09:00 AM", endTime: "10:00 AM", room: "Room 410", type: "Lecture", professor: "Prof. M. Joshi" },
  { id: 8, day: "Wednesday", subject: "Database Management", time: "11:00 AM", endTime: "12:00 PM", room: "Room 202", type: "Lecture", professor: "Dr. K. Desai" },
  { id: 9, day: "Wednesday", subject: "Operating Systems Lab", time: "02:00 PM", endTime: "04:00 PM", room: "Lab 3", type: "Lab", professor: "Dr. A. Sharma" },
  { id: 10, day: "Thursday", subject: "Data Structures", time: "10:00 AM", endTime: "11:00 AM", room: "Room 302", type: "Lecture", professor: "Prof. N. Patel" },
  { id: 11, day: "Thursday", subject: "Software Engineering", time: "12:00 PM", endTime: "01:00 PM", room: "Room 301", type: "Lecture", professor: "Dr. P. Shah" },
  { id: 12, day: "Thursday", subject: "Computer Networks", time: "03:00 PM", endTime: "04:00 PM", room: "Room 305", type: "Lecture", professor: "Prof. R. Mehta" },
  { id: 13, day: "Friday", subject: "Artificial Intelligence", time: "09:00 AM", endTime: "10:00 AM", room: "Room 410", type: "Lecture", professor: "Prof. M. Joshi" },
  { id: 14, day: "Friday", subject: "Computer Networks Lab", time: "11:00 AM", endTime: "01:00 PM", room: "Lab 2", type: "Lab", professor: "Prof. R. Mehta" },
  { id: 15, day: "Friday", subject: "Project Studio", time: "02:00 PM", endTime: "04:00 PM", room: "Innovation Hub", type: "Workshop", professor: "Prof. T. Trivedi" },
  { id: 16, day: "Saturday", subject: "Competitive Programming", time: "09:30 AM", endTime: "11:30 AM", room: "Lab 1", type: "Workshop", professor: "Prof. N. Patel" },
  { id: 17, day: "Saturday", subject: "Open Source Project Studio", time: "12:00 PM", endTime: "02:00 PM", room: "Innovation Hub", type: "Lab", professor: "Prof. T. Trivedi" },
]

export const noticesMock = [
  { id: 1, title: "Mid-Semester Examination Schedule", date: "Today", type: "Examination", isImportant: true },
  { id: 2, title: "Campus Placement Drive: TechCorp", date: "Yesterday", type: "Placement", isImportant: true },
  { id: 3, title: "Annual Tech Fest Registrations Open", date: "Oct 15", type: "Events", isImportant: false },
  { id: 4, title: "Library Book Return Deadline", date: "Oct 12", type: "Academic", isImportant: false },
  { id: 5, title: "Scholarship renewal applications", date: "Oct 10", type: "General", isImportant: false },
  { id: 6, title: "CSE project review calendar", date: "Oct 9", type: "Academic", isImportant: false },
  { id: 7, title: "Blood donation camp this Friday", date: "Oct 8", type: "Events", isImportant: false },
  { id: 8, title: "Emergency contact information update", date: "Oct 7", type: "Emergency", isImportant: true },
  { id: 9, title: "Internship applications now open", date: "Oct 6", type: "Placement", isImportant: false },
  { id: 10, title: "End-semester examination guidelines", date: "Oct 4", type: "Examination", isImportant: true },
]

export const libraryBooksMock = [
  { id: 1, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", category: "Computer Science", available: true },
  { id: 2, title: "Database System Concepts", author: "Abraham Silberschatz", category: "Computer Science", available: false, returnDate: "Oct 20" },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", available: true },
  { id: 4, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Computer Science", available: true },
  { id: 5, title: "Design Patterns", author: "Erich Gamma", category: "Software Engineering", available: true },
  { id: 6, title: "Computer Networking: A Top-Down Approach", author: "James Kurose", category: "Computer Networks", available: false, returnDate: "Oct 24" },
  { id: 7, title: "Operating System Concepts", author: "Abraham Silberschatz", category: "Computer Science", available: true },
  { id: 8, title: "The Pragmatic Programmer", author: "David Thomas", category: "Software Engineering", available: true },
  { id: 9, title: "Deep Learning", author: "Ian Goodfellow", category: "Artificial Intelligence", available: true },
  { id: 10, title: "Computer Organization", author: "David Patterson", category: "Computer Science", available: true },
  { id: 11, title: "Discrete Mathematics", author: "Kenneth Rosen", category: "Mathematics", available: true },
  { id: 12, title: "Effective TypeScript", author: "Dan Vanderkam", category: "Software Engineering", available: false, returnDate: "Oct 26" },
  ...Array.from({ length: 8 }, (_, index) => {
    const titles = ["Learning React", "Artificial Intelligence", "Computer Architecture", "Database Design", "Refactoring", "Data Mining", "Cloud Computing", "Cybersecurity Fundamentals"]
    const authors = ["Alex Banks", "Elaine Rich", "John Hennessy", "Thomas Connolly", "Martin Fowler", "Jiawei Han", "Thomas Erl", "William Stallings"]
    const categories = ["Software Engineering", "Artificial Intelligence", "Computer Science", "Computer Science", "Software Engineering", "Computer Science", "Computer Science", "Computer Science"]
    return { id: index + 13, title: titles[index]!, author: authors[index]!, category: categories[index]!, available: index % 3 !== 0 }
  })
]

export const facultyMock = [
  { id: 1, name: "Dr. A. Sharma", department: "CSE", email: "asharma@silveroak.edu", office: "Block A, Room 402", subject: "Operating Systems" },
  { id: 2, name: "Prof. N. Patel", department: "CSE", email: "npatel@silveroak.edu", office: "Block A, Room 405", subject: "Data Structures" },
  { id: 3, name: "Dr. K. Desai", department: "CSE", email: "kdesai@silveroak.edu", office: "Block B, Room 201", subject: "Database Management" },
  { id: 4, name: "Prof. R. Mehta", department: "CSE", email: "rmehta@silveroak.edu", office: "Block A, Room 410", subject: "Computer Networks" },
  { id: 5, name: "Dr. P. Shah", department: "CSE", email: "pshah@silveroak.edu", office: "Block B, Room 204", subject: "Software Engineering" },
  { id: 6, name: "Prof. M. Joshi", department: "CSE", email: "mjoshi@silveroak.edu", office: "Block A, Room 312", subject: "Artificial Intelligence" },
  { id: 7, name: "Dr. S. Rao", department: "Mathematics", email: "srao@silveroak.edu", office: "Block C, Room 106", subject: "Discrete Mathematics" },
  { id: 8, name: "Prof. T. Trivedi", department: "CSE", email: "ttrivedi@silveroak.edu", office: "Block A, Room 408", subject: "Machine Learning" },
]

export const servicesMock = [
  { id: 1, name: "Library", description: "Search books and digital resources", icon: "Library" },
  { id: 2, name: "Canteen", description: "View menu and pre-order meals", icon: "Coffee" },
  { id: 3, name: "Transport", description: "Bus routes and live tracking", icon: "Bus" },
  { id: 4, name: "IT Support", description: "Wi-Fi and portal assistance", icon: "Laptop" },
  { id: 5, name: "Medical", description: "Campus clinic hours and emergency contacts", icon: "HeartPulse" },
  { id: 6, name: "Security", description: "Safety desk and campus assistance", icon: "ShieldCheck" },
  { id: 7, name: "Student Affairs", description: "Support with student life and records", icon: "Users" },
  { id: 8, name: "Clubs & Events", description: "Discover student clubs and activities", icon: "PartyPopper" },
]
