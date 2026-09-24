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
  { id: 1, subject: "Data Structures", time: "09:00 AM", endTime: "10:00 AM", room: "Room 302", type: "Lecture" },
  { id: 2, subject: "Database Management", time: "11:00 AM", endTime: "12:00 PM", room: "Lab 4", type: "Lab" },
  { id: 3, subject: "Computer Networks", time: "02:00 PM", endTime: "03:00 PM", room: "Room 305", type: "Lecture" },
]

export const noticesMock = [
  { id: 1, title: "Mid-Semester Examination Schedule", date: "Today", type: "Examination", isImportant: true },
  { id: 2, title: "Campus Placement Drive: TechCorp", date: "Yesterday", type: "Placement", isImportant: true },
  { id: 3, title: "Annual Tech Fest Registrations Open", date: "Oct 15", type: "Events", isImportant: false },
  { id: 4, title: "Library Book Return Deadline", date: "Oct 12", type: "Academic", isImportant: false },
]

export const libraryBooksMock = [
  { id: 1, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", category: "Computer Science", available: true },
  { id: 2, title: "Database System Concepts", author: "Abraham Silberschatz", category: "Computer Science", available: false, returnDate: "Oct 20" },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", available: true },
]

export const facultyMock = [
  { id: 1, name: "Dr. A. Sharma", department: "CSE", email: "asharma@silveroak.edu", office: "Block A, Room 402", subject: "Operating Systems" },
  { id: 2, name: "Prof. N. Patel", department: "CSE", email: "npatel@silveroak.edu", office: "Block A, Room 405", subject: "Data Structures" },
  { id: 3, name: "Dr. K. Desai", department: "CSE", email: "kdesai@silveroak.edu", office: "Block B, Room 201", subject: "Database Management" },
]

export const servicesMock = [
  { id: 1, name: "Library", description: "Search books and digital resources", icon: "Library" },
  { id: 2, name: "Canteen", description: "View menu and pre-order meals", icon: "Coffee" },
  { id: 3, name: "Transport", description: "Bus routes and live tracking", icon: "Bus" },
  { id: 4, name: "IT Support", description: "Wi-Fi and portal assistance", icon: "Laptop" },
]
