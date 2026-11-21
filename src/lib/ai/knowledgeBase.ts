/**
 * Comprehensive Knowledge Base for Ravishing Art Hub's AI Advisor: "Vraj"
 * Contains full curriculum, level tiers, mentor profile, FAQs, and business roadmaps.
 * Supports DYNAMIC level tiers, pricing, active offers, and courses managed by admin in the database.
 */

export interface CourseDetail {
  id: number;
  level: string;
  levelName: string;
  title: string;
  description: string;
  category: 'Beginner' | 'Home Decor' | 'Luxury & Furniture' | 'Keepsakes' | 'Business & Marketing';
}

export const LEVEL_TIERS_INFO = [
  {
    code: 'L0',
    name: 'Fast Track: Resin FastStart Bundle',
    price: '₹499',
    idealFor: 'Complete beginners who want to test the waters without expensive kit investments.',
    deliverables: [
      'Chemical resin fundamentals (Epoxy vs UV, mixing ratios 2:1 & 3:1)',
      'Safety, PPE, respirator masks, and workspace ventilation',
      'Bubble prevention, humidity control, and foundational finishes',
      'Student success roadmaps and first project walkthrough'
    ]
  },
  {
    code: 'L1',
    name: 'Silver Membership: Explore Membership',
    price: '₹4,999',
    idealFor: 'Beginner hobbyists ready to craft beautiful small-format functional art and make their first client sale.',
    deliverables: [
      'Coasters, fridge magnets, and keychains with silicone molds',
      'Organic marbling and alcohol ink vein blending',
      'Evil Eye / Iris talisman wall hangings',
      'Multi-layer 3D Lotus Pond with floating flora',
      'Beach themes with shoreline sand and white sea-foam lacing',
      'First client order pricing and Instagram showcase checklist'
    ]
  },
  {
    code: 'L2',
    name: 'Gold Membership: Master Membership',
    price: '₹19,999',
    idealFor: 'Artists seeking consistent high-ticket sales (₹15,000–₹35,000/month) with luxury wall decor.',
    deliverables: [
      'Geode Wall Art with raw crushed crystals and metallic glitter lines',
      'Advanced metallic vein pouring and alcohol ink depth',
      'Tree of Life Luxury Wall Clocks with Roman dials and quartz mechanisms',
      '3D Ocean Ripples and multi-layer depth wave manipulation with heat guns',
      'Client consultation templates and custom commission pricing'
    ]
  },
  {
    code: 'L3',
    name: 'Diamond Membership: Renaissance Certification',
    price: '₹59,999',
    idealFor: 'Entrepreneurs building a professional art studio earning ₹50,000–₹1,00,000+/month.',
    deliverables: [
      'Deep River Tables (raw live-edge wood slabs, leak-proof dams, zero-bubble deep casting)',
      'Bridal Varmala & Flower Preservation (silica gel drying, color retention, optical-clarity blocks)',
      '3D Photo Encapsulation plaques and keepsakes',
      'Resin Jewellery, bezels, pendants, and UV curing',
      'Concrete & Terrazzo candles, Aarti Thalis, texture art',
      'Professional Product Photography & Lighting setup',
      'Viral Instagram Reels Mastery & YouTube studio setup for continuous inbound client inquiries'
    ]
  },
  {
    code: 'L3+',
    name: 'Masters Club: Artistry Pinnacle',
    price: 'Exclusive / Application Only',
    idealFor: 'Established artists scaling to national workshops, corporate orders, and certified teaching franchises.',
    deliverables: [
      'Direct 1-on-1 brand empire mentoring with Vrajangna Patel',
      'Offline city workshop licensing and corporate bulk gifting contracts',
      'Signature artist portfolio curation and national media exposure'
    ]
  }
];

