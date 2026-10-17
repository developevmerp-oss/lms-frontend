# Enterprise Learning Management, Community & Creator Monetization Platform
## Master Scope of Work (SOW), Functional Specifications & Product Proposal

**Document Reference:** SOW-LMS-ENTERPRISE-2026  
**Document Type:** Commercial Product Proposal & Scope of Work (SOW)  
**Applicable For:** New Academy / Educational Creator / EdTech Organization  
**Platform Classification:** Enterprise Academy LMS, Community Hub & Course Monetization Engine (Full Source Code & Dedicated Server Deployment)  
**Release Version:** Enterprise Edition 2.0  

---

## Executive Presentation

This document details the complete, turnkey scope of work for the **Enterprise Academy LMS & Community Monetization Platform**. 

Designed for high-growth academies, coaches, vocational training centers, and creative educators, this platform is not merely a video-hosting system. It is a **fully integrated business engine** combining:
- **Public Lead Capture & High-Converting Webinar Funnels**
- **Sequential Tier-Gated Curricula (L0 to L3+ Masterclasses)**
- **Flexible Recurring Installment (EMI) Billing via Razorpay**
- **Action-Driven XP Gamification, Streaks & Skill Radars**
- **Dual-Sided Artwork / Homework Evaluation Portal**
- **Live Class Video Management & Attendance XP Rewards**
- **Tamper-Proof Digital Certificates with QR Code Verification**
- **Student Art Portfolio Showcases & Commercial Sales Loggers**
- **Internal Affiliate Referral Program & Meta Pixel Ad Attribution**

---

# SECTION 1: Delivery Model, Complete Source Code Ownership & Deployment

The platform is delivered with **100% Full Source Code Ownership (`src` and everything)** and deployed directly on your own purchased server:
1. **100% Full Source Code Handover (`src`):** Complete Next.js frontend and Node.js backend codebase delivered to you with full intellectual property ownership and zero vendor lock-in.
2. **Dedicated Deployment on Client-Purchased Server:** The client purchases their own cloud server / VPS (AWS, DigitalOcean, VPS, Render, Hostinger). Our engineering team handles complete production deployment and configuration directly on your server.
3. **Custom Academy Identity & Domain:** Live under your custom domain (e.g. `academy.yourbrand.com`) with custom logos, brand colors, typography, and dark/light accents.
4. **Dedicated Payment Gateway (0% Platform Fee):** Direct integration with your organization's Razorpay account (Funds deposit directly into your bank account with zero intermediate platform commission).
5. **Independent Database & Data Sovereignty:** Isolated PostgreSQL database containing all student records, transactions, videos, and portfolio files on your private server.
6. **Customizable Level Tiers:** Configure any number of membership tiers (e.g., Bronze, Silver, Gold, Platinum, VIP) with customized naming, pricing, and point requirements.

---

