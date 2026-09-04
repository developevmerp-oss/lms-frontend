# 🎨 Ravishing Art Hub — LMS Platform
## Complete Client Demo, Testing & Product Specification Guide

**Platform**: Ravishing Art Hub (Resin Art Mastery & Academy LMS)  
**Version**: 2.0 (Production Release)  
**Target Audience**: Executive Client, Admins, Mentors, and Students  

---

## 🔑 1. Demo Login Credentials

| Role | Portal URL | Demo Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **👑 Admin / Master Mentor** | `/login` | `admin@ravishingarthub.com` | `admin123` | Full control over courses, live classes, attendance rosters, level pricing, badges, student CRM, artwork grading, and sales analytics. |
| **🎓 Student (L0 Fast Start)** | `/login` or `/register` | *Any registered student* | `student123` | Foundational video courses, daily routine checklist, XP gamification, Community Win Wall, Webinar Hub. |
| **🥈 Student (L1 Silver Member)** | `/login` | Upgrade via portal or Admin | Chosen by user | 5 core project courses, Coasters & Ocean Wave masterclasses, Online Live Classes & Attendance tracking. |
| **🥇 Student (L2 Gold Member)** | `/login` | Upgrade via portal or Admin | Chosen by user | 4 master project courses, Geode & 3D Wave clinics, luxury clock fabrication. |
| **💎 Student (L3 Diamond Club)** | `/login` | Upgrade via portal or Admin | Chosen by user | All 30 master courses (Tables, Bridal Varmala, Reels mastery) + Northstar business revenue tracking system. |

---

## 🧭 2. End-to-End Master Testing Workflow (Module by Module)

---

### **MODULE 1: Public Funnel & Webinar Lead Capture**
#### 📱 **Student / Visitor Flow (`/` & `/thank-you`)**
1. Open the landing page (`/`).
2. Explore the **Interactive Canva Presentation**, course curriculum showcase, student reviews, and dynamic social proof counters.
3. Fill out the **Free Webinar Registration Form** (Name, Email, WhatsApp Phone Number, City, Art Goals).
4. Submit ➔ Instant redirection to the **Thank You Page (`/thank-you`)**.
5. On the Thank You page:
   - **Option 1**: Click **"Instant Fast Start Bundle ₹499"** ➔ Opens Razorpay Checkout modal to immediately purchase and unlock Level 0 without waiting.
   - **Option 2**: Click **"Join VIP WhatsApp Community"** or watch the 3-minute preparation workshop video.

#### 👑 **Admin Flow (`/admin/webinar`)**
1. Go to **Admin Nav ➔ Students & CRM ➔ Webinar Leads (`/admin/webinar`)**.
2. See the newly registered student in real-time under **Registrations CRM** with phone number, city, and challenge notes.
3. Switch to **Webinar Events Tab**: Admin can create a new webinar, set scheduled date/time, Zoom meeting link, and VIP WhatsApp URL.

---

### **MODULE 2: Student Dashboard & Daily Gamification (`/student/dashboard`)**
#### 📱 **Student Flow**
1. Log in as a Student (`/student/dashboard`).
2. **Daily Routine Checklist**: Check off daily art habits (e.g. *"Mix resin with 3:1 ratio"*, *"Clean silicone molds"*) ➔ XP counter increments immediately (+25 XP per mission).
3. **Win Wall / Community Feed**:
   - Students post their finished artwork photos, first sales milestones, and comment on other students' achievements.
   - Real-time likes and comment counters update dynamically.
4. **XP & Streak Counter**: Displays current XP, Level status badge, and daily login streak.

#### 👑 **Admin Flow (`/admin/students` & `/admin/dashboard`)**
1. Under **Admin Dashboard**, view real-time platform metrics: total students, revenue, course completion rates, and active streaks.
2. Under **Students CRM**, click any student to view their daily routine completion, earned XP, and activity history.

---

### **MODULE 3: Sequential Curriculum Courses & Direct Upgrades (`/student/courses`)**
#### 📱 **Student Flow**
1. Navigate to **Courses (`/student/courses`)**.
2. **Sequential Level Structure**:
   - **Level 0 (Fast Track)**: 3 foundation courses (Unlocked for L0).
   - **Level 1 (Silver)**: 5 project courses (Coasters, Marbling, Evil Eye, Lotus Pond, Beach Theme).
   - **Level 2 (Gold)**: 4 master courses (Geode Art, Vein Effect, Tree of Life Clock, 3D Waves).
   - **Level 3 (Diamond)**: 18 advanced courses (Tables, Bridal Varmala, Photo Art, YouTube & Reels Mastery).
