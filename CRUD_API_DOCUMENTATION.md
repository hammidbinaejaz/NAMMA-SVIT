# NAMMA SVIT ERP - CRUD API & Admin Pages Documentation

## ✅ Database Connection Verified

Prisma is successfully connected to your Neon PostgreSQL database via `DATABASE_URL` in `.env`.

---

## 📡 API Routes Created

All API routes are located in `src/app/api/` and follow RESTful conventions.

### 1. **Admin API** (`/api/admin`)

#### GET `/api/admin`
- **Description:** Fetch all admins
- **Response:** Array of admin objects (without passwords)

#### POST `/api/admin`
- **Description:** Create new admin
- **Body:**
  ```json
  {
    "username": "admin2",
    "password": "svit123"
  }
  ```
- **Response:** Created admin object

#### GET `/api/admin/[id]`
- **Description:** Get single admin by ID
- **Response:** Admin object with feedbacks

#### PUT `/api/admin/[id]`
- **Description:** Update admin
- **Body:**
  ```json
  {
    "username": "newadmin",
    "password": "newpassword" // optional
  }
  ```

#### DELETE `/api/admin/[id]`
- **Description:** Delete admin

---

### 2. **Teachers/Faculty API** (`/api/teachers`)

#### GET `/api/teachers`
- **Description:** Fetch all teachers with counts
- **Response:** Array of teacher objects

#### POST `/api/teachers`
- **Description:** Create new teacher
- **Body:**
  ```json
  {
    "username": "faculty3",
    "password": "svit123",
    "name": "Dr. John",
    "surname": "Doe",
    "email": "john@svit.edu",
    "phone": "1234567890",
    "address": "SVIT Campus",
    "bloodType": "O+",
    "sex": "MALE",
    "birthday": "1985-01-01",
    "subjectIds": [1, 2]
  }
  ```

#### GET `/api/teachers/[id]`
- **Description:** Get single teacher with relations

#### PUT `/api/teachers/[id]`
- **Description:** Update teacher (password optional)

#### DELETE `/api/teachers/[id]`
- **Description:** Delete teacher

---

### 3. **Students API** (`/api/students`)

#### GET `/api/students`
- **Description:** Fetch all students with class, grade, parent info
- **Response:** Array of student objects

#### POST `/api/students`
- **Description:** Create new student
- **Body:**
  ```json
  {
    "username": "student4",
    "password": "svit123",
    "name": "Rohan",
    "surname": "Kumar",
    "email": "rohan@svit.edu",
    "phone": "9876543210",
    "address": "Student Address",
    "bloodType": "O+",
    "sex": "MALE",
    "birthday": "2004-05-15",
    "parentId": "parentId1",
    "classId": 1,
    "gradeId": 1
  }
  ```

#### GET `/api/students/[id]`
- **Description:** Get single student with full relations

#### PUT `/api/students/[id]`
- **Description:** Update student

#### DELETE `/api/students/[id]`
- **Description:** Delete student

---

### 4. **Announcements API** (`/api/announcements`)

#### GET `/api/announcements`
- **Description:** Fetch all announcements (sorted by date desc)
- **Response:** Array of announcement objects

#### POST `/api/announcements`
- **Description:** Create new announcement
- **Body:**
  ```json
  {
    "title": "New Announcement",
    "description": "Announcement description",
    "classId": 1, // optional, null for all classes
    "date": "2024-11-02"
  }
  ```

#### GET `/api/announcements/[id]`
- **Description:** Get single announcement

#### PUT `/api/announcements/[id]`
- **Description:** Update announcement

#### DELETE `/api/announcements/[id]`
- **Description:** Delete announcement

---

### 5. **Events API** (`/api/events`)

#### GET `/api/events`
- **Description:** Fetch all events (sorted by startTime desc)
- **Response:** Array of event objects

#### POST `/api/events`
- **Description:** Create new event
- **Body:**
  ```json
  {
    "title": "Annual Day",
    "description": "SVIT Annual Day celebration",
    "startTime": "2024-12-01T10:00:00",
    "endTime": "2024-12-01T18:00:00",
    "classId": 1 // optional
  }
  ```

#### GET `/api/events/[id]`
- **Description:** Get single event

#### PUT `/api/events/[id]`
- **Description:** Update event

#### DELETE `/api/events/[id]`
- **Description:** Delete event

---

## 🖥️ Admin Frontend Pages

All admin pages are located in `src/app/(dashboard)/admin/`:

