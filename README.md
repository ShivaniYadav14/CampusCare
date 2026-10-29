# 🏛️ NIT Rourkela CampusCare

> **Official Campus Grievance & Facility Maintenance Management Portal**  
> A transparent, role-based platform for reporting, routing, tracking, and resolving student campus issues across NIT Rourkela hostels, messes, academic blocks, electricity, IT networks, and infrastructure.

---

## 📌 Project Overview

**CampusCare** is a full-featured web application engineered specifically for the National Institute of Technology Rourkela (NITR) community. It replaces slow, opaque paper complaints and scattered email chains with a centralized, real-time grievance ledger.

Students can submit detailed complaints with photo evidence, categorize issues, specify physical locations, and track resolution status in real time. Faculty administrators, chief wardens, and maintenance supervisors can review, triage, update resolution stages in bulk, and export audit trails.

---

## 🚀 Key Features

### 👨‍🎓 Student Portal
- **8-Category Issue Triage**: Hostel, Mess, Academic, Electricity, Internet/WiFi, Cleanliness, Infrastructure, and Other.
- **Priority & Location Tagging**: Mark urgency (Low, Medium, High, Critical) and select from NITR campus locations (e.g., VS Hall, SD Hall, LA Complex, BPCL Library).
- **Photo Evidence Upload**: Integrated drag-and-drop file uploader supporting JPG, PNG, and WebP (up to 5MB).
- **Interactive Resolution Timeline**: 4-stage live audit trail (`Submitted` ➔ `Pending Review` ➔ `In Progress` ➔ `Resolved & Closed`).
- **Personal Complaints Ledger**: Search, sort, and filter previous submissions by status and category.
- **Official Resolution Slip**: One-click printable PDF/paper grievance slip formatted for institute records.

### 👩‍🏫 Faculty & Administration Dashboard
- **Role-Based Access Control (RBAC)**: Secure access restricted to authorized faculty and administrative accounts.
- **Real-Time Analytics Counters**: Instant totals for total registered grievances, pending reviews, active interventions, and completed resolutions.
- **Bulk Action Management**: Update multiple grievances simultaneously with custom status tags.
- **CSV Data Export**: Export complaint records into CSV format for official reporting and meetings.
- **Photo Evidence Inspector**: Modal inspection viewer to review damage proof submitted by students.

### 🎨 Visual Design & Interaction Engine
- **NIT Rourkela Brand Identity**: Unified color palette (`#8B1E2D` Maroon & `#C9A15A` Gold) and typography (Playfair Display + Inter + JetBrains Mono).
- **Section-Tailored Scroll Effects**: Custom reveal behaviors tailored to each section (cinematic hero zoom, 3D metric flips, cascading category tiles, sliding workflow milestones).
- **Interactive Network Canvas**: Dynamic connected node particle background visualizing automated department routing.
- **Scroll Utilities**: Ambient top scroll progress bar and floating quick-scroll-to-top button.
- **Accessibility & Reduced Motion**: Full `@media (prefers-reduced-motion: reduce)` support ensuring content is accessible to all users.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Vanilla HTML5, Vanilla CSS3 (Custom Design System, Tokens & Variables), JavaScript (ES6+ modular architecture) |
| **Backend** | Node.js, Express.js (REST API, static file serving) |
| **Database** | SQLite (via `node:sqlite` DatabaseSync & `better-sqlite3` with automatic fallback) |
| **Authentication** | JWT (JSON Web Tokens) with `bcryptjs` password hashing and Role-Based Access Control |
| **Realtime** | Server-Sent Events (SSE) & Supabase Realtime bridge |
| **File Handling** | Multer local disk storage with automatic uploads directory creation |

---

## 📂 Project Structure

```text
CampusCare/
├── index.html                 # Public landing page with live tracker, stats & campus tour
├── login.html                 # Unified authentication portal (Student / Admin)
├── reset-password.html        # Secure password reset verification flow
├── dashboard.html             # Student dashboard with metrics and recent history
├── register-complaint.html    # Grievance registration form with photo upload
├── my-complaints.html         # Complete complaints ledger with search & filters
├── complaint-details.html     # Live 4-stage audit timeline & printable slip
├── teacher-dashboard.html     # Faculty & Admin resolution management portal
│
├── server.js                  # Express.js REST API server & static host
├── database.js                # SQLite database connection & schema initialization
├── api-client.js              # Frontend API client and Supabase compatibility bridge
├── effects.js                 # Scroll animations, progress bar, parallax & canvas engine
├── theme.css                  # Core design tokens, brand variables & reusable utility classes
├── style.css                  # Landing page styles
├── auth.css / auth.js         # Authentication styling and validation logic
├── dashboard.css / .js        # Student dashboard scripts and styling
├── complaint.css / .js        # Complaint details view and timeline scripts
├── teacher-dashboard.css/.js  # Admin portal styles and ledger controls
│
├── campuscare.db              # Local SQLite database
└── uploads/                   # Stored grievance photo evidence
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** (v18, v20, v22, or v24)
- **npm** (bundled with Node.js)

### 2. Clone & Install
```bash
git clone https://github.com/ShivaniYadav14/CampusCare.git
cd CampusCare
npm install
```

### 3. Start the Server
```bash
npm start
```
The server will start at:
👉 **`http://localhost:3000`** *(or `http://localhost:3001` if port 3000 is occupied)*

---

## 🔑 Default Test Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `student@nitrkl.ac.in` | `student123` | File & track grievances |
| **Student (Demo)** | `1234@gmail.com` | `1234` | File & track grievances |
| **Faculty / Admin** | `admin@nitrkl.ac.in` | `admin123` | Full admin & resolution ledger |

---

## 📄 License & Attribution

Designed and developed for the **National Institute of Technology Rourkela (NITR)** community.
All rights reserved © 2026 NIT Rourkela CampusCare.