export const COURSES_CATALOG: CourseDetail[] = [
  // L0
  { id: 1, level: 'L0', levelName: 'Fast Track', title: 'Resin Fundamentals', description: 'Epoxy chemistry, safety protocols, PPE, curing cycles, toolkits.', category: 'Beginner' },
  { id: 2, level: 'L0', levelName: 'Fast Track', title: 'The Right Approach to Resin Art', description: 'Pouring principles, temperature control, avoiding bubbles.', category: 'Beginner' },
  { id: 3, level: 'L0', levelName: 'Fast Track', title: 'Student Success Stories & Roadmap', description: 'Milestones, artist journeys, and how to scale smoothly.', category: 'Beginner' },

  // L1
  { id: 4, level: 'L1', levelName: 'Silver', title: 'Coasters, Fridge Magnets & Keychains', description: 'Silicone mold pouring, glitter suspension, hardware fixing.', category: 'Home Decor' },
  { id: 5, level: 'L1', levelName: 'Silver', title: 'Marbling Technique', description: 'Organic marble veins, alcohol ink blending, color swirl balance.', category: 'Home Decor' },
  { id: 6, level: 'L1', levelName: 'Silver', title: 'Evil Eye / Iris Art', description: 'Concentric color rings, high-gloss topcoat, protective energy art.', category: 'Home Decor' },
  { id: 7, level: 'L1', levelName: 'Silver', title: 'Lotus Pond 3D Art', description: 'Multi-layer depth effects, simulated water, embedded lotus flora.', category: 'Home Decor' },
  { id: 8, level: 'L1', levelName: 'Silver', title: 'Beach Theme Foundations', description: 'Sand textures, shoreline gradient, white seafoam wave cells.', category: 'Home Decor' },

  // L2
  { id: 9, level: 'L2', levelName: 'Gold', title: 'Luxury Geode Art', description: 'Real crystal embedding, metallic lines, agate rock simulation.', category: 'Home Decor' },
  { id: 10, level: 'L2', levelName: 'Gold', title: 'Vein Effect Mastery', description: 'Micro-vein precision, contrasting pigments, high-end marble finish.', category: 'Home Decor' },
  { id: 11, level: 'L2', levelName: 'Gold', title: 'Tree of Life Clock', description: 'MDF wooden base, machine fitting, luxury Roman numerals, balance.', category: 'Home Decor' },
  { id: 12, level: 'L2', levelName: 'Gold', title: '3D Ocean Ripples & Waves', description: 'Multi-pass ocean waves, transparent water depth, blowing cell lacing.', category: 'Home Decor' },

  // L3
  { id: 13, level: 'L3', levelName: 'Diamond', title: '3D Photo Resin Art', description: 'Sealing photos without bleed, optical crystal block encapsulation.', category: 'Keepsakes' },
  { id: 14, level: 'L3', levelName: 'Diamond', title: 'Wood & Resin Tables (River Tables)', description: 'Live-edge wood selection, mold building, deep pour resin, finishing.', category: 'Luxury & Furniture' },
  { id: 15, level: 'L3', levelName: 'Diamond', title: 'Resin Jewellery & Accessories', description: 'UV resin bezels, earrings, rings, dried botanicals embedment.', category: 'Luxury & Furniture' },
  { id: 16, level: 'L3', levelName: 'Diamond', title: 'Chiffon Technique', description: 'Silky, translucent fabric-like flowing resin drapery effect.', category: 'Home Decor' },
  { id: 17, level: 'L3', levelName: 'Diamond', title: 'Pebble & Stone Texture Effect', description: 'Tactile natural rock beds combined with crystalline resin pools.', category: 'Home Decor' },
  { id: 18, level: 'L3', levelName: 'Diamond', title: 'Bridal Varmala & Flower Preservation', description: 'Silica sand botanical drying, color preservation, heirloom block casting.', category: 'Keepsakes' },
  { id: 19, level: 'L3', levelName: 'Diamond', title: 'Labradorite Gemstone Effect', description: 'Iridescent optical play, flashing peacock blue and green tones.', category: 'Home Decor' },
  { id: 20, level: 'L3', levelName: 'Diamond', title: 'Galaxy & Cosmic Nebula Art', description: 'Deep space pigments, celestial dust, star clusters, dark backdrop.', category: 'Home Decor' },
  { id: 21, level: 'L3', levelName: 'Diamond', title: 'Concrete & Resin Hybrid Candles', description: 'Two-tone industrial concrete vessels topped with scented resin.', category: 'Home Decor' },
  { id: 22, level: 'L3', levelName: 'Diamond', title: 'Heavy Texture Mixed Media Art', description: 'Sculptural modeling pastes, palette knife work, resin glazes.', category: 'Home Decor' },
  { id: 23, level: 'L3', levelName: 'Diamond', title: 'Druzy & Raw Geode Crystals', description: 'Crushed glass, glitter accents, authentic druzy cluster replicas.', category: 'Home Decor' },
  { id: 24, level: 'L3', levelName: 'Diamond', title: 'Advanced Tree of Life Clock', description: 'Multi-layer metallic leafing, precision dial markers, silent sweep.', category: 'Home Decor' },
  { id: 25, level: 'L3', levelName: 'Diamond', title: 'Aarti Thali & Festive Accents', description: 'Traditional pooja thalis, gold leaf borders, festive gifting.', category: 'Home Decor' },
  { id: 26, level: 'L3', levelName: 'Diamond', title: 'Ripples & Water Droplet Effects', description: 'Hyper-realistic dew droplets and splash ripples on resin canvas.', category: 'Home Decor' },
  { id: 27, level: 'L3', levelName: 'Diamond', title: 'Reels Mastery for Artists', description: 'Hook scripts, dynamic filming angles, lighting, viral art transitions.', category: 'Business & Marketing' },
  { id: 28, level: 'L3', levelName: 'Diamond', title: 'Product Photography & Staging', description: 'Aesthetic photo composition, eliminating glare, phone camera mastery.', category: 'Business & Marketing' },
  { id: 29, level: 'L3', levelName: 'Diamond', title: 'YouTube Studio & Channel Setup', description: 'Long-form tutorials, camera gear, audio, packaging personal brand.', category: 'Business & Marketing' },
  { id: 30, level: 'L3', levelName: 'Diamond', title: 'Creative Journaling & Mindset', description: 'Overcoming creative block, imposter syndrome, daily artistic rituals.', category: 'Business & Marketing' },
];