### 1. **Students Management** (`/admin/students`)
- ✅ List all students in a table
- ✅ Add new student form
- ✅ Edit student form
- ✅ Delete student with confirmation
- ✅ Real-time updates using `fetch("/api/students")`

### 2. **Faculty Management** (`/admin/faculty`)
- ✅ List all faculty members
- ✅ Add new faculty form
- ✅ Edit faculty form
- ✅ Delete faculty with confirmation
- ✅ Real-time updates using `fetch("/api/teachers")`

### 3. **Announcements Management** (`/admin/announcements`)
- ✅ List all announcements
- ✅ Add new announcement form
- ✅ Edit announcement form
- ✅ Delete announcement with confirmation
- ✅ Real-time updates using `fetch("/api/announcements")`

### 4. **Events Management** (`/admin/events`)
- ✅ List all events
- ✅ Add new event form with datetime picker
- ✅ Edit event form
- ✅ Delete event with confirmation
- ✅ Real-time updates using `fetch("/api/events")`

---

## 🎨 Styling

All pages use the SVIT brand colors:
- **Primary Blue:** `#0B3C7D` (`svitPrimary`)
- **Accent Gold:** `#E5A823` (`svitAccent`)
- **Light Background:** `#F8F9FA` (`svitLight`)

Features:
- ✅ Hover effects on table rows
- ✅ Color-coded action buttons
- ✅ Form validation
- ✅ Toast notifications for success/error

---

## 🗄️ Database Storage

### Location
- **Database:** Neon PostgreSQL (cloud-hosted)
- **Connection:** Via `DATABASE_URL` in `.env`

### How to Check Data

#### Option 1: Prisma Studio (Recommended)
```bash
npx prisma studio
```
- Opens browser at `http://localhost:5555`
- Visual interface to browse all tables
- Can edit/delete data directly
- No SQL knowledge needed

#### Option 2: Direct Database Access
- Go to [Neon Console](https://console.neon.tech)
- Use the SQL Editor to run queries:
  ```sql
  SELECT * FROM "Admin";
  SELECT * FROM "Teacher";
  SELECT * FROM "Student";
  SELECT * FROM "Announcement";
  SELECT * FROM "Event";
  ```

#### Option 3: API Endpoints
- Test API directly:
  ```bash
  curl http://localhost:3000/api/students
  curl http://localhost:3000/api/teachers
  ```

---

## 🌱 Seed Data

The seed file (`prisma/seed.ts`) has been updated with:

### Created Users:
- ✅ **1 Admin:** `admin` / `svit123`
- ✅ **2 Faculty:** `faculty1`, `faculty2` / `svit123`
- ✅ **3 Students:** `student1`, `student2`, `student3` / `svit123`
- ✅ **2 Announcements:** Welcome message + Exam schedule

### Run Seed:
```bash
npm run prisma:seed
```

**All passwords are bcrypt-hashed automatically.**

---

## 🚀 Usage Examples

### Create a Student via API:
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newstudent",
    "password": "svit123",
    "name": "John",
    "surname": "Doe",
    "parentId": "parentId1",
    "classId": 1,
    "gradeId": 1
  }'
```

### Update an Announcement:
```bash
curl -X PUT http://localhost:3000/api/announcements/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

### Delete an Event:
```bash
curl -X DELETE http://localhost:3000/api/events/1
```

---

## ✅ Testing Checklist

- [x] Prisma connection verified
- [x] All API routes created
- [x] All admin pages created
- [x] Seed file updated
- [x] Build successful (`npm run build`)
- [x] Password hashing implemented
- [x] Error handling added
- [x] Toast notifications configured

---

## 📝 Next Steps

1. **Test API Routes:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/students
   ```

2. **Test Admin Pages:**
   - Login as admin
   - Navigate to `/admin/students`, `/admin/faculty`, etc.
   - Try creating, editing, deleting records

3. **View Data:**
   ```bash
   npx prisma studio
   ```

4. **Add More Features (Optional):**
   - Search/filter on admin pages
   - Pagination
   - Export to PDF/Excel
   - Bulk operations

---

## 🔗 Quick Links

- **API Base:** `http://localhost:3000/api/`
- **Admin Pages:** `/admin/students`, `/admin/faculty`, `/admin/announcements`, `/admin/events`
- **Prisma Studio:** `http://localhost:5555` (when running `npx prisma studio`)

---

**All CRUD operations are now fully functional!** 🎉



