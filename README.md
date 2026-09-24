# Campus Copilot

## AI-Powered Smart Campus Assistant

Campus Copilot is a modern web application for college students and faculty. It provides a centralized interface for campus information and services through an AI-powered assistant.

Developed as a college Problem-Based Learning (PBL) project under the theme **Smart & Clean Campus using Artificial Intelligence**.

---

## Features

- **AI Campus Assistant**: Ask questions about your schedule, notices, or campus facilities.
- **Student Dashboard**: Quick overview of attendance, upcoming classes, and unread notices.
- **Smart Timetable**: Easily navigate your weekly class schedule.
- **Campus Notices**: Stay updated with important announcements.
- **Library Assistant**: Search and track books and digital resources.
- **Faculty Directory**: Find and contact professors quickly.
- **Campus Services**: Access essential campus facilities.
- **Feedback System**: Report issues or provide feedback to improve campus life.

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui (Accessible Components)
- Lucide React (Icons)
- React Router (Routing)

### Architecture
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop.
- **Dark Mode**: Fully supported with consistent design tokens.
- **Service Layer**: Clean abstraction for API and AI services.
- **Mock Data**: Realistic data to simulate the full experience without a backend.

## Folder Structure

```text
src/
├── components/       # Reusable UI and Layout components
│   ├── layout/       # AppShell, Sidebar, Topbar
│   └── ui/           # Buttons, Cards, Inputs, etc.
├── data/             # Mock datasets for students, timetables, etc.
├── pages/            # Page components for each route
├── lib/              # Utility functions
├── App.tsx           # Main application routing
└── main.tsx          # Entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env`
4. Run the development server:
   ```bash
   npm run dev
   ```

## Available Routes

- `/` - Landing Page
- `/login` - Authentication
- `/dashboard` - Student Dashboard
- `/copilot` - AI Assistant Chat
- `/timetable` - Class Schedule
- `/notices` - Campus Announcements
- `/library` - Library Resources
- `/faculty` - Faculty Directory
- `/services` - Campus Services
- `/feedback` - Issue Reporting
- `/profile` - Student Profile
- `/settings` - App Preferences

## Future Scope

- **Real AI Backend Integration**: Connect to an LLM provider and RAG architecture.
- **Database Integration**: Connect to PostgreSQL via a Node.js/Express backend.
- **Live Notifications**: Implement WebSocket for real-time announcements.
- **Authentication**: JWT-based secure login system.

## Contributing
Follow standard Git workflows to contribute to this project. Keep components reusable and adhere to the established design system.

## License
MIT License