export const MENTOR_PROFILE = {
  name: 'Vrajangna Patel',
  role: 'Founder, Master Coach & Award-Winning Artist',
  experience: '10+ Years of coaching experience',
  reach: 'Over 54,000+ webinar attendees and community members',
  awards: [
    '2022 Hall of Fame Award winner',
    'Featured in Sylph Magazine and leading national art publications',
    'Co-author in International Best Seller "I Can Coach"'
  ],
  philosophy: 'Mastery → Mindset → Monetization. Build genuine technique first, develop creative confidence next, and turn your art into a reliable financial opportunity without confusion.'
};

export const COMMON_FAQS = [
  {
    q: 'Can a complete beginner with zero art experience learn this?',
    a: 'Absolutely! More than 80% of our students are homemakers, professionals, and students who have never painted before. Resin art relies on technique, chemical ratios, and sequence rather than freehand drawing skills. Our Step-by-Step Level 0 and Level 1 curriculum is designed specifically for complete beginners.'
  },
  {
    q: 'How does wedding flower (varmala) preservation work?',
    a: 'Wedding varmalas and anniversary bouquets cannot be poured fresh because moisture rots and discolors petals inside resin. We teach professional 3D silica gel drying to maintain natural vibrant color and shape, followed by multi-stage optical-clarity deep casting. This is fully taught in Level 3 (Diamond Renaissance).'
  },
  {
    q: 'Is resin toxic or dangerous to work with?',
    a: 'When handled with proper safety gear (nitrile gloves, safety goggles, and an organic vapor respirator mask in a well-ventilated room), modern artist-grade epoxy resin is very safe. We teach safety protocols in Module 1 of Level 0.'
  },
  {
    q: 'How much do students typically earn from selling resin art?',
    a: 'Beginner items (coasters, bookmarks, keychains) sell for ₹500–₹1,500. Medium decor (geode clocks, beach trays) sells for ₹3,500–₹8,000. Premium custom commissions (bridal varmala blocks, wood river tables) command ₹15,000–₹50,000+ each. Consistent students typically earn between ₹20,000 and ₹75,000/month within 3 to 6 months of systematic practice.'
  },
  {
    q: 'When is the live masterclass and how can I join?',
    a: 'Vrajangna Patel conducts an exclusive 90-minute live masterclass covering the 3 Secrets of Resin Art. You can check the upcoming schedule and register for free at /webinar on our website.'
  }
];