3. **Direct Tier Purchase**:
   - Locked higher-tier courses display a **`🔒 Purchase & Unlock {Tier} ({Price})`** button.
   - Clicking it triggers the **Razorpay Checkout Modal** allowing students at any level to purchase and immediately unlock higher levels without finishing previous ones.
4. Click an unlocked course ➔ Video player loads YouTube/Vimeo video with lesson notes and assignment upload box.

#### 👑 **Admin Flow (`/admin/courses` & `/admin/levels`)**
1. **Manage Courses (`/admin/courses`)**:
   - Add new courses, re-order courses, change video URLs, or click **`🔄 Sync 30 Curriculum Courses`** to automatically re-seed all 30 courses.
2. **Level Pricing Settings (`/admin/levels`)**:
   - Admin can edit the **Offer Price (₹)** for every level (L0: ₹499, L1: ₹4,999, L2: ₹19,999, L3: ₹59,999).
   - Configure **Razorpay Live / Test API Keys** directly from the UI.

---

### **MODULE 4: Online Classes & Live Attendance Tracking (`/student/classes`)**
#### 📱 **Student Flow**
1. Go to **Live Classes (`/student/classes`)**.
2. View **Upcoming Live Masterclasses** scheduled by the mentor.
3. Click **`🎥 Join Live Class & Mark Attendance`**:
   - **Automatically records attendance** in the database with the student's ID and timestamp.
   - **Awards +50 XP bonus** to the student profile.
   - Launches the Zoom / Google Meet room in a new tab.
   - Displays **`✅ Attended`** badge.
4. Switch to **Past & Replays** tab to watch recorded class replays.

#### 👑 **Admin Flow (`/admin/classes`)**
1. Go to **Admin Nav ➔ Courses & Coaching ➔ Live Classes & Attendance (`/admin/classes`)**.
2. Click **`+ Schedule Live Class`** ➔ Enter Title, Date & Time, Duration, Zoom URL, Replay URL, and Target Tier.
3. Click **`View Attendance Roster`** on any class:
   - View the complete list of students who attended.
   - View their join timestamp, email, and membership tier.
   - Manually toggle attendance status (`Present` / `Absent`).

---

### **MODULE 5: Dedicated Webinar Masterclass Hub (`/student/webinar`)**
#### 📱 **Student Flow**
1. Go to **Webinar (`/student/webinar`)** (accessible to all students & free registrants).
2. View all active webinars created by the admin.
3. Click **`🎥 Join Live Zoom Webinar`** to enter the masterclass.
4. Click **`💬 Join VIP WhatsApp Group`** to open the community invite.
5. Click **`▶️ Watch Prep Video`** to launch the embedded 3-minute workshop video modal.

---

### **MODULE 6: Badges & Gamification Management (`/admin/badges`)**
#### 👑 **Admin Flow**
1. Go to **Admin Nav ➔ Students & CRM ➔ Badges & Rewards (`/admin/badges`)**.
2. **Create New Badge**:
   - Choose icon emoji (🎨, 💰, 💎, 👑, 🔥, 🌊, 💐, ⏰, ⭐, etc.).
   - Set Badge Title, Color Theme, Description, and Points Required.
3. **Award Badges**:
   - Click **`Award to Student`** ➔ Award to **All Enrolled Students** in 1-click or select an individual student from the dropdown.
4. **Edit / Delete Badges**: Modify badge criteria or delete badges in real-time.

#### 📱 **Student Flow**
1. In Student Dashboard / Profile, newly awarded badges appear with custom icons, theme colors, and achievement descriptions.

---

### **MODULE 7: Artwork Submissions & Mentoring Center (`/admin/mentoring`)**
#### 📱 **Student Flow**
1. In any course lesson, student uploads their finished artwork photo with notes and clicks **Submit for Review**.
#### 👑 **Admin Flow**
1. Go to **Admin Nav ➔ Courses ➔ Mentoring Center (`/admin/mentoring`)**.
2. View all pending student artwork submissions with full-resolution images.
3. Grade on 6 core skills (Resin Basics, Mixing, Colour Theory, Finishing, Creativity, Professional Quality).
4. Add feedback and click **Submit Review** ➔ Student is awarded **+500 XP** and receives a real-time notification.

