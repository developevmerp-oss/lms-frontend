# Ravishing Art Hub — Student XP & Gamification System Documentation
**Document Version:** 1.0  
**Prepared For:** Client Presentation & Technical Overview  
**Platform:** Ravishing Art Hub Learning Management System (LMS)  

---

## 1. Executive Summary

The Ravishing Art Hub LMS is built with an intelligent, dynamic **Experience Points (XP) & Gamification Engine** designed to keep students motivated, engaged, and actively progressing through their resin art journey.

The platform provides two distinct portals:
1. **Student Portal:** Where students view their live XP, current rank, level tier, milestones, badges, and progress bar towards their next certification.
2. **Admin Portal:** Where administrators can review submissions, award custom points, configure tier thresholds, create custom student milestones, and grant badges dynamically.

---

## 2. Core Architecture: How XP Works

The system operates on a **Dual-Metric Engine**:

```
                              ┌─────────────────────────────┐
                              │  STUDENT ACTION PERFORMED   │
                              └──────────────┬──────────────┘
                                             │
                                             ▼
                              ┌─────────────────────────────┐
                              │   POINTS / XP ACCUMULATION  │
                              │ (Atomic increment in DB)    │
                              └──────────────┬──────────────┘
                                             │
                                             ▼
                              ┌─────────────────────────────┐
                              │  DYNAMIC LEVEL EVALUATION   │
                              │ (Matched against LevelTier) │
                              └──────────────┬──────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
       ┌─────────────────────────────┐               ┌─────────────────────────────┐
       │   TIER THRESHOLD REACHED    │               │     PROGRESS ADVANCED       │
       │ • Upgrade Level (L0 ➔ L1)   │               │ • Update % Progress Bar     │
       │ • Unlock Tier Badge         │               │ • Calculate remaining XP    │
       │ • Push In-App Notification  │               │ • Update Leaderboard Rank   │
       └─────────────────────────────┘               └─────────────────────────────┘
```

---

## 3. Dynamic XP Breakdown: The 6 Action Triggers

Students accumulate XP through 6 key learning and business milestones. All values can be dynamically tuned or awarded by the Admin:

| # | Action / Activity | XP Awarded | Trigger & Verification Method |
|---|---|:---:|---|
| **1** | **Assignment & Artwork Submission** | **+100 to +500 XP** | Admin inspects student's uploaded artwork photos/videos and assigns points upon **Approval**. |
| **2** | **Roadmap Milestone Completion** | **+250 to +1,000 XP** | Awarded when a student completes key journey checkpoints (e.g., *First Geode Pour*, *First Bridal Preservation Order*). |
| **3** | **Course & Chapter Completion** | **+50 to +200 XP** | Automatically granted when a student finishes module lessons and practical training exercises. |
| **4** | **Portfolio Artwork Showcase** | **+150 XP** | Automatically credited when a student uploads high-resolution portfolio pieces with technique tags. |
| **5** | **Real Client Order / Sales Record** | **+500 XP** | Logged when a student records a commercial customer sale (e.g. ₹5,000 custom clock order) into their sales tracker. |
| **6** | **Daily Activity & Learning Streak** | **+50 XP / day** | Awarded for consistent daily logins, coursework progress, and active participation. |

---

## 4. Dynamic Level Tiers & Progression Matrix

Membership tiers are **100% dynamic** and stored in the `LevelTier` database table. The Admin can modify point limits, change titles, or add new tiers at any time via the Admin Dashboard.

| Tier Code | Level Name | Points Range (XP) | Badge Icon | Theme Color | Milestone Description |
|:---:|---|:---:|:---:|:---:|---|
| **L0** | **Fast Track: Resin FastStart** | **0 – 499 XP** | ⚡ | Emerald | Foundations, chemical ratios, bubble control, and first practical pours. |
| **L1** | **Silver: Explore Membership** | **500 – 4,999 XP** | 🥈 | Slate / Silver | Core techniques, developing signature style, and securing first client sale. |
| **L2** | **Gold: Master Membership** | **5,000 – 9,999 XP** | 🏆 | Amber / Gold | High-ticket geode clocks, bridal preservation, and consistent monthly revenue. |
| **L3** | **Diamond: Renaissance Club** | **10,000 – 49,999 XP** | 💎 | Cyan / Diamond | Scaling to ₹50,000+/month, luxury river tables, and corporate gift orders. |
| **L3+** | **Masters Club: Artistry Pinnacle** | **50,000+ XP** | 👑 | Purple / Royal | Conducting offline workshops, community mentorship, and building a signature brand. |

---

## 5. Live Math Formula for Student Progress Bars

The Student Dashboard calculates live percentage completion towards the next tier using this mathematical formula:

$$\text{Progress \%} = \left( \frac{\text{Current XP} - \text{Current Tier Min XP}}{\text{Next Tier Min XP} - \text{Current Tier Min XP}} \right) \times 100$$

### Example Calculation:
- **Student's Current XP:** `3,200 XP`
- **Current Tier (L1 Silver):** Min = `500 XP`
- **Next Tier (L2 Gold):** Min = `5,000 XP`
- **Calculation:**
  $$\text{Progress} = \left( \frac{3,200 - 500}{5,000 - 500} \right) \times 100 = \left( \frac{2,700}{4,500} \right) \times 100 = \mathbf{60\%}$$
- **Result displayed on Student Dashboard:**
  - `60% completed to Gold Membership`
  - `1,800 XP remaining to unlock Gold Tier (🏆)`

---

## 6. Step-by-Step Workflow: Student vs. Admin

### 🧑‍🎓 Student Workflow:
1. **Login:** Student logs into their dashboard (`/login` ➔ `/dashboard`).
2. **View Status:** Sees current XP, daily streak, membership badge, community rank, and the next active milestone.
3. **Submit Assignment:** Uploads finished project photos/files under the **Assignments** tab.
4. **Instant Notification:** Once reviewed by Admin, student receives a real-time notification with awarded XP and celebratory banner if promoted to a new tier.
5. **Leaderboard:** Student automatically climbs the real-time community leaderboard based on accumulated XP.

### 👩‍💼 Admin Workflow:
1. **Review Submissions:** Admin opens the **Submissions** tab (`/admin/submissions`).
2. **Assign Points:** Views the artwork image, selects `Status: Approved`, sets `Points Awarded: 250 XP`, and clicks **Submit Review**.
3. **Manual Adjustments:** Admin can open any student's record (`/admin/students/:id`) to directly add bonus XP, modify streaks, or assign custom roadmap milestones.
4. **Level Configuration:** Admin can open **Level Settings** (`/admin/level-settings`) to adjust the XP range of any tier without developer assistance.

---

## 7. Key Benefits for Your Academy

1. **High Course Completion Rates:** Gamified milestones encourage students to complete all video lessons and practical homework.
2. **Social Proof & Community Pride:** Dynamic badges and tier colors give students recognizable status in the community.
3. **Zero Hardcoded Limits:** As your academy grows, you can add Level 4, Level 5, or custom VIP tiers directly from the Admin Panel.
4. **Full Transparency:** Every point earned is logged with a timestamp, ensuring accurate leaderboard rankings and certification issuance.

---
*Generated by Scaloy LMS Technical Team for Ravishing Art Hub.*