/**
 * Format dynamic levels for text/markdown display (in fallback matcher or UI)
 */
export function formatDynamicLevelsText(levels?: any[]): string {
  const activeLevels = (levels && levels.length > 0) ? levels : LEVEL_TIERS_INFO;

  return activeLevels.map((lvl: any) => {
    const code = lvl.code || lvl.levelCode || 'L1';
    const name = lvl.name || lvl.title || `${code} Membership`;
    const price = lvl.price || '₹499';
    let line = `• **${code} (${name}): ${price}**`;

    if (lvl.offerActive && lvl.offerTitle) {
      const discount = lvl.discountType === 'percentage'
        ? `${lvl.discountValue}% OFF`
        : `₹${lvl.discountValue} OFF`;
      line += `\n  🔥 *Special Promotion:* ${lvl.offerTitle} (${discount})`;
    }

    if (lvl.installmentsEnabled) {
      line += `\n  💳 *Flexible EMI:* Available in ${lvl.totalInstallments || 3} installments`;
    }

    if (lvl.description) {
      line += `\n  ${lvl.description}`;
    } else if (Array.isArray(lvl.deliverables)) {
      line += `\n  Deliverables: ${lvl.deliverables.join('; ')}`;
    }

    return line;
  }).join('\n\n');
}

/**
 * Build dynamic system prompt incorporating live database levels, courses, and upcoming webinar
 */
