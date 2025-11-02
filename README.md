# NAMMA SVIT | ERP Portal

**Empowering Students & Faculty through Digital Innovation**

A comprehensive Enterprise Resource Planning (ERP) system built for Sai Vidya Institute of Technology (SVIT), providing a unified platform for students, faculty, and administrators.

## 🎯 Features

### Admin Portal
- Manage Students, Faculty, Courses, Attendance, and Fees
- Generate downloadable reports (PDF/Excel)
- Control Announcements & Events
- Analytics Dashboard with Charts

### Faculty Portal
- Upload Marks & Attendance
- View timetable and communicate with students
- Manage classes and subjects

### Student Portal
- View Attendance, Marks, Assignments, and Notices
- Edit profile (limited)
- Download Certificates / Receipts
- Apply for Placements
- Submit Feedback

### Additional Features
- Placement Cell Module
- Feedback / Suggestion System
- Role-based Authentication
- Analytics Dashboard
- Modern, Clean UI with SVIT Branding

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd namma-svit-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run prisma:seed  # Optional: seed with sample data
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **Styling:** Tailwind CSS
- **Charts:** Recharts & Chart.js
- **Forms:** React Hook Form with Zod validation
- **Icons:** Custom SVG icons

## 🎨 Brand Colors

- **Primary:** #0B3C7D (Deep Blue)
- **Accent:** #E5A823 (Golden Yellow)
- **Light:** #F8F9FA (Background)

## 📁 Project Structure

```
/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (dashboard)/  # Dashboard routes
│   │   └── [[...sign-in]]/ # Authentication
│   ├── components/       # React components
│   └── lib/             # Utilities and configurations
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
└── public/              # Static assets
```

## 🔐 Authentication

The system uses Clerk for authentication with username-based login. User roles are stored in Clerk's public metadata:
- `admin` - Full system access
- `teacher` - Faculty portal access
- `student` - Student portal access
- `parent` - Parent portal access

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Comprehensive deployment instructions
- [API Documentation](./docs/API.md) - API endpoints and usage
- [Database Schema](./docs/SCHEMA.md) - Database structure and relationships

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting (optional)

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Recommended Stack:**
- **Frontend:** Vercel
- **Database:** Render or Railway (PostgreSQL)
- **Authentication:** Clerk
- **File Storage:** Cloudinary (optional)

## 📝 License

Copyright © 2024 Sai Vidya Institute of Technology. All rights reserved.

## 🤝 Contributing

This is an internal project for SVIT. For contributions, please contact the IT department.

## 📧 Support

For support and inquiries:
- Contact: SVIT IT Department
- Email: [IT Department Email]

---

**Built with ❤️ for Sai Vidya Institute of Technology**