# SECTION 2: User Roles & Access Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SUPER ADMINISTRATOR                             │
│   • Complete control over pricing, tiers, installments & gateway keys │
│   • Full student directory CRM (points override, tier promotions)      │
│   • Curriculum builder (courses, chapters, video links, attachments)   │
│   • Homework review desk (grading, feedback, XP awards)                │
│   • Broadcast notification center & marketing tracking setup           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│        ENROLLED STUDENTS         │        │      PUBLIC VISITORS / LEADS     │
│   • Access level-gated courses   │        │   • Landing page presentation    │
│   • Daily routine habit tracker  │        │   • Webinar registration form    │
│   • Submit homework for critique │        │   • Instant L0 Fast Start bundle │
│   • Join scheduled live classes  │        │   • VIP WhatsApp group invite    │
│   • Pay via 1-time or auto-EMIs  │        │   • Public certificate check     │
│   • Public portfolio & sales log │        │   • Public student portfolio view│
└──────────────────────────────────┘        └──────────────────────────────────┘
```

---

# SECTION 3: Complete Module-by-Module Scope

---

### Module 1: High-Converting Public Funnel & Webinar Lead Engine
*Purpose: Attract, capture, and convert cold traffic into paid students.*

#### 👑 What the Academy Administrator Does:
- **Webinar Event Management:** Schedule upcoming webinars, set live dates, countdown timers, Zoom/Google Meet links, and WhatsApp community links.
- **Lead Capture CRM:** View, search, and filter every lead who registered via the website with name, email, WhatsApp phone number, city, and primary ambition.
- **Export & Attendance Tracking:** Mark leads as `Attended`, `Absent`, or `Converted`, and export clean Excel/CSV sheets for automated follow-up campaigns.

#### 🎓 What the Student / Visitor Experiences:
- **Interactive Academy Landing Page:** High-impact hero section, video reels, dynamic student counter badges, and curriculum preview.
- **Interactive Presentation Embed:** Embedded digital slide deck walking prospective students through learning outcomes.
- **One-Click Webinar Registration:** Fast, mobile-optimized registration capturing contact details.
- **High-Conversion Thank-You Page:**
  - Option to purchase an **Instant Fast Start Starter Bundle** (e.g. ₹499) immediately via Razorpay.
  - One-click button to join the academy's official **VIP WhatsApp Community**.
- **Automated Ad Tracking:** Fires Meta Pixel `Lead` and `ViewContent` events seamlessly.

---

### Module 2: Student Command Center & Daily Habit Gamification
*Purpose: Maximize daily active usage (DAU), student retention, and progress transparency.*

#### 👑 What the Academy Administrator Does:
- **Platform Telemetry Overview:** Real-time dashboard showing active student count, today's logins, average streak length, and course progress statistics.
- **Student Gamification Inspection:** View individual student habits, check-off history, and total accumulated XP.

#### 🎓 What the Student / Visitor Experiences:
- **Live Progress Metric Cards:** Displays current tier badge, earned XP points, daily routine completion percentage, and active streak counter.
- **Tier Graduation Progress Bar:** Visual progress bar showing remaining points needed to advance to the next academy level.
- **Daily Routine Checklist:**
  - Interactive daily task cards (e.g., *"Tool sterilization"*, *"Ratio calculation"*, *"15 min color blending"*).
  - Checking off items awards atomic XP (+25 XP per task) and updates their daily streak counter.
- **Actionable Notification Banners:** Alerts for upcoming live classes (with countdowns) and active installment payment schedules.

---

### Module 3: Tier-Gated Curriculum & Video Masterclass Player
*Purpose: Deliver organized, sequential learning with built-in upsell triggers.*

#### 👑 What the Academy Administrator Does:
- **Course Builder:** Create, edit, and organize courses with custom video thumbnails, titles, descriptions, category tags, and required membership tier.
- **Chapter & Lesson Manager:** Add structured chapters, attach video streams (YouTube, Vimeo, or custom MP4 CDN), input duration, and upload downloadable PDF resources (blueprints, formulas, material vendor directories).
- **Manual Enrollment Overrides:** Manually grant or revoke course access for individual students directly from the CRM.

#### 🎓 What the Student / Visitor Experiences:
- **Structured Learning Categories:** Courses organized sequentially by tier level (e.g., Foundation ➔ Intermediate ➔ Advanced ➔ Masterclass).
- **Intelligent Level Locking:**
  - Unlocked courses display an **"Open Masterclass"** button.
  - Higher-tier courses display a sleek lock badge: **`🔒 Locked — Upgrade to {Level}`**.
  - Clicking locked masterclasses triggers the **Tier Purchase Modal**, allowing instant purchase or installment enrollment.
- **Distraction-Free Video Player:**
  - High-definition video player with chapter progress sidebar.
  - Checkbox next to each lesson to mark as completed.
  - Downloadable resource attachments tab.

---

### Module 4: Artwork & Assignment Evaluation Portal
*Purpose: Provide personalized mentorship, verify practical skills, and ensure course quality.*

#### 👑 What the Academy Administrator Does:
- **Pending Submissions Desk:** Central review inbox of all student homework submissions across all courses.
- **Artwork Inspection Viewer:** High-resolution zoomable viewer for student uploaded photos and video clips.
- **Grading & Critique Console:**
  - **Approve:** Assign custom XP (+100 to +500 XP) and send congratulations notification.
  - **Request Revision:** Provide constructive feedback and allow the student to re-upload revised work.
- **Promote to Community:** One-click button to feature outstanding submissions directly on the public Community Win Wall.

#### 🎓 What the Student / Visitor Experiences:
- **Assignment Prompt:** Clear project brief inside each course detailing required practical exercises and photos needed.
- **Submission Form:** Drag-and-drop uploader for multiple photos/videos, plus text notes detailing material ratios used.
- **Live Status Badges:** Track submission status (`Pending Review`, `Approved (+XP)`, `Revision Needed`).
- **Mentor Feedback Card:** Read personalized feedback and suggestions directly from the mentor.

---

### Module 5: Live Interactive Masterclasses & Attendance Tracking
*Purpose: Host live sessions, record attendance, and gamify workshop participation.*

#### 👑 What the Academy Administrator Does:
- **Class Scheduler:** Schedule live webinars, Q&A sessions, and product clinics with date, time, duration, meeting link (Google Meet / Zoom / YouTube Live), and required minimum tier.
- **Attendance Roster:** Search students and mark attendance with one click (`Present` / `Absent`).
- **Automated XP Award:** Marking a student present automatically credits **+100 Attendance XP** to their account.
- **Session Replay Embed:** Upload video recording link after the class so students can re-watch indefinitely.

#### 🎓 What the Student / Visitor Experiences:
- **Live Class Schedule:** Chronological timeline of upcoming classes with countdown timers.
- **One-Click Meeting Launch:** Direct access button opens the meeting link when the class starts.
- **Attendance Record:** Track attended sessions and earned participation XP.

---

### Module 6: Membership Levels, EMI Installments & Festival Offers
*Purpose: Maximize course sales with dynamic pricing, recurring installment plans, and seasonal offers.*

#### 👑 What the Academy Administrator Does:
- **Tier Configuration Console (`/admin/levels`):**
  - Define Tier Name, Code, Base Price, Icon, Validity in Days, and Published Status.
- **Admin-Controlled Fixed Total Installments:**
  - Admin defines the **Total Number of Installments** (e.g. 2, 3, 4, 5, 6, etc.).
  - **Students cannot alter the installment count** — it is strictly locked by the academy.
- **Multi-Frequency Installment Options:**
  - Enable permitted frequencies: Weekly, Bi-Weekly, Monthly, Every 2 Months, Every 3 Months, Every 6 Months.
  - Configure specific installment counts per frequency with live price-per-cycle previews.
- **Campaign & Festival Offers (`/admin/offers`):**
  - Launch percentage or flat discount campaigns (e.g. *Festive 20% OFF*).
  - Configure start and end dates with automated promotional countdown badges.

#### 🎓 What the Student / Visitor Experiences:
- **Tier Purchase Modal:**
  - Switch between **Pay in Full** or **Pay in Installments (Easy EMIs)**.
  - Displays the academy's official fixed installment breakdown (e.g., *Divided into 3 equal installments of ₹20,000 each*).
  - Select from allowed payment frequencies in a clean dropdown.
  - Clear schedule preview: 1st installment due today (DOP), 2nd installment due DOP + 1 month, etc.

---

### Module 7: Razorpay Payment Gateway & Recurring Installment Ledger
*Purpose: Frictionless UPI and card payments with end-to-end transaction security.*

#### 👑 What the Academy Administrator Does:
- **Gateway Keys Configuration (`/admin/payments`):** Safely update Razorpay Key ID and Secret directly from the dashboard.
- **Installment Ledger (`/admin/payments`):** Monitor all ongoing student installment plans:
  - Filter by `Active`, `Overdue`, and `Completed`.
  - View paid installments vs total installments (e.g., *Paid 2 of 4*), next due dates, and student contact info.
- **Sales Transactions Log (`/admin/sales`):** Comprehensive financial audit ledger with transaction IDs, gross revenue, student email, and invoice receipts.

#### 🎓 What the Student / Visitor Experiences:
- **Razorpay Checkout:** Instant payment via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.
- **Immediate Tier Unlock:** 1st installment payment automatically unlocks course access immediately.
- **Installment Payment Tracker:** Direct button on dashboard to view upcoming installment due dates and pay subsequent installments.

---

### Module 8: Verifiable Digital Certificates with QR Verification
*Purpose: Validate student achievements and provide tamper-proof credentials.*

#### 👑 What the Academy Administrator Does:
- **Certificate Issuance Desk (`/admin/certificates`):**
  - Issue certificates manually or configure automated issuance upon student reaching course completion and required XP points.
  - Manage unique verification codes (e.g. `RAH-CERT-2026-8492`).
  - Revoke or re-issue certificates when necessary.

#### 🎓 What the Student / Visitor Experiences:
- **Certificate Gallery (`/student/certificates`):** View official digital graduation certificates.
- **Print & PDF Download:** Download print-ready high-resolution certificates with gold seal styling and instructor signature.
- **Public Tamper-Proof Verification:** Anyone can scan the QR code or enter the certificate ID on the public site to verify authenticity.

---

### Module 9: Gamification Engine, Badges, Milestones & Skills Radar
*Purpose: Transform course progression into a rewarding, addictive video-game experience.*

#### 👑 What the Academy Administrator Does:
- **Badge Creator (`/admin/badges`):** Create badges with custom icons, titles, and unlock criteria (e.g., *Complete 5 courses*, *Earn 5,000 XP*, *Log 30-day streak*).
- **Roadmap Milestones (`/admin/milestones`):** Set sequential student career checkpoints with XP targets.
- **Skill Radar Customization:** Configure dimensions for the student competency radar.

#### 🎓 What the Student / Visitor Experiences:
- **Earned Badges Showcase:** Unlock visual trophies for consistency, technique, and business milestones.
- **Competency Radar:** Hexagonal skill radar displaying proficiency scores across key craft techniques.
- **Student Profile:** Public and private profile views displaying rank, points, and achievements.

---

### Module 10: Community Win Wall & Social Peer Engagement
*Purpose: Build a thriving student community, foster social proof, and celebrate wins.*

#### 👑 What the Academy Administrator Does:
- **Community Moderation (`/admin/community-wins`):** Moderate posts, pin important announcements to the top of the feed, and remove inappropriate content.
- **Celebrate Top Students:** Broadcast standout student achievements platform-wide.

#### 🎓 What the Student / Visitor Experiences:
- **Community Feed (`/student/feed`):** Share pictures of finished projects, share first customer sales, and post questions.
- **Social Interaction:** Like posts, comment with tips, and cheer on fellow academy peers.
- **Automated Milestone Broadcasts:** System automatically posts to the feed when a student graduates to a new level or achieves a major milestone.

---

### Module 11: Student Portfolio Showcase & Public Artist Profiles
*Purpose: Enable students to display their work and attract commercial clients.*

#### 👑 What the Academy Administrator Does:
- Review student portfolio pieces to identify top talent for academy marketing and showcases.

#### 🎓 What the Student / Visitor Experiences:
- **Portfolio Builder (`/student/portfolio`):** Upload artwork collections with pricing, dimensions, technique tags, and descriptions.
- **Public Shareable Link:** Share their digital portfolio link (`/portfolio/student-username`) with prospective buyers.

---

### Module 12: NorthStar Business Tracker & Real Sales Logger
*Purpose: Train students to build profitable businesses by tracking real client sales.*

#### 👑 What the Academy Administrator Does:
- View aggregate student revenue metrics in `/admin/sales` to demonstrate the academy's real-world financial impact.

#### 🎓 What the Student / Visitor Experiences:
- **Client Orders Ledger (`/student/northstar`):** Log real-world customer sales (Customer Name, Product, Price ₹, Advance Paid, Delivery Date).
- **Financial Growth Analytics:** Visual charts displaying monthly resin sales revenue and profit metrics.
- **Commercial XP Reward:** Each verified customer sale logged awards **+500 XP** to celebrate commercial success.

---

### Module 13: Rewards Store & Point Redemptions
*Purpose: Give XP tangible value through physical supplies and academy merchandise.*

#### 👑 What the Academy Administrator Does:
- **Inventory & Store Manager (`/admin/rewards`):** Create reward products (art supplies, molds, aprons), set XP coin costs, and manage stock quantities.
- **Redemption Approvals:** Review student redemption requests and input courier shipping tracking numbers.

#### 🎓 What the Student / Visitor Experiences:
- **Rewards Catalog (`/student/rewards`):** Spend accumulated XP on physical art materials and merchandise.
- **Delivery Tracker:** View order fulfillment status and courier tracking links.

---

### Module 14: Student Affiliate Referral Network
*Purpose: Turn existing students into an organic sales team.*

#### 👑 What the Academy Administrator Does:
- **Affiliate Ledger (`/admin/sales`):** View referral sales, commission percentages, and process student payout requests.

#### 🎓 What the Student / Visitor Experiences:
- **Custom Referral Links (`/student/affiliate`):** Generate unique tracking links for courses and webinars.
- **Commission Tracker:** View clicks, leads generated, and earned commissions (10% to 20%).
- **Payout Request:** Request commission payouts directly via UPI or bank transfer.

---

### Module 15: 1-on-1 VIP Mentorship Booking
*Purpose: Deliver high-ticket mentorship for premium tier members.*

#### 👑 What the Academy Administrator Does:
- Set available date and time slots, manage video call links, and view student prep notes.

#### 🎓 What the Student / Visitor Experiences:
- Diamond & Masters Club students book 30-minute private video consultations directly through the platform calendar.

---

### Module 16: Leaderboard & Friendly Student Competitions
*Purpose: Spur motivation through visible competitive rankings.*

#### 👑 What the Academy Administrator Does:
- Configure leaderboard reset intervals (Weekly, Monthly, All-Time) and award top-performer badges.

#### 🎓 What the Student / Visitor Experiences:
- View live rankings of the top 10 students based on accumulated XP.
- Filter by level tier to compete fairly with peers at the same learning stage.

---

### Module 17: Meta Pixel CAPI & Marketing Conversion Tracking
*Purpose: Drive high-ROI advertising campaigns with exact conversion tracking.*

#### 👑 What the Academy Administrator Does:
- **Marketing Console (`/admin/marketing`):** Enter Meta Pixel ID and toggle tracking on/off. Zero developer code editing required.
- **Event Tracking Controls:** Enable or disable individual standard events (`PageView`, `ViewContent`, `Lead`, `CompleteRegistration`, `InitiateCheckout`, `Purchase`, etc.).

#### 🎓 Automated Background Operations:
- Fired automatically in the browser whenever visitors or students trigger key marketing milestones.
- Transmits exact transaction IDs, currencies, and purchase amounts to Meta for accurate ROAS attribution.

---

### Module 18: In-App Notification Center & Broadcast Alerts
*Purpose: Keep students informed, engaged, and returning to the platform.*

#### 👑 What the Academy Administrator Does:
- **Broadcast Composer (`/admin/notifications`):** Write system announcements with custom titles, messages, and deep links sent to all students or specific tiers.

#### 🎓 What the Student / Visitor Experiences:
- Real-time unread notification badge on top navigation bar.
- Notification feed organized by Milestones, Homework Feedback, Payments, and Announcements.

---

# SECTION 4: Cross-Module Automation (The Domino Effect)

The platform is engineered so that an action in one module systematically ripples through the entire system:

| Student or Admin Action | Automated Domino Effect Across Other Modules |
| :--- | :--- |
| **1. Student Purchases Level Tier** | 1. Razorpay verifies cryptographic signature.<br>2. Financial record added to Admin Sales ledger.<br>3. Student role/membership updated in database.<br>4. All matching tier courses immediately unlocked.<br>5. Recurring installment plan record initialized (if EMI).<br>6. Milestone celebration auto-posted on Community Win Wall.<br>7. In-app notification sent to student.<br>8. Meta Pixel emits verified `Purchase` event. |
| **2. Admin Approves Artwork in `/admin/assignments`** | 1. Homework status updates to `Approved`.<br>2. Student account credited with custom XP (+250 XP).<br>3. System evaluates if student qualifies for level graduation.<br>4. Course progress bar advances.<br>5. Leaderboard position recalculates.<br>6. In-app praise notification delivered with mentor critique. |
| **3. Student Completes Daily Routine Checklist** | 1. Student streak increments by +1.<br>2. Daily XP points credited atomically.<br>3. Leaderboard updates.<br>4. Evaluates eligibility for streak milestone badges. |
| **4. Admin Schedules Class in `/admin/classes`** | 1. Class card added to Student Live Classes schedule.<br>2. Countdown banner displayed on student dashboard.<br>3. In-app announcement delivered to eligible tier members. |
| **5. Admin Marks Class Attendance** | 1. Attendance record logged with timestamp.<br>2. Student awarded +100 Attendance XP.<br>3. Attendance notification delivered to student. |
| **6. Student Logs Customer Sale in NorthStar** | 1. Record saved in business sales tracker.<br>2. Student awarded +500 XP Business Champion reward.<br>3. Community Win celebration auto-generated.<br>4. Platform aggregate student sales metric increments. |
| **7. Installment Due Date Passes Without Payment** | 1. Status automatically flags as `Overdue`.<br>2. High-priority reminder banner shown on student dashboard.<br>3. Automated notification sent with direct payment link.<br>4. Student highlighted in Admin Overdue Installment report. |

---

# SECTION 5: Technical Specifications & Security

- **Frontend:** Next.js 14 App Router, React 18, Tailwind CSS, TypeScript.
- **Backend:** Node.js 20+, Express.js, Sequelize ORM, TypeScript.
- **Database:** PostgreSQL with relational integrity across 26 models.
- **Authentication:** JSON Web Tokens (JWT) with HTTP-only security and bcrypt password hashing.
- **Payment Gateway:** Razorpay API with HMAC SHA256 signature verification.
- **File & Media Storage:** Multipart upload engine supporting images, PDFs, and video embeds.
- **SEO & Performance:** Server-side metadata, dynamic OpenGraph cards, and sub-millisecond in-memory caching.

---

# SECTION 6: Master Deliverables & Acceptance Checklist

Upon deployment for your organization, the deliverable includes:

- [x] **Full Source Code Repository Handover** (Complete `src/` for Next.js Frontend & Node.js Backend, zero errors).
- [x] **Dedicated Server Deployment** (Full setup and active deployment on client's purchased server / VPS).
- [x] **Custom Academy Branding Applied** (Your logo, brand colors, typography, academy title).
- [x] **Custom Domain & SSL Configuration** (Live on your domain with HTTPS).
- [x] **Razorpay Gateway Hookup** (Direct connection to your bank account).
- [x] **Meta Pixel & Ads Attribution Integration** (Ready for ad campaigns).
- [x] **All 18 Admin Management Modules Active**.
- [x] **All 15 Student Learning & Community Modules Active**.
- [x] **Administrative Master Account Provisioned**.
- [x] **System Documentation & Client Operational Guide Provided**.

---

*This document serves as the complete functional specification for the Enterprise Academy LMS & Community Monetization Platform.*
