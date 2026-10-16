# Ravishing Art Hub — LMS Platform
# Comprehensive System Scope, Functional Specifications & Cross-Module Architecture Document

**Document Version:** 2.0 (Complete System Scope)  
**Project Name:** Ravishing Art Hub Learning Management System (LMS) & Community Platform  
**Target Audience:** Client, Product Owners, Administrators, Instructors, and Development Team  
**Last Updated:** October 2026  

---

## 📑 Table of Contents
1. [Executive Summary & System Vision](#1-executive-summary--system-vision)
2. [Platform Architecture & Technology Stack](#2-platform-architecture--technology-stack)
3. [User Roles & Access Permissions Matrix](#3-user-roles--access-permissions-matrix)
4. [Master Module-by-Module Scope Breakdown](#4-master-module-by-module-scope-breakdown)
   - 4.1 [Public Funnel, Landing Page & Webinar Lead Capture](#41-public-funnel-landing-page--webinar-lead-capture)
   - 4.2 [Authentication, Role Verification & Session Security](#42-authentication-role-verification--session-security)
   - 4.3 [Student Dashboard, Daily Routine Checklist & Streak Tracker](#43-student-dashboard-daily-routine-checklist--streak-tracker)
   - 4.4 [Curriculum, Sequential Courses & Video Lesson Player](#44-curriculum-sequential-courses--video-lesson-player)
   - 4.5 [Homework, Assignment Submissions & Artwork Review Portal](#45-homework-assignment-submissions--artwork-review-portal)
   - 4.6 [Live Interactive Classes, Google Meet / Zoom Sync & Attendance](#46-live-interactive-classes-google-meet--zoom-sync--attendance)
   - 4.7 [Membership Tiers, Flexible EMIs & Level Offer Campaigns](#47-membership-tiers-flexible-emis--level-offer-campaigns)
   - 4.8 [Razorpay Gateway, Payment Ledger & Installment Tracker](#48-razorpay-gateway-payment-ledger--installment-tracker)
   - 4.9 [Certificates Engine, Verification QR Codes & PDF Generation](#49-certificates-engine-verification-qr-codes--pdf-generation)
   - 4.10 [Gamification Engine, Badges, Milestones & Skills Radar](#410-gamification-engine-badges-milestones--skills-radar)
   - 4.11 [Community Wins Feed, Social Wall & Peer Engagement](#411-community-wins-feed-social-wall--peer-engagement)
   - 4.12 [Student Art Portfolio Showcase & Public Profiles](#412-student-art-portfolio-showcase--public-profiles)
   - 4.13 [NorthStar Business Tracker, Sales Logging & Orders Ledger](#413-northstar-business-tracker-sales-logging--orders-ledger)
   - 4.14 [Rewards Store, Coin Redemptions & Physical Gifts](#414-rewards-store-coin-redemptions--physical-gifts)
   - 4.15 [Student Affiliate Program, Referral Tracking & Commissions](#415-student-affiliate-program-referral-tracking--commissions)
   - 4.16 [1-on-1 VIP Mentorship Bookings & Calendar Sync](#416-1-on-1-vip-mentorship-bookings--calendar-sync)
   - 4.17 [Leaderboard & Weekly / Monthly Student Competitions](#417-leaderboard--weekly--monthly-student-competitions)
   - 4.18 [Marketing Tracking, Meta Pixel CAPI & Ads Attribution](#418-marketing-tracking-meta-pixel-capi--ads-attribution)
   - 4.19 [Broadcast Notifications & In-App Notification Center](#419-broadcast-notifications--in-app-notification-center)
   - 4.20 [Admin Master Command Center & Platform KPIs](#420-admin-master-command-center--platform-kpis)
5. [Cross-Module Ripple Effect Matrix (How Actions Trigger Other Modules)](#5-cross-module-ripple-effect-matrix)
6. [Hidden, Automated & Background Subsystems](#6-hidden-automated--background-subsystems)
7. [The Complete Student Lifecycle Journey](#7-the-complete-student-lifecycle-journey)
8. [Database Entity Schema & Relational Model](#8-database-entity-schema--relational-model)
9. [REST API Directory & Security Protocols](#9-rest-api-directory--security-protocols)

---

## 1. Executive Summary & System Vision

The **Ravishing Art Hub Learning Management System (LMS)** is an end-to-end, gamified vocational education and creator monetization platform engineered specifically for resin art training, business scaling, and student community mentorship.

Unlike generic video course platforms (such as Udemy or Teachable), the platform combines:
1. **Tier-Gated Curated Curriculum:** Multi-level learning stages (L0 Fast Track, L1 Silver Member, L2 Gold Member, L3 Diamond Club, and L3+ Masters Club).
2. **Dynamic Installment & Pricing Architecture:** Admin-configured fixed or multi-frequency EMIs with real-time recalculations and Razorpay checkout integration.
3. **Action-Driven Gamification:** Automatic XP progression, daily routine habits, streaks, unlocks, badges, skill radars, and leaderboards.
4. **Art Evaluation & Mentorship:** Dual-sided homework submission portals with high-definition photo/video file attachments and mentor critique.
5. **Real-World Business Tracking (NorthStar):** Students log real client sales and commission records into their business tracker to learn profitable resin art commerce.
6. **Conversion & Marketing Engine:** Built-in webinar registration funnels, countdown timers, Meta Pixel Conversion API (CAPI) event tracking, and student affiliate networks.

---

## 2. Platform Architecture & Technology Stack

The platform is deployed using a decoupled, enterprise cloud architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT (Vercel)                        │
│   • Next.js 14 (App Router) + TypeScript + React 18                   │
│   • Tailwind CSS + Lucide Icons + Framer Motion-inspired animations   │
│   • Client-side Meta Pixel SDK + Razorpay Checkout JavaScript SDK      │
│   • Dual-tree parity: /src and /frontend/src                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS REST JSON / JWT
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API (Render)                            │
│   • Node.js (v20+) + Express.js + TypeScript                           │
│   • Sequelize ORM with Auto-Migration Engine (`autoMigrate.ts`)        │
│   • JSON Web Token (JWT) Authentication + BCrypt Hashing               │
│   • Multer Multipart File Uploads (Portfolios, Submissions, Banners)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Connection Pooling / SSL
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   POSTGRESQL RELATIONAL DATABASE                       │
│   • 26 Relational Tables (Users, LevelTiers, Courses, Chapters,        │
│     Assignments, Submissions, StudentInstallmentPlans, Badges, etc.)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. User Roles & Access Permissions Matrix

| Platform Feature / Module | Public Visitor / Lead | Student (L0 Fast Track) | Student (L1 Silver) | Student (L2 Gold) | Student (L3 Diamond) | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Landing Page & Interactive Canva Presentation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Free Webinar Registration | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| L0 Fast Start Foundation Courses | ❌ | ✅ | ✅ | ✅ | ✅ | Full CRUD |
| L1 Silver Projects (Coasters, Marbling, Ocean) | 🔒 Locked | 🔒 Locked | ✅ | ✅ | ✅ | Full CRUD |
| L2 Gold Projects (Geode Art, Clocks, 3D Waves)| 🔒 Locked | 🔒 Locked | 🔒 Locked | ✅ | ✅ | Full CRUD |
| L3 Diamond Masterclasses (Tables, Bridal) | 🔒 Locked | 🔒 Locked | 🔒 Locked | 🔒 Locked | ✅ | Full CRUD |
| Direct Higher-Tier Level Purchase (Full/EMI)| ✅ | ✅ | ✅ | ✅ | ✅ | Set Pricing |
| Daily Routine Checklist & Streak Points | ❌ | ✅ | ✅ | ✅ | ✅ | View Logs |
| Assignment Homework Uploads | ❌ | ✅ | ✅ | ✅ | ✅ | Grade & Award |
| Live Classes & Attendance Tracker | ❌ | View Only | View & Join | View & Join | VIP Join | Schedule/Roster|
| Community Wins Wall (Post & Comment) | ❌ | ✅ | ✅ | ✅ | ✅ | Moderate/Post |
| Certificate Generation & QR Verification | ❌ | L0 Cert | L1 Cert | L2 Cert | L3 Master Cert | Issue/Revoke |
| Portfolio Showcase Gallery | View Public | Upload Art | Upload Art | Upload Art | Upload Art | Moderate |
| NorthStar Revenue & Orders Tracker | ❌ | ❌ | Basic | Standard | Full VIP | View All Sales |
| Student Affiliate Referral Program | ❌ | View Links | Earn 10% | Earn 15% | Earn 20% | Payout Ledger |
| Meta Pixel Tracking Configuration | ❌ | ❌ | ❌ | ❌ | ❌ | Configure |
| Broadcast Push Notifications | ❌ | Receive | Receive | Receive | Receive | Send All |

---

## 4. Master Module-by-Module Scope Breakdown

---

### 4.1 Public Funnel, Landing Page & Webinar Lead Capture
- **Public Routes:** `/`, `/thank-you`, `/webinar`
- **Admin Management Route:** `/admin/webinar`

#### What the Visitor / Student Experiences:
1. **Interactive Hero Section:** Hero headline, academy background reel, live student reviews, dynamic statistics counters (e.g. *15,000+ Enrolled, 4.9★ Rating*).
2. **Interactive Canva & Curriculum Showcase:** Embedded presentation detailing what resin art techniques students master.
3. **Webinar Registration Form:** Captures `Name`, `Email`, `WhatsApp Phone Number`, `City`, and `Primary Art Ambition`.
4. **Thank You Page (`/thank-you`):**
   - Instant conversion prompt: **Fast Track Bundle ₹499** (L0 membership upgrade via Razorpay modal without waiting for the live event).
   - Instant WhatsApp VIP group community invite link.
   - Pre-webinar preparatory video embed.
5. **Automated Tracking Trigger:** Emits Meta Pixel `Lead` and `ViewContent` events.

#### What the Admin Does in `/admin/webinar`:
1. **Webinar Leads CRM:** Real-time search, filter, and pagination of every lead that signed up through the website.
2. **Attendance & Conversion Tagging:** Admins mark leads as `Registered`, `Attended`, `Converted to L0`, `Converted to L1/L3`.
3. **Webinar Event Management:** Create new webinar events, configure scheduled dates/times, Zoom/Google Meet links, and VIP group redirect URLs.
4. **Export Capabilities:** Export filtered attendee contact sheets for WhatsApp broadcast campaigns.

---

### 4.2 Authentication, Role Verification & Session Security
- **Frontend Routes:** `/login`, `/register`, `/student/*`, `/admin/*`
- **Backend Route:** `/api/auth`

#### Functionality & Security Features:
1. **Secure Registration:** Passwords hashed with `bcrypt` (10 rounds). Default initial role: `student`.
2. **JWT Token Management:** Authenticated API requests utilize Bearer Tokens validated by `auth.middleware.ts`.
3. **Role-Based Access Control (RBAC):** Attempts by regular students to access `/admin/*` routes trigger immediate redirection to `/student/dashboard`.
4. **Password Reset & Account Status:** Admins can lock/unlock accounts and update credentials.

---

### 4.3 Student Dashboard, Daily Routine Checklist & Streak Tracker
- **Student Route:** `/student/dashboard`
- **Admin Route:** `/admin/dashboard`, `/admin/students`

#### What the Student Experiences:
1. **At-A-Glance Metric Cards:** Current Membership Tier (with badge), Total Earned Points (XP), Daily Routine Completion %, and Active Learning Streak.
2. **Level Progression Bar:** Visual progress indicator showing required points to graduate to the next tier (e.g. *350 / 500 XP to Silver*).
3. **Daily Routine Habit Checklist:**
   - 4-5 core daily art activities (e.g., *"10 min mold cleaning"*, *"Practice color pigment blending"*, *"Review safety datasheet"*).
   - Checking off habits increments live XP atomically and records a streak count.
4. **Upcoming Live Class Alert:** Dynamic countdown card with a 1-click **Join Class** button.
5. **Active Installment Notice:** If paying via EMI, a notice displays the next due date and a direct **"Pay Next Installment"** button.

#### What the Admin Sees:
1. Real-time platform KPI telemetry (total active students, today's logins, pending reviews).
2. Inspect individual student streaks and routine logs via the Student CRM.

---

### 4.4 Curriculum, Sequential Courses & Video Lesson Player
- **Student Route:** `/student/courses`, `/student/courses/[courseId]`
- **Admin Route:** `/admin/courses`

#### What the Student Experiences:
1. **Sequential Tier Grouping:** Courses categorized under **L0 (Fast Track)**, **L1 (Silver)**, **L2 (Gold)**, **L3 (Diamond)**.
2. **Level Gating & Instant Unlock:**
   - Courses within the student's active tier show an **"Open Course"** button.
   - Courses above their active tier display a locked badge: **`🔒 Upgrade to {Level} to Access`**.
   - Clicking locked courses opens the **Tier Purchase Modal**, allowing direct purchase (one-time or installment) to unlock immediately.
3. **Video Lesson Player:**
   - High-definition video player supporting YouTube, Vimeo, and custom MP4 streams.
   - Chapter sidebar navigation with lesson completion checkboxes.
   - Downloadable lesson resources (PDF blueprints, material supply lists, vendor contact sheets).
   - Course completion progress bar auto-updating as lessons are finished.

#### What the Admin Does in `/admin/courses`:
1. **Course Builder:** Create, edit, and delete courses with custom thumbnails, descriptions, required level tier, and category tags.
2. **Chapter & Lesson Manager:** Add chapters, reorder lessons, attach video embed links, specify durations, and upload downloadable PDFs.
3. **Student Enrollment Overrides:** Manually grant course access to individual students regardless of tier.

---

### 4.5 Homework, Assignment Submissions & Artwork Review Portal
- **Student Route:** `/student/tasks`
- **Admin Route:** `/admin/assignments`

#### What the Student Experiences:
1. **Active Task List:** Browse practical resin assignments linked to enrolled courses (e.g., *"Pour 4 Coasters without air bubbles"*).
2. **Submission Form:**
   - Upload high-resolution photos/videos of their finished resin piece.
   - Enter notes, resin mixing ratios used, pigments applied, and questions for the mentor.
3. **Status Tracker:** Live submission status badges: `⏳ Pending Review`, `✅ Approved (+250 XP)`, `🔄 Re-Submit Requested`.
4. **Mentor Feedback View:** Read personalized critique and tips from Vrajangna Ma'am.

#### What the Admin Does in `/admin/assignments`:
1. **Submissions Review Desk:** Review pending student artworks with high-resolution image viewers.
2. **Grading & XP Allocation:**
   - **Approve:** Awards custom XP (+100 to +500 XP) and triggers in-app student praise notification.
   - **Request Revision:** Provide constructive feedback and allow the student to upload an updated version.
3. **Auto-Post to Community Win:** Option to publish exceptional homework directly to the platform Community Win Wall.

---

### 4.6 Live Interactive Classes, Google Meet / Zoom Sync & Attendance
- **Student Route:** `/student/classes`
- **Admin Route:** `/admin/classes`

#### What the Student Experiences:
1. **Class Schedule:** Timeline of upcoming masterclasses, Q&A clinics, and product launch workshops.
2. **Tier-Based Access:** Classes tagged with required minimum tier (e.g. *L1+ Members Only*).
3. **1-Click Launch:** Direct access to Google Meet, Zoom, or YouTube Live meeting URLs when the class goes live.
4. **Attendance History:** Review past classes attended and earned attendance XP points.

#### What the Admin Does in `/admin/classes`:
1. **Class Scheduler:** Title, description, date/time, duration, meeting link, and minimum required tier level.
2. **Attendance Marking Desk:**
   - Search student by name or email.
   - One-click toggle: `Present` / `Absent`.
   - **Auto-XP Reward:** Marking a student present awards +100 XP automatically and notifies the student.
3. **Recording Embed:** Upload the video recording link after the class concludes so students can replay it anytime.

---

### 4.7 Membership Tiers, Flexible EMIs & Level Offer Campaigns
- **Student Component:** `TierPurchaseModal.tsx`
- **Admin Routes:** `/admin/levels`, `/admin/offers`

#### Features & Functionalities:
1. **Dynamic Tier Catalog:**
   - **L0 Fast Track:** Foundational resin basics & tool selection.
   - **L1 Silver Member:** Coasters, marbling, beach art.
   - **L2 Gold Member:** Geode art, 3D ocean waves, luxury clocks.
   - **L3 Diamond Club:** River tables, bridal varmala preservation, concrete candles, marketing mastery.
   - **L3+ Masters Club:** Bespoke mentor license & city workshop rights.
2. **Admin-Configured Total Installments:**
   - Admin sets the fixed installment count (e.g. 2, 3, 4, 5, 6, etc.) per level.
   - **Students cannot alter the installment count** — it is fetched directly from the backend.
3. **Multi-Frequency EMI Options:**
   - Admin enables permitted payment intervals: Weekly, Bi-Weekly, Monthly, Every 2 Months, Every 3 Months, Every 6 Months.
   - Per-frequency installment counts and price calculations auto-calculate.
4. **Level Offers & Festival Campaigns (`/admin/offers`):**
   - Create percentage or flat discounts (e.g. *Diwali Offer: 20% OFF*).
   - Start and end date countdown timers that trigger glowing badges across the student UI.

---

### 4.8 Razorpay Gateway, Payment Ledger & Installment Tracker
- **Student Component:** Razorpay modal checkout integration
- **Admin Routes:** `/admin/payments`, `/admin/sales`

#### Features & Functionalities:
1. **Razorpay Standard & Webhook Integration:**
   - Full support for UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.
   - Real-time cryptographic signature verification (`crypto.createHmac("sha256")`).
2. **Installment Lifecycle Management (`StudentInstallmentPlans`):**
   - 1st installment payment unlocks the tier immediately.
   - Automated schedule calculation: `nextDueDate = DOP + Frequency Interval`.
   - Admin monitor tracks `Active`, `Overdue`, and `Completed` installment accounts.
3. **Platform Sales Ledger (`/admin/sales`):** Complete transaction audit trail with transaction IDs, gross revenue, student email, and invoice receipts.
4. **Gateway Configuration (`/admin/payments`):** Admin can update Razorpay Key ID and Key Secret directly from the dashboard.

---

### 4.9 Certificates Engine, Verification QR Codes & PDF Generation
- **Student Route:** `/student/certificates`
- **Admin Route:** `/admin/certificates`

#### What the Student Experiences:
1. **Certificate Wall:** View official digital certificates earned upon completing levels or special workshops.
2. **Download & Print:** High-resolution digital PDF download with gold foil academy seal and signatures.
3. **Public Verification Code & QR:** Each certificate has a unique tamper-proof ID (e.g. `RAH-CERT-2026-8492`) verifiable on the public website.

#### What the Admin Does in `/admin/certificates`:
1. **Certificate Generator:** Issue certificates manually or configure automated issuance upon student reaching 100% course completion + tier XP threshold.
2. **Revocation & Audit:** Admin can revoke or regenerate certificates if required.

---

### 4.10 Gamification Engine, Badges, Milestones & Skills Radar
- **Student Route:** `/student/dashboard`, `/student/profile`
- **Admin Routes:** `/admin/badges`, `/admin/milestones`

#### Features & Functionalities:
1. **Gamification Metric Engine:**
   - **XP Points:** Incremented atomically for submissions (+250 XP), daily routines (+25 XP), live classes (+100 XP), sales records (+500 XP).
   - **Badges:** Visual badges (e.g., *Resin Pioneer*, *Flawless Finish*, *Master Artisan*, *Sales Champion*).
2. **Milestones Roadmap (`/admin/milestones`):** Step-by-step career path (e.g., *First Cure*, *First Customer Sale*, *Exhibition Participant*).
3. **Skills Radar:** Hexagonal skill distribution showing student mastery across: *Safety & Ratios*, *Pigment Control*, *3D Waves*, *Geode Geometry*, *Finishing & Polishing*, *Business Marketing*.

---

### 4.11 Community Wins Feed, Social Wall & Peer Engagement
- **Student Route:** `/student/feed`
- **Admin Route:** `/admin/community-wins`

#### What the Student Experiences:
1. **Social Feed:** Share completed artwork pictures, celebrate client orders, and ask peer questions.
2. **Engagement:** Like posts, comment with tips, and cheer fellow artists.
3. **Automated Milestone Broadcasts:** The platform automatically publishes celebrations when students unlock new tiers or make their first ₹10,000 in sales.

#### What the Admin Does in `/admin/community-wins`:
1. Pin mentor announcements to the top of the feed.
2. Moderate posts, remove inappropriate content, or feature top student artworks.

---

### 4.12 Student Art Portfolio Showcase & Public Profiles
- **Student Route:** `/student/portfolio`
- **Admin Route:** `/admin/students`

#### What the Student Experiences:
1. **Personal Gallery Builder:** Upload finished artwork collections with pricing, dimensions, resin brand used, and creation technique tags.
2. **Shareable Public Link:** Share their digital portfolio (`/portfolio/student-username`) with potential art buyers and corporate gift clients.

#### What the Admin Does:
1. Review student portfolio pieces to select featured artworks for academy marketing.

---

### 4.13 NorthStar Business Tracker, Sales Logging & Orders Ledger
- **Student Route:** `/student/northstar`
- **Admin Route:** `/admin/sales`

#### What the Student Experiences:
1. **Business Orders Tracker:** Log real client orders (Client Name, Product Type, Sale Price ₹, Advance Received, Delivery Deadline).
2. **Revenue Analytics:** Monthly resin art revenue chart, profit margins, and cumulative earnings towards their financial goals.
3. **Gamified XP Bonus:** Every verified client sale recorded awards **+500 XP** to celebrate commercial success.

---

### 4.14 Rewards Store, Coin Redemptions & Physical Gifts
- **Student Route:** `/student/rewards`
- **Admin Route:** `/admin/rewards`

#### What the Student Experiences:
1. **Rewards Catalog:** Redeem accumulated XP points for resin supplies (e.g. *Silicone Geode Molds, Metallic Mica Powders, Luxury Pigment Pastes, Academy Apron*).
2. **Order Status:** Track shipped physical art gifts with tracking codes.

#### What the Admin Does in `/admin/rewards`:
1. Set reward items, inventory quantities, and coin point costs.
2. Process and approve redemptions, enter shipping tracking numbers.

---

### 4.15 Student Affiliate Program, Referral Tracking & Commissions
- **Student Route:** `/student/affiliate`
- **Admin Route:** `/admin/sales`

#### What the Student Experiences:
1. **Unique Referral Links:** Shareable links to webinars, courses, and level upgrades.
2. **Commission Dashboard:** Real-time tracking of referral clicks, registered leads, and commissions earned (10% to 20% depending on tier).
3. **Payout Requests:** Request bank transfer or UPI payout once minimum threshold is reached.

---

### 4.16 1-on-1 VIP Mentorship Bookings & Calendar Sync
- **Student Route:** `/student/events`
- **Admin Route:** `/admin/mentoring`

#### What the Student Experiences:
1. Diamond & Masters Club members book exclusive 30-minute 1-on-1 video calls with Vrajangna Ma'am for business guidance and troubleshooting.
2. Calendar booking picker with automated Google Calendar reminders.

---

### 4.17 Leaderboard & Weekly / Monthly Student Competitions
- **Student Route:** `/student/leaderboard`
- **Admin Route:** `/admin/leaderboard`

#### Features & Functionalities:
1. Dynamic top-10 rankings based on accumulated XP.
2. Weekly and monthly leader badges for top artists.
3. Filtering by level tier so beginners compete fairly with peers.

---

### 4.18 Marketing Tracking, Meta Pixel CAPI & Ads Attribution
- **Student / Public Action:** Automated event emission across all pages
- **Admin Route:** `/admin/marketing`

#### Features & Functionalities:
1. **Meta Pixel & Conversion API (CAPI) Integration:**
   - Admin inputs Meta Pixel ID in `/admin/marketing` and toggles active status.
   - Zero hardcoding — dynamically fetched from backend on page load.
2. **Standard Events Tracked Automatically:**
   - `PageView`: Tracked across every student and landing page.
   - `ViewContent`: Tracked on course and tier catalog previews.
   - `Lead`: Fired upon webinar form submission.
   - `CompleteRegistration`: Fired upon account creation.
   - `InitiateCheckout`: Fired when opening Razorpay tier checkout.
   - `Purchase`: Fired upon verified payment completion with exact transaction ID, currency, and value.

---

### 4.19 Broadcast Notifications & In-App Notification Center
- **Student Route:** `/student/notifications`
- **Admin Route:** `/admin/notifications`

#### Features & Functionalities:
1. **Categorized In-App Notifications:** Alerts for *Milestones*, *Classes*, *Payments*, *Homework Feedback*, and *System Announcements*.
2. **Admin Broadcast Center:** Admin composes platform-wide alerts with custom deep links sent instantly to all or filtered student tiers.
3. **Read / Unread State:** Real-time badge counter on student navigation header.

---

### 4.20 Admin Master Command Center & Platform KPIs
- **Admin Route:** `/admin/dashboard`

#### Features & Functionalities:
1. **Executive Revenue Cards:** Total Platform Revenue, Active Recurring Installments, This Month's Enrollments, Total Students.
2. **Action Queues:** Direct counters for pending assignment reviews, pending reward redemptions, and overdue installments.
3. **Quick-Action Shortcuts:** Fast buttons to schedule classes, create festival offers, or broadcast announcements.

---

## 5. Cross-Module Ripple Effect Matrix

This matrix explains how an action in one module systematically affects and triggers changes across other modules:

```
┌─────────────────────────────────┐
│     STUDENT OR ADMIN ACTION     │
└────────────────┬────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     CROSS-MODULE DOMINO EFFECT                                 │
├───────────────────────────────┬────────────────────────────────────────────────────────────────┤
│ 1. Student Purchases Level    │ ➔ Razorpay verifies signature                                  │
│    (Full or 1st Installment)  │ ➔ PaymentTransaction & SalesRecord created in Admin Sales      │
│                               │ ➔ User.membershipLevel upgraded (e.g. L0 ➔ L2)                 │
│                               │ ➔ UserCourse enrolls student in all courses matching tier      │
│                               │ ➔ StudentInstallmentPlan record initialized (if EMI)           │
│                               │ ➔ CommunityWin auto-posted to public feed                      │
│                               │ ➔ Notification created: "🎉 Welcome to Gold Member!"           │
│                               │ ➔ Meta Pixel 'Purchase' conversion event emitted               │
├───────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ 2. Admin Approves Homework    │ ➔ Submission status changes to 'approved'                      │
│    in `/admin/assignments`    │ ➔ User.points increments atomically (+250 XP)                  │
│                               │ ➔ Evaluates points vs LevelTier threshold for level graduation │
│                               │ ➔ Course progress bar advances                                 │
│                               │ ➔ Student Leaderboard ranking recalculates                     │
│                               │ ➔ In-app Notification pushed with mentor praise & notes       │
├───────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ 3. Student Completes Daily    │ ➔ User.streak increments by +1                                 │
│    Routine Checklist          │ ➔ Daily XP awarded (+25 XP)                                    │
│                               │ ➔ Leaderboard position updates                                 │
│                               │ ➔ Checks eligibility for '7-Day Consistency' Badge             │
├───────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ 4. Admin Creates Offer in     │ ➔ LevelOffer table records campaign discount                   │
│    `/admin/offers`            │ ➔ TierPurchaseModal price displays discount badge & countdown   │
│                               │ ➔ Locked course cards display discounted purchase prices       │
│                               │ ➔ Landing page pricing section shows promotional pricing       │
├───────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ 5. Admin Marks Class          │ ➔ ClassAttendance record logged with timestamp                 │
│    Attendance                 │ ➔ Student receives +100 Attendance XP                          │
│                               │ ➔ Notification sent: "✅ Attendance logged for Ocean Masterclass"│
│                               │ ➔ Leaderboard updates                                          │
├───────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ 6. Student Logs Customer Sale │ ➔ Record saved in NorthStar sales ledger                       │
│    in NorthStar Tracker       │ ➔ User receives +500 XP Business Champion reward               │
│                               │ ➔ Automatic post generated on Community Wins Feed              │
│                               │ ➔ Admin Sales overview increments student sales metric         │
├───────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ 7. Installment Due Date Pass  │ ➔ Automated status changes to 'overdue'                        │
│    Without Payment            │ ➔ Student dashboard displays high-priority warning banner      │
│                               │ ➔ Notification sent with direct payment link                   │
│                               │ ➔ Admin Payments shows student in Overdue Filter               │
└───────────────────────────────┴────────────────────────────────────────────────────────────────┘
```

---

## 6. Hidden, Automated & Background Subsystems

1. **Auto-Migration Engine (`autoMigrate.ts`):** Automatically executes declarative PostgreSQL schema updates upon backend startup (e.g., adding `totalInstallments`, `installmentPlans`, `isPublished` columns without downtime or data loss).
2. **Dynamic Cache Invalidation (`clearLevelTierCache`):** Level pricing, tiers, and festival offers are cached in memory for sub-millisecond responses. Whenever an admin creates or edits a tier in `/admin/levels`, the cache is instantly cleared and regenerated.
3. **Real-Time Installment Due Date Computer (`computeNextDueDate`):** Automatically parses frequency intervals (e.g. `monthly` -> +30 days, `biweekly` -> +14 days, `2months` -> +60 days) to set accurate due dates upon every payment.
4. **Tamper-Proof Razorpay Signature Verification:** Cryptographic HMAC SHA256 verification prevents client-side payment spoofing.
5. **Meta Pixel Dynamic Config Delivery:** Injects live Meta Pixel tracking scripts dynamically only when enabled by the admin in `/admin/marketing`, avoiding redundant browser network overhead when disabled.

---

## 7. The Complete Student Lifecycle Journey

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 1. DISCOVERY & WEBINAR REGISTRATION                                                  │
│    Visitor views landing page -> registers for free webinar -> Meta Pixel fires Lead │
└──────────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 2. THANK YOU PAGE & L0 CONVERSION                                                    │
│    Visitor joins WhatsApp VIP group OR buys Instant Fast Start Bundle ₹499 (L0)       │
└──────────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 3. ONBOARDING & DAILY HABITS                                                         │
│    Student logs in -> checks off daily resin routines -> builds streak -> gains XP   │
└──────────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 4. COURSEWORK & ASSIGNMENTS LOOP                                                     │
│    Watches video lessons -> pours resin coasters -> uploads homework photos          │
│    -> Mentor grades & awards +250 XP                                                 │
└──────────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 5. TIER UPGRADE (ONE-TIME OR EMI)                                                    │
│    Student upgrades to L1 / L2 / L3 -> selects monthly EMI -> unlocks master courses │
└──────────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 6. LIVE CLASSES & MENTORSHIP                                                         │
│    Attends live masterclasses -> gets attendance points -> participates in Q&A       │
└──────────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 7. PORTFOLIO & REAL SALES (NORTHSTAR)                                                │
│    Uploads finished art to public portfolio -> logs real client sale in NorthStar    │
│    -> community win celebrates achievement -> earns certificate & badges             │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Database Entity Schema & Relational Model

The backend leverages 26 interconnected models:

1. **`Users`**: Core student & admin profiles (`id`, `name`, `email`, `password`, `role`, `membershipLevel`, `points`, `streak`, `phone`, `membershipExpiresAt`).
2. **`LevelTiers`**: Master membership tier configurations (`code`, `name`, `price`, `minPoints`, `maxPoints`, `totalInstallments`, `installmentPlans`, `installmentsEnabled`, `isPublished`).
3. **`LevelOffers`**: Festival campaigns (`levelCode`, `discountType`, `discountValue`, `startDate`, `endDate`, `isActive`, `title`).
4. **`Courses`**: Learning curricula (`title`, `slug`, `description`, `requiredLevel`, `thumbnail`, `isPublished`, `category`).
5. **`Chapters`**: Lessons within courses (`courseId`, `title`, `videoUrl`, `duration`, `order`, `resources`).
6. **`UserCourses`**: Student enrollments and completion progress (`userId`, `courseId`, `progress`, `status`).
7. **`Assignments`**: Course homework prompts (`courseId`, `title`, `description`, `points`, `dueDate`).
8. **`Submissions`**: Student uploaded homework (`assignmentId`, `userId`, `fileUrl`, `notes`, `status`, `feedback`, `gradePoints`).
9. **`LiveClasses`**: Live Zoom/Meet events (`title`, `scheduledAt`, `durationMinutes`, `meetingUrl`, `requiredTier`, `recordingUrl`).
10. **`ClassAttendances`**: Attendance records (`classId`, `userId`, `status`, `pointsAwarded`).
11. **`Certificates`**: Issued credentials (`userId`, `levelCode`, `certificateCode`, `issuedAt`, `pdfUrl`, `verificationUrl`).
12. **`Badges`**: Gamification badges (`name`, `icon`, `criteriaType`, `thresholdValue`, `description`).
13. **`UserBadges`**: Badges unlocked by students (`userId`, `badgeId`, `unlockedAt`).
14. **`Milestones`**: Career steps (`title`, `targetXP`, `icon`, `order`, `description`).
15. **`CommunityWins`**: Public achievement feed (`userId`, `studentName`, `title`, `description`, `imageUrl`, `likesCount`).
16. **`Portfolios`**: Student art pieces (`userId`, `title`, `description`, `imageUrl`, `priceTag`, `techniqueTags`).
17. **`Rewards`**: Points redemption items (`title`, `costXP`, `stockQuantity`, `imageUrl`).
18. **`Notifications`**: User alerts (`userId`, `title`, `message`, `type`, `link`, `isRead`).
19. **`PaymentTransactions`**: Transaction ledger (`userId`, `orderId`, `paymentId`, `amount`, `status`, `tierCode`, `isInstallment`).
20. **`SalesRecords`**: Revenue audit items (`userId`, `amount`, `productName`, `category`, `paymentMethod`).
21. **`StudentInstallmentPlans`**: Recurring EMI tracker (`userId`, `tierCode`, `planName`, `frequency`, `installmentAmount`, `totalInstallments`, `paidInstallments`, `nextDueDate`, `status`).
22. **`Skills`**: Competency radar dimensions (`userId`, `category`, `score`).
23. **`WebinarEvents`**: Webinar funnel configurations (`title`, `date`, `time`, `zoomLink`, `whatsappGroupUrl`).
24. **`WebinarRegistrations`**: Leads captured from landing page (`name`, `email`, `phone`, `city`, `ambition`, `attended`, `converted`).
25. **`MarketingTrackingSettings`**: Meta Pixel & CAPI parameters (`platform`, `pixelId`, `enabled`, `eventsConfig`).
26. **`Affiliates`**: Referral tracking and earnings (`userId`, `referralCode`, `totalEarned`, `pendingPayout`).

---

## 9. REST API Directory & Security Protocols

### Public Endpoints
- `GET /api/dashboard/levels` — Public tier catalog & pricing
- `GET /api/dashboard/offers` — Active campaign discounts
- `GET /api/dashboard/community-wins` — Public achievement feed
- `POST /api/webinars/register` — Public webinar lead capture
- `GET /api/certificates/verify/:code` — Public certificate verification

### Student Endpoints (Protected by JWT)
- `GET /api/dashboard/student` — Dashboard metrics & routine
- `GET /api/courses` — Courses filtered by enrollment & level
- `POST /api/assignments/submit` — Artwork upload & submission
- `GET /api/classes/upcoming` — Upcoming live masterclasses
- `POST /api/payments/create-order` — Razorpay order generation
- `POST /api/payments/verify` — Razorpay signature verification & tier upgrade
- `GET /api/payments/my-installments` — Student's active installment plans
- `POST /api/portfolio` — Upload artwork to gallery
- `GET /api/notifications` — In-app alerts

### Admin Endpoints (Protected by Admin Role)
- `GET /api/admin/students` — Complete student directory & CRM
- `POST /api/admin/levels` — Create & modify tier prices and installment plans
- `POST /api/admin/offers` — Launch festival discount offers
- `POST /api/admin/classes` — Schedule live classes & mark attendance
- `POST /api/admin/notifications/broadcast` — Send system-wide announcements
- `GET /api/admin/marketing-tracking` — Meta Pixel tracking settings
- `POST /api/admin/marketing-tracking` — Save/enable Pixel ID and events

---

## 10. Conclusion & Quality Seal

This platform represents a complete, cohesive resin art training ecosystem. Every module works harmoniously with others: marketing feeds into webinars, webinars convert into level enrollments, level enrollments unlock sequential courses, course progress fuels homework reviews, homework reviews award XP, XP advances student ranking and certifications, and business trackers validate real-world commercial success.

---
*Document compiled and verified for Ravishing Art Hub LMS.*
