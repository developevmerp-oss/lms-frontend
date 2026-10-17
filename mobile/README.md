# Ravishing Art Hub - Enterprise Student Portal Mobile App (Flutter)

A cross-platform (Android & iOS) mobile application for **Ravishing Art Hub LMS Student Portal**, matching every module and business rule from the web application.

---

## 🎯 Architecture & Matching Modules

| Web Software Module | Mobile Implementation | Access / Role Gating |
|---|---|---|
| **Student Dashboard** | `lib/screens/dashboard/dashboard_screen.dart` | Gated: Level 0 (Fast Track)+. General members see upgrade lock modal. |
| **Welcome Header & Streak** | Welcome header, real streak counter & 7-day week strip (`weekStatus`). | All enrolled students |
| **6-Step Daily Routine Checklist** | Mindset (A), Goal Card (B), Affirmations (C), Goals (D), Social (E), Meditate (F). Saves locally per day; **awards +10 XP** once all 6 are completed. | Level 0+ |
| **Skill Mastery Matrix** | Skill Mastery, Consistency, Creative Excellence, Implementation, Business, Community Leadership. | Level 0+ |
| **Sisterhood Community Feed & Win Wall** | `lib/screens/community/community_screen.dart`. Likes, comment threads, post milestone with sales amount, artwork image URL, **+100 XP award**. | Gated: General & L0 are **View-Only**. L1, L2, L3+ can post & comment. |
| **Course Catalog & Player** | `lib/screens/courses/courses_screen.dart` & `course_detail_screen.dart`. Level filters (L0, L1, L2, L3), unlocks based on student level hierarchy & direct enrollment. Chapter video launcher and PDF notes. | Hierarchy-based unlocking: General unlocks none; L0 unlocks L0; L1 unlocks L0+L1; L2 unlocks L0+L1+L2; L3 unlocks all 30 masterclasses. |
| **Live Coaching & Attendance** | `lib/screens/classes/classes_screen.dart`. Upcoming & past replay tabs. Joining class automatically logs attendance and **awards +50 XP**. | Gated: Level 1 (Silver)+ & 500 XP. |
| **Live Webinar Hub** | `lib/screens/webinar/webinar_screen.dart`. Live Zoom link, VIP WhatsApp group, preparation workshop video. | Gated: Level 0 (Fast Track)+. |
| **Northstar Business Revenue Tracker** | `lib/screens/northstar/northstar_screen.dart`. Client sales log (`POST /dashboard/student/sales` with **+100 XP** award, `DELETE /:id`), revenue vs ₹3,00,000 monthly goal bar. | Gated: Level 3 (Diamond)+ & 10,000 XP. |
| **Rewards & Merch Store** | `lib/screens/rewards/rewards_screen.dart`. Real XP point balance, 1-on-1 calls, merch kits, discount vouchers with instant redemption (`POST /rewards/:id/redeem`). | Gated: Level 0 (Fast Track)+. |
| **Global Leaderboard** | `lib/screens/leaderboard/leaderboard_screen.dart`. Top 3 podium (1st, 2nd, 3rd) and global artist ranking by XP. | All students |
| **Certificates Vault** | `lib/screens/certificates/certificates_screen.dart`. Earned completion certificates with PDF download links. | All students |
| **Daily Tasks & Missions** | `lib/screens/tasks/tasks_screen.dart`. Assignments list, status (`approved`, `rejected`, `pending`), fileUrl link submission. | All students |
| **Artwork Portfolio** | `lib/screens/portfolio/portfolio_screen.dart`. Submit finished resin pieces for Diamond Mentor review and feedback. | All students |
| **Affiliate Partner Program** | `lib/screens/affiliate/affiliate_screen.dart`. Unique referral link, 20% net commission calculator, WhatsApp sharing. | All students |
| **Notifications & Broadcast Hub** | `lib/screens/notifications/notifications_screen.dart`. Broadcast messages, special level offers, live class reminders. | All students |
| **Profile & Curriculum Ladder** | `lib/screens/profile/profile_screen.dart`. Edit profile modal (name, city, phone, bio, avatar, password) and 5-tier roadmap (L0 Fast Start, L1 Silver, L2 Gold, L3 Diamond, L3+ Masters). | All students |
| **Authentication & Password Reset** | `lib/screens/auth/login_screen.dart` & `register_screen.dart`. Login, register, 6-digit OTP forgot & reset password flow. | Public |

---

## 🚀 How to Run on Android & iOS

### 1. Ensure Dependencies
In the `mobile/` directory:
```bash
flutter pub get
```

### 2. If Running Fresh on a New Machine
To generate any missing platform native wrappers (Gradle wrappers, Xcode project):
```bash
flutter create . --org com.ravishingarthub --project-name ravishing_art_hub_lms
flutter pub get
```

### 3. Run on Device / Emulator
- **Android:**
  ```bash
  flutter run -d android
  ```
- **iOS (on macOS with Xcode installed):**
  ```bash
  cd ios && pod install && cd ..
  flutter run -d ios
  ```

---

## 🎨 Design & Theme
- Background: Pitch Slate 950 (`0xFF020617`)
- Surface Cards: Slate 900 (`0xFF0F172A`)
- Borders: Slate 800 (`0xFF1E293B`)
- Primary Accent: Brand Orange (`0xFFF97316`)
- Secondary Accents: Gold/Amber XP (`0xFFF59E0B`), Cyan Diamond (`0xFF06B6D4`), Emerald Green (`0xFF10B981`)
