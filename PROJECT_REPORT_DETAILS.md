# BBSBEC Digital Notice Board - Project Report Details

## 1. Project Overview
**Project Name:** BBSBEC Digital Notice Board
**Description:** A comprehensive web-based application designed to digitize and streamline the communication process within Baba Banda Singh Bahadur Engineering College (BBSBEC). It facilitates the management of notices, events, and user data (students and faculty) through a centralized, role-based platform.

## 2. Technology Stack

### Frontend
*   **Framework:** React.js (v18) with Vite for fast build and development.
*   **Language:** TypeScript (for type safety and better code maintainability).
*   **Styling:** Tailwind CSS (for modern, responsive, and utility-first design).
*   **Icons:** Lucide React (for consistent and clean UI icons).
*   **Routing:** React Router DOM (v6).
*   **State Management:** React Hooks (`useState`, `useEffect`, `useContext`).

### Backend
*   **Runtime:** Node.js.
*   **Framework:** Express.js (RESTful API architecture).
*   **Database:** MongoDB (NoSQL database for flexible data storage).
*   **ODM:** Mongoose (for schema-based data modeling).
*   **Authentication:** JSON Web Tokens (JWT) for secure, stateless authentication.
*   **Security:** `bcryptjs` for password hashing, `cors` for cross-origin resource sharing.

## 3. Core Features & Modules

### A. Authentication & Security
*   **Secure Login:** Role-based login (Admin, Faculty, Student) with encrypted passwords.
*   **Registration System:** Controlled registration using pre-generated **Unique Registration Codes**. This prevents unauthorized users from creating accounts.
*   **Forgot Password:** Secure password reset functionality via email verification (simulated/implemented).
*   **Session Management:** JWT-based session handling with automatic expiration.

### B. Admin Module
The Admin has full control over the system.
1.  **Dashboard:**
    *   Real-time statistics: Total Students, Total Faculty, Active Notices.
    *   Quick actions and recent activity overview.
2.  **User Management:**
    *   **Student Directory:** View, search, and filter students by Course, Department, Year, and Section. Add, edit, or delete student profiles.
    *   **Faculty Directory:** View, search, and filter faculty by Department and Designation. Add, edit, or delete faculty profiles.
    *   **Profile Images:** Support for uploading and viewing user profile pictures.
3.  **Registration Code Management:**
    *   Generate secure codes for new Students, Faculty, or Admins.
    *   **Track Usage:** See exactly *who* used a specific code (Name, Email, Roll No).
    *   **Auto-Cleanup:** Deleting a used code automatically deletes the associated user account (Cascade Delete) to maintain data integrity.
4.  **Approvals & Requests:**
    *   **New Registrations:** Review and approve/reject pending student registrations.
    *   **Profile Updates:** Review requests from students/faculty to update their personal details.
5.  **Notice & Event Management:**
    *   Create targeted notices (e.g., only for "CSE 3rd Year" or "All B.Tech").
    *   Pin important notices to the top.
    *   Manage the academic calendar and holidays.

### C. Faculty Module
1.  **Notice Board:**
    *   Post notices specifically for their classes or departments.
    *   View institute-wide notices.
2.  **Academic Calendar:**
    *   View and manage events.
    *   "Create Event" shortcut for quick scheduling.
3.  **Profile Management:**
    *   View personal details and request updates from the admin.

### D. Student Module
1.  **Personalized Dashboard:**
    *   Students see *only* the notices relevant to their specific Course, Branch, and Year.
    *   Pinned notices (e.g., Exam Datesheets) appear at the top.
2.  **Academic Calendar:**
    *   View holidays, exams, and college events in a calendar or list view.
3.  **Profile:**
    *   View academic details (Roll No, Section, Sem).
    *   Request corrections to their profile data.

## 4. Database Schema (Key Models)

### User Model
*   Stores all user data: Name, Email, Password (Hashed), Role, Profile Image URL.
*   **Student Specifics:** Roll No, Course, Department, Year, Semester, Section, Father's Name.
*   **Faculty Specifics:** Designation, Department, Employee ID.

### Notice Model
*   Title, Description, Date, Category (Academic, Exam, Holiday, etc.).
*   **Target Audience:** Filters for Course, Department, Year, etc.
*   **Pinned Status:** Boolean flag for high-priority notices.
*   **Author:** Reference to the User who created it.

### RegistrationCode Model
*   Code String (Unique), Role (Student/Faculty/Admin).
*   **Status:** isUsed (Boolean).
*   **UsedBy:** Reference to the User who claimed the code.

### Event Model
*   Title, Description, Date, Time.
*   Target Audience and Creator details.

## 5. Key Highlights / USP (Unique Selling Points)
*   **Targeted Communication:** Eliminates noise by ensuring students only receive relevant information.
*   **Secure Onboarding:** The unique code system ensures only verified college members can join.
*   **Modern UI/UX:** Clean, responsive interface with Dark Mode support and intuitive navigation.
*   **Data Integrity:** Automated cleanup ensures the database remains consistent (e.g., deleting a user removes their linked data).

## 6. Future Enhancements (For Report Conclusion)
*   **Mobile App:** Developing a React Native mobile app for push notifications.
*   **Attendance System:** Integrating QR-code based daily attendance.
*   **Result Portal:** Allowing students to view semester results directly on the dashboard.
*   **Alumni Network:** A dedicated section for alumni to stay connected.