---

### **MODULE 8: Northstar Revenue & Sales Goal System (`/student/northstar`)**
#### 📱 **Student Flow (L3 Members)**
1. Navigate to **Northstar (`/student/northstar`)**.
2. Use the **90-Day Revenue Projection Calculator**: Input product prices (e.g. Clocks ₹3,500, Tables ₹25,000) and target income ➔ Calculates required unit sales per week.
3. Log customer orders in the **Sales Record Tracker**.

#### 👑 **Admin Flow (`/admin/sales` & `/admin/milestones`)**
1. Under **Sales Records (`/admin/sales`)**, view sales generated across all students with buyer details and revenue volume.
2. Under **Milestones (`/admin/milestones`)**, track which students have crossed ₹10,000, ₹50,000, or ₹1,00,000 revenue tiers.

---

## 🔍 3. Software Architecture: Dynamic vs Static Audit

Every core user-facing and admin module is **100% Dynamic and connected to PostgreSQL**:

| Module / Feature | Dynamic Status | Backend Endpoint / DB Model |
| :--- | :--- | :--- |
| **Authentication & Profile** | ✅ 100% Dynamic | `POST /api/auth/login`, `POST /api/auth/register`, `Users` Table |
| **Webinar Leads & CRM** | ✅ 100% Dynamic | `POST /api/webinar/register`, `GET /api/webinar/events`, `WebinarRegistrations` Table |
| **Course Curriculum (30 Courses)** | ✅ 100% Dynamic | `GET /api/courses`, `POST /api/courses`, `Courses` & `Chapters` Table |
| **Level Tier Pricing & Keys** | ✅ 100% Dynamic | `GET /api/admin/levels`, `POST /api/payments/config`, `LevelTiers` Table |
| **Razorpay Checkout & Orders** | ✅ 100% Dynamic | `POST /api/payments/create-order`, `POST /api/payments/verify` |
| **Live Classes & Attendance** | ✅ 100% Dynamic | `GET /api/classes`, `POST /api/classes/:id/join`, `ClassAttendances` Table |
| **Badge Creation & Awarding** | ✅ 100% Dynamic | `GET /api/admin/badges`, `POST /api/admin/badges`, `Badges` & `UserBadges` |
| **Daily Routine & XP Points** | ✅ 100% Dynamic | `PUT /api/admin/students/:id`, `Users.xpPoints` & `points` |
| **Mentoring Reviews & Portfolios**| ✅ 100% Dynamic | `GET /api/portfolio/pending`, `PUT /api/portfolios/:id/review`, `Portfolios` |
| **Community Win Wall & Feed** | ✅ 100% Dynamic | `GET /api/dashboard/wins`, `POST /api/dashboard/wins`, `CommunityWins` |
| **Student Sales & Milestones** | ✅ 100% Dynamic | `POST /api/admin/students/:id/sales`, `SalesRecords` Table |
| **Landing Presentation Slides** | 🎨 Hybrid (Configurable)| Embedded Canva slide presentation player with live interactive fallback |

---

## ⏱️ 4. Recommended 5-Minute Client Demo Script

| Timing | Section | Actions to Demonstrate |
| :--- | :--- | :--- |
| **00:00 - 01:00** | **Public Landing & Lead Funnel** | Fill out the Free Webinar form ➔ Show instant Thank You page with Razorpay ₹499 purchase button. |
| **01:00 - 02:00** | **Student Learning Portal** | Log in as Student ➔ Show 30 level-wise courses, check off daily routine (+25 XP), post on Win Wall. |
| **02:00 - 03:00** | **Live Coaching & Attendance** | Open `/student/classes` ➔ Click "Join Live Class" ➔ Show instant attendance marking (+50 XP). Open `/student/webinar` ➔ Show Zoom link & VIP WhatsApp button. |
| **03:00 - 04:00** | **Admin Control & Attendance Roster**| Log in as Admin ➔ Open `/admin/classes` ➔ Show live student attendance roster. Open `/admin/badges` ➔ Create a custom badge and award to all students in 1 click. |
| **04:00 - 05:00** | **Mentoring Center & CRM** | Open `/admin/mentoring` ➔ Grade a student artwork submission, award 500 XP. Open `/admin/levels` ➔ Show editing tier prices live. |

---
*Generated by Antigravity IDE for Ravishing Art Hub.*