export function buildSystemPrompt(
  dynamicLevels?: any[],
  dynamicCourses?: any[],
  dynamicWebinar?: any
): string {
  const activeLevels = (dynamicLevels && Array.isArray(dynamicLevels) && dynamicLevels.length > 0)
    ? dynamicLevels
    : LEVEL_TIERS_INFO;

  const activeCourses = (dynamicCourses && Array.isArray(dynamicCourses) && dynamicCourses.length > 0)
    ? dynamicCourses
    : COURSES_CATALOG;

  const levelDescriptions = activeLevels.map((lvl: any) => {
    const code = lvl.code || lvl.levelCode || 'L1';
    const name = lvl.name || lvl.title || `${code} Membership`;
    const price = lvl.price || '₹499';
    const desc = lvl.description || (Array.isArray(lvl.deliverables) ? lvl.deliverables.join('; ') : '');
    const offerInfo = (lvl.offerActive && lvl.offerTitle)
      ? ` [PROMOTION: ${lvl.offerTitle} (${lvl.discountType === 'percentage' ? `${lvl.discountValue}% OFF` : `₹${lvl.discountValue} OFF`})]`
      : '';
    const emiInfo = lvl.installmentsEnabled
      ? ` [INSTALLMENTS: ${lvl.totalInstallments || 3} installments enabled]`
      : '';
    return `• ${name} (${code}) - Price: ${price}${offerInfo}${emiInfo}\n  Description/Perks: ${desc}`;
  }).join('\n\n');

  const courseList = activeCourses.slice(0, 35).map((c: any) => {
    const id = c.id || '';
    const level = c.level || c.levelCode || 'General';
    const title = c.title || c.name || '';
    const desc = c.description || '';
    const cat = c.category || 'General';
    return `${id}. [${level}] ${title} (${cat}): ${desc}`;
  }).join('\n');

  let webinarTiming = 'Weekly 90-minute live masterclass with Vrajangna Patel.';
  if (dynamicWebinar && dynamicWebinar.scheduledAt) {
    try {
      const dt = new Date(dynamicWebinar.scheduledAt);
      webinarTiming = `Next live session is scheduled for ${dt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} IST (${dynamicWebinar.title || 'Resin Mastery Masterclass'}).`;
    } catch (_) {}
  }

  return `You are "Vraj", the official AI Art & Academy Advisor for Ravishing Art Hub, founded by acclaimed resin artist and master coach Vrajangna Patel.

CRITICAL SCOPE RESTRICTION & STRICT BOUNDARY RULES:
1. STRICT SCOPE LOCK: You MUST ONLY answer questions strictly and exclusively related to:
   - Resin artistry, fluid crafts, epoxy/UV resin chemistry, silicone molds, pigments, safety gear (PPE: respirator, nitrile gloves), bubble elimination, curing times, and technical pouring advice.
   - Ravishing Art Hub website, our courses catalog, and our level tiers (managed by admin in the database, e.g. L0 Fast Track, L1 Silver, L2 Gold, L3 Diamond, L3+ Masters Club).
   - Live Masterclass webinars with Vrajangna Patel, timings, and free registrations.
   - Academy software & LMS features: student login, 100 XP live class attendance, streak tracking, project submissions, certificates, and student win wall.
   - Creative entrepreneurship: art pricing formulas, Instagram reels mastery, product photography, and student monetization roadmaps.

2. STRICT REFUSAL OF OFF-TOPIC QUERIES:
   - If a user asks about ANY topic outside the above scope (such as computer programming, writing code, general homework, mathematics, politics, world leaders, sports, entertainment news, cooking recipes, health/medical diagnosis, general trivia, or general AI chit-chat):
   - You MUST POLITELY AND FIRMLY DECLINE.
   - Refusal template:
     "I am Vraj, the dedicated AI Art & Academy Advisor for Ravishing Art Hub. I specialize exclusively in resin artistry, our academy courses, membership levels, and creative business mentoring with Vrajangna Patel. I cannot assist with topics outside our art academy. How can I help you explore our resin art projects, level pricing, or upcoming live masterclass today? 🎨"

3. DYNAMIC PRICING & LEVEL ACCURACY:
   - The levels, titles, and prices below are dynamically managed by the admin from the database.
   - ALWAYS quote the exact dynamic titles, prices, active offers, and installment details listed below when asked about pricing or memberships.

4. BRAND IDENTITY & VOICE:
- Name: Vraj
- Tone: Warm, encouraging, artistic, articulate, and professional.
- Attitude: Highly supportive of beginners, practical about art monetization, and proud of our student community.
- Emojis: Use tasteful artistic emojis (🎨, ✨, 🌸, 💎, ⏰, 🪵).

LIVE DYNAMIC KNOWLEDGE BASE (FROM DATABASE & ACADEMY):

1. FOUNDER & MENTOR:
- Vrajangna Patel: 10+ years coaching, 54,000+ webinar attendees, 2022 Hall of Fame Award winner, featured in Sylph Magazine and "I Can Coach" international best-seller.
- Core philosophy: Mastery → Mindset → Monetization.

2. DYNAMIC LEVEL TIERS & PRICING (MANAGED BY ADMIN):
${levelDescriptions}

3. CURRICULUM COURSES:
${courseList}

4. LIVE MASTERCLASS WEBINAR:
- Title: 90-Minute Live Resin Mastery Masterclass with Vrajangna Patel.
- Status/Schedule: ${webinarTiming}
- Key lessons: The 3 Secrets (Mastery in sequence, Mindset without comparison, Monetization roadmap).
- Bonus Clarity Kit: 60-Day Goal Planner, Resin Pricing Calculator, and Milestone Roadmap.
- Registration URL: Always provide "[Register for Live Masterclass](/webinar)".

5. PLATFORM FEATURES & XP:
- Attendance: Students earn 100 XP for attending weekly live masterclasses & live Q&As.
- Streaks & Levels: XP points unlock level tiers, milestone badges, and certificates.
- Direct links: [Explore Membership Tiers](/subscribe), [Student Login](/login), [Student Courses](/student/courses).

MATCHING INSTRUCTION:
- Whenever a visitor mentions an art project (e.g. varmala preservation, ocean ripples, river tables, geode clocks, coasters, jewelry), identify the exact Course Title and Level Tier (L0, L1, L2, or L3).
- Always include helpful clickable links in markdown: [Register for Live Masterclass](/webinar) or [Explore Memberships](/subscribe).`;
}
