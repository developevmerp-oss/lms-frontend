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

/**
 * Intelligent Academy & Art Project Matcher
 * Formats responses dynamically using database levels, prices, and courses.
 * Strictly deflects non-art / non-academy questions.
 */
export function matchAndAnswerAcademyQuery(
  userQuery: string,
  dynamicLevels?: any[],
  dynamicCourses?: any[],
  dynamicWebinar?: any
): string {
  const q = userQuery.toLowerCase().trim();
  const levels = (dynamicLevels && dynamicLevels.length > 0) ? dynamicLevels : LEVEL_TIERS_INFO;

  // ─── 1. CRITICAL SCOPE RESTRICTION: STRICT OFF-TOPIC DEFLECTION ───
  const isOffTopic =
    (
      // Programming / Software engineering outside LMS
      q.includes('python') || q.includes('javascript') || q.includes('typescript') || q.includes('java code') ||
      q.includes('write code') || q.includes('c++') || q.includes('html tag') || q.includes('css code') ||
      q.includes('sql query') || q.includes('github') || q.includes('docker') || q.includes('kubernetes') ||
      // Politics & World
      q.includes('prime minister') || q.includes('president') || q.includes('election') || q.includes('politics') ||
      q.includes('bjp') || q.includes('congress') || q.includes('parliament') || q.includes('war in') ||
      // General Trivia / Homework / Math / Physics
      q.includes('quantum') || q.includes('speed of light') || q.includes('calculate 2') || q.includes('solve for x') ||
      q.includes('math problem') || q.includes('capital of') || q.includes('who is einstein') || q.includes('essay on') ||
      // Sports & Entertainment
      q.includes('cricket') || q.includes('football') || q.includes('virat kohli') || q.includes('messi') ||
      q.includes('ronaldo') || q.includes('ipl match') || q.includes('movie download') || q.includes('song lyrics') ||
      // Food / Cooking / Crypto
      q.includes('recipe for') || q.includes('how to cook') || q.includes('bitcoin') || q.includes('crypto') ||
      q.includes('stock market') || q.includes('weather forecast') || q.includes('medical symptoms')
    ) &&
    // Ensure we do not block legitimate resin queries mentioning chemistry or tools
    !q.includes('resin') && !q.includes('art') && !q.includes('epoxy') && !q.includes('vrajangna') &&
    !q.includes('course') && !q.includes('level') && !q.includes('mould') && !q.includes('mold') &&
    !q.includes('table') && !q.includes('clock') && !q.includes('varmala') && !q.includes('coaster');

  if (isOffTopic) {
    return `✨ I am **Vraj**, the dedicated AI Art & Academy Advisor for **Ravishing Art Hub**.\n\nI specialize exclusively in **resin artistry, our 30 academy courses, level tiers (L0 to L3+), masterclasses with Vrajangna Patel, and creative business guidance**.\n\nI can't answer questions outside our art academy and software, but I'd be delighted to help you with:\n• 🎨 How complete beginners can start resin art with step-by-step guidance\n• 🌸 Wedding flower (varmala) & 3D photo preservation techniques\n• 🪵 Wood & resin live-edge river tables\n• 💎 Geode crystal wall decor & 3D ocean waves\n• 💰 Current membership levels, active fee discounts & pricing\n• ⏰ Attending the next live free masterclass with Vrajangna Patel\n\nWhat would you love to learn or create in resin art today? 🎨`;
  }

  // ─── 2. LIVE MASTERCLASS / WEBINAR (WITH DYNAMIC TIMING IF SCHEDULED) ───
  if (
    q.includes('webinar') || q.includes('masterclass') || q.includes('live class') ||
    q.includes('workshop') || q.includes('free class') || q.includes('vrajangna patel') ||
    q.includes('timing') || q.includes('when is')
  ) {
    let timingSnippet = 'Join founder & award-winning artist **Vrajangna Patel** in an exclusive **90-minute live masterclass**.';
    if (dynamicWebinar && dynamicWebinar.scheduledAt) {
      try {
        const dt = new Date(dynamicWebinar.scheduledAt);
        timingSnippet = `Our next live session is scheduled for **${dt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} IST**!`;
      } catch (_) {}
    }

    return `🎨 **Live Resin Mastery Masterclass with Vrajangna Patel**\n\n${timingSnippet}\n\n**What you will discover live:**\n• **Secret 1 (Mastery):** Learn premium techniques in the correct sequence (technique sequencing vs random YouTube tutorials).\n• **Secret 2 (Mindset):** Overcoming comparison, the fear of failing or wasting resin, and claiming your artistic voice.\n• **Secret 3 (Monetization):** The exact roadmap our students use to earn ₹30,000–₹50,000/month in custom art orders.\n\n🎁 **Free Clarity Kit Included:** 60-Day Goal Planner, Resin Pricing Calculator, and Milestone Roadmap.\n\n👉 **[Click here to view the upcoming schedule and register for free](/webinar)**`;
  }

  // ─── 3. DYNAMIC LEVEL TIERS & PRICING (FETCHED FROM DATABASE) ───
  if (
    q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('fee') ||
    q.includes('fees') || q.includes('tier') || q.includes('membership') || q.includes('subscription') ||
    q.includes('package') || q.includes('l0') || q.includes('l1') || q.includes('l2') ||
    q.includes('l3') || q.includes('silver') || q.includes('gold') || q.includes('diamond') ||
    q.includes('fast track') || q.includes('installment') || q.includes('emi')
  ) {
    // Check if the user is asking about a specific level
    const specificCode = q.includes('l0') || q.includes('fast track') ? 'L0' :
      q.includes('l1') || q.includes('silver') ? 'L1' :
      q.includes('l2') || q.includes('gold') ? 'L2' :
      q.includes('l3+') || q.includes('masters club') ? 'L3+' :
      q.includes('l3') || q.includes('diamond') ? 'L3' : null;

    if (specificCode) {
      const match = levels.find((l: any) => (l.code || l.levelCode || '').toUpperCase() === specificCode);
      if (match) {
        const name = match.name || match.title || `${match.code} Membership`;
        const price = match.price || '₹499';
        let res = `💎 **${match.code} — ${name}**\n\n• **Current Investment:** **${price}**`;

        if (match.offerActive && match.offerTitle) {
          const discount = match.discountType === 'percentage' ? `${match.discountValue}% OFF` : `₹${match.discountValue} OFF`;
          res += `\n• 🔥 **Active Promotion:** ${match.offerTitle} (*${discount}*)`;
        }

        if (match.installmentsEnabled) {
          res += `\n• 💳 **Flexible Installments:** Available in ${match.totalInstallments || 3} installments!`;
        }

        if (match.description) {
          res += `\n\n**Included in this tier:**\n${match.description}`;
        } else if (Array.isArray(match.deliverables)) {
          res += `\n\n**Included in this tier:**\n• ${match.deliverables.join('\n• ')}`;
        }

        res += `\n\n👉 **[Enroll in ${match.code} Membership](/subscribe)** or attend the **[Live Masterclass](/webinar)**!`;
        return res;
      }
    }

    // Otherwise, return all dynamic level tiers
    const levelsFormatted = formatDynamicLevelsText(levels);
    return `💎 **Ravishing Art Hub — Official Membership Tiers & Pricing**\n\n*(Managed dynamically by our academy admin)*\n\n${levelsFormatted}\n\n👉 **[View Full Curriculum & Unlock Membership](/subscribe)**\n👉 **[Register for Free Live Masterclass](/webinar)**`;
  }

  // ─── 4. SPECIFIC ART PROJECT MATCHING (30 COURSES) ───

  // Project A: Bridal Varmala & Flower Preservation (Course 18 - L3)
  if (
    q.includes('varmala') || q.includes('flower') || q.includes('wedding') ||
    q.includes('bouquet') || q.includes('preserv') || q.includes('rose') ||
    q.includes('petal') || q.includes('garland')
  ) {
    const l3Tier = levels.find((l: any) => (l.code || '').toUpperCase() === 'L3') || LEVEL_TIERS_INFO[3];
    return `🌸 **Bridal Varmala & Flower Preservation Art**\n\nPreserving wedding varmalas, anniversary bouquets, and memory flowers is one of the highest-demand, premium services in resin art (custom commissions sell for **₹8,000 to ₹25,000+** each).\n\n**Where is this taught in our Academy?**\n• **Course:** Course 18 — *Bridal Varmala & Flower Preservation*\n• **Membership Level:** **${l3Tier.code} (${l3Tier.name})** — *${l3Tier.price || '₹59,999'}*\n\n**What you will master:**\n1. Specialized 3D silica sand drying to keep flowers from rotting, browning, or losing their original fresh colors.\n2. Chemical sealing of petals to prevent resin from soaking through and creating translucent spots.\n3. Deep-pour casting with bubble elimination for crystal-clear blocks.\n\n👉 **[Explore ${l3Tier.code} Diamond Membership](/subscribe)** or register for our **[Live Masterclass](/webinar)**!`;
  }

  // Project B: Wood & Resin Tables / River Tables (Course 14 - L3)
  if (
    q.includes('table') || q.includes('river table') || q.includes('wood') ||
    q.includes('furniture') || q.includes('slab') || q.includes('live edge')
  ) {
    const l3Tier = levels.find((l: any) => (l.code || '').toUpperCase() === 'L3') || LEVEL_TIERS_INFO[3];
    return `🪵 **Wood & Resin River Tables & Furniture**\n\nLive-edge river tables command premium commissions of **₹25,000 to ₹80,000+** per piece.\n\n**Where is this taught in our Academy?**\n• **Course:** Course 14 — *Wood and Resin Tables*\n• **Membership Level:** **${l3Tier.code} (${l3Tier.name})** — *${l3Tier.price || '₹59,999'}*\n\n**Techniques covered:**\n• Selecting seasoned live-edge wood slabs (teak, acacia, walnut) and moisture testing.\n• Constructing leak-proof barrier molds and applying mold release.\n• Deep-pour resin mixing ratios, exothermic heat control, and crystal-clear tints.\n• Multi-step sanding (80 up to 3000 grit) and buffing for glass-like reflections.\n\n👉 **[Enroll in ${l3Tier.code} Diamond](/subscribe)** to start building luxury furniture pieces!`;
  }

  // Project C: Geode Wall Art & Druzy Crystals (Course 9 & 23 - L2 / L3)
  if (
    q.includes('geode') || q.includes('crystal') || q.includes('druzy') ||
    q.includes('agate') || q.includes('stone texture')
  ) {
    const l2Tier = levels.find((l: any) => (l.code || '').toUpperCase() === 'L2') || LEVEL_TIERS_INFO[2];
    return `💎 **Luxury Geode Art & Raw Druzy Crystals**\n\nGeode wall art captures the healing elegance of natural mineral rocks with crushed crystals and metallic veins.\n\n**Where is this taught?**\n• **Level 2 (${l2Tier.name}):** Course 9 — *Luxury Geode Art* (natural mineral curves, metallic glitter borders, crystal embedding).\n• **Level 3 (Diamond Certification):** Course 23 — *Raw Druzy Geode Clusters* (creating synthetic 3D druzy clusters and iridescent crystalline formations).\n\nSelling price for custom geode wall panels: **₹5,000 to ₹22,000**.\n\n👉 **[Explore Level 2 Gold & Diamond Memberships](/subscribe)**!`;
  }

  // Project D: Wall Clocks / Tree of Life (Course 11 & 24 - L2 / L3)
  if (
    q.includes('clock') || q.includes('tree of life') || q.includes('wall clock') ||
    q.includes('timepiece')
  ) {
    const l2Tier = levels.find((l: any) => (l.code || '').toUpperCase() === 'L2') || LEVEL_TIERS_INFO[2];
    return `⏰ **Tree of Life Luxury Wall Clocks**\n\nWall clocks are one of our students' fastest-selling products because they combine functional home utility with luxury artistic flair.\n\n**Where is this taught?**\n• **Level 2 (${l2Tier.name}):** Course 11 — *Tree of Life Luxury Clock* (MDF base preparation, metallic foil detailing, silent sweep clock machine fitting, Roman numerical alignment).\n• **Level 3 (Diamond Certification):** Course 24 — *Advanced Tree of Life Clock* (multi-layer metallic leafing and 3D textured roots).\n\nRetail selling price: **₹4,500 to ₹15,000**.\n\n👉 **[Enroll in Level 2 Gold Membership](/subscribe)**!`;
  }

  // Project E: Ocean, Waves & Beach Theme (Course 8 & 12 - L1 / L2)
  if (
    q.includes('ocean') || q.includes('beach') || q.includes('wave') ||
    q.includes('ripple') || q.includes('seafoam') || q.includes('sand')
  ) {
    const l1Tier = levels.find((l: any) => (l.code || '').toUpperCase() === 'L1') || LEVEL_TIERS_INFO[1];
    return `🌊 **Ocean & Beach Theme Resin Art**\n\nCreating translucent turquoise waters and foaming white wave cells is an iconic resin milestone.\n\n**Where is this taught?**\n• **Level 1 (${l1Tier.name}):** Course 8 — *Beach Theme Foundations* (shoreline gradient, sand blending, heat-gun white seafoam lacing).\n• **Level 2 (Gold Membership):** Course 12 — *3D Ocean Ripples & Waves* (multi-layer transparent depth, 3D ripples, hyper-realistic water movement).\n\nPerfect for beach serving trays, wall hangings, and ocean tables!\n\n👉 **[Start with Level 1 Silver](/subscribe)** or join our **[Live Masterclass](/webinar)**!`;
  }

  // Project F: Coasters, Keychains, Fridge Magnets, Bookmarks (Course 4 - L1)
  if (
    q.includes('coaster') || q.includes('keychain') || q.includes('magnet') ||
    q.includes('bookmark') || q.includes('tray') || q.includes('small gift')
  ) {
    const l1Tier = levels.find((l: any) => (l.code || '').toUpperCase() === 'L1') || LEVEL_TIERS_INFO[1];
    return `☕ **Coasters, Fridge Magnets & Keychains**\n\nSmall format resin crafts are the easiest, lowest-risk items to master and sell immediately (sets retail for **₹800 to ₹1,800**).\n\n**Where is this taught?**\n• **Level 1 (${l1Tier.name}):** Course 4 — *Coasters, Fridge Magnets & Keychains*\n• Techniques: Silicone mold casting, glitter suspension, alcohol ink drops, gold leaf edging, hardware attachment.\n\nIdeal for corporate bulk gifting and wedding favors!\n\n👉 **[Explore Level 1 Silver Membership](/subscribe)**!`;
  }

  // Project G: Resin Jewelry & Accessories (Course 15 - L3)
  if (
    q.includes('jewel') || q.includes('earring') || q.includes('pendant') ||
    q.includes('ring') || q.includes('locket') || q.includes('bezel')
  ) {
    return `💍 **Resin Jewellery & Wearable Art**\n\n• **Course:** Course 15 — *Resin Jewellery & Accessories*\n• **Membership Level:** **Level 3 (Diamond: Renaissance Certification)**\n• What you'll learn: Working with fast-curing UV resin, metallic open/closed bezels, embedding dried micro-botanicals, creating bubble-free pendants, and attaching earring hardware.\n\n👉 **[Check out Level 3 Diamond](/subscribe)**!`;
  }

  // Project H: 3D Photo Art, Keepsakes & Aarti Thalis (Course 13 & 25 - L3)
  if (
    q.includes('photo') || q.includes('thali') || q.includes('aarti') ||
    q.includes('keepsake') || q.includes('memory') || q.includes('candle') ||
    q.includes('concrete')
  ) {
    return `🖼️ **Memory Keepsakes, 3D Photo Blocks & Festive Decor**\n\n• **3D Photo Resin Art (Course 13 - L3):** Sealing photographs with water-resistant barriers to encapsulate wedding/family pictures in high-gloss acrylic-like blocks without ink bleeding.\n• **Aarti Thali & Pooja Decor (Course 25 - L3):** Traditional decorative pooja thalis with gold leafing, marbling, and spiritual motifs for festive gifting.\n• **Concrete & Resin Hybrid Candles (Course 21 - L3):** Contemporary two-tone industrial concrete topped with translucent aromatic resin.\n\n👉 All taught in **[Level 3 Diamond Renaissance Certification](/subscribe)**!`;
  }

  // Project I: Marbling, Evil Eye, Lotus Pond (Course 5, 6, 7 - L1)
  if (
    q.includes('marble') || q.includes('marbling') || q.includes('evil eye') ||
    q.includes('iris') || q.includes('lotus') || q.includes('pond')
  ) {
    return `🧿 **Marbling, Evil Eye & 3D Lotus Pond Art**\n\nAll three foundational decorative techniques are taught in **Level 1 (Silver Membership)**:\n• **Course 5 (Marbling):** Organic marble veins and contrasting color swirl control.\n• **Course 6 (Evil Eye / Iris):** Concentric color ring manipulation and talisman wall hangings.\n• **Course 7 (Lotus Pond):** Multi-layer depth simulation of floating flora over crystal-clear water.\n\n👉 **[Start Level 1 Silver Membership](/subscribe)**!`;
  }

  // ─── 5. BEGINNER QUESTIONS & PREREQUISITES ───
  if (
    q.includes('beginner') || q.includes('zero') || q.includes('experience') ||
    q.includes('start') || q.includes('how to learn') || q.includes('drawing') ||
    q.includes('painting skill')
  ) {
    const l0Tier = levels.find((l: any) => (l.code || '').toUpperCase() === 'L0') || LEVEL_TIERS_INFO[0];
    return `🎨 **Can a complete beginner learn resin art?**\n\n**YES, absolutely!** Over 80% of our 54,000+ community members had never painted or created crafts before.\n\n**Why you don't need drawing skills:**\n1. **Technique-driven, not drawing-driven:** Resin art is about fluid chemistry, mixing ratios, temperature, and pouring sequence rather than sketching human figures or freehand portraits.\n2. **Step-by-Step Curriculum:** Vrajangna Patel breaks down each project into exact reproducible steps.\n\n**How to start:**\n• **Option 1 (Free):** Attend the live **[Live Resin Masterclass with Vrajangna](/webinar)**.\n• **Option 2 (${l0Tier.price || '₹499'}):** Grab the self-paced **[Level 0 FastStart Bundle](/subscribe)** to learn resin fundamentals, PPE safety, and bubble prevention.`;
  }

  // ─── 6. BUSINESS ROADMAP & EARNING MONEY ───
  if (
    q.includes('money') || q.includes('earn') || q.includes('business') ||
    q.includes('sell') || q.includes('profit') || q.includes('income') ||
    q.includes('client') || q.includes('market')
  ) {
    return `💰 **How Our Students Earn ₹20,000 to ₹75,000+/Month**\n\nResin art offers exceptionally high profit margins (**60% to 75%**).\n\n**Typical Selling Prices:**\n• Coaster sets (4 pcs): **₹800 – ₹1,800**\n• Ocean serving trays: **₹2,200 – ₹4,500**\n• Geode clocks & Tree of Life art: **₹4,500 – ₹15,000**\n• Bridal varmala flower preservation blocks: **₹8,000 – ₹25,000**\n• Custom live-edge wood river tables: **₹30,000 – ₹80,000+**\n\n**How we teach you to sell:**\nIn **Level 3 Diamond**, we include dedicated modules on **Reels Mastery (Course 27), Product Photography (Course 28), and Pricing Psychology** so clients find you organically on Instagram and WhatsApp without chasing relatives.\n\n👉 Learn Vrajangna's complete monetization blueprint at the **[Live Masterclass](/webinar)**!`;
  }

  // ─── 7. TECHNICAL TIPS: BUBBLES, RATIOS, SAFETY & TOOLS ───
  if (
    q.includes('bubble') || q.includes('ratio') || q.includes('mix') ||
    q.includes('cure') || q.includes('sticky') || q.includes('safety') ||
    q.includes('mask') || q.includes('toxic') || q.includes('tool') ||
    q.includes('heat gun') || q.includes('mold') || q.includes('mould')
  ) {
    return `🔬 **Expert Resin Chemistry & Studio Tips:**\n\n• **Mixing Ratios:** Always mix strictly by weight or volume according to your resin bottle (standard 2:1 or 3:1). Stir slowly for 3–5 minutes scraping sides and bottom to avoid sticky, un-cured spots.\n• **Eliminating Bubbles:** Warm the resin bottle in lukewarm water for 10 minutes before pouring. After pouring, pass an artist heat gun or butane blowtorch at a 45° angle 3 inches above the surface.\n• **PPE & Safety:** Always wear nitrile gloves, protective eyewear, and an organic vapor respirator mask (N95 masks do NOT block chemical fumes!). Ensure workspace ventilation.\n• **Curing Time:** Dust-free in 2–4 hours; fully cured and rock-hard in 24–48 hours at 25°C–30°C.\n\nAll safety protocols, toolkits, and chemical ratios are taught thoroughly in **[Level 0 Fast Track](/subscribe)**!`;
  }

  // ─── 8. LMS PLATFORM FEATURES: XP, ATTENDANCE, CERTIFICATES, LOGIN ───
  if (
    q.includes('xp') || q.includes('attendance') || q.includes('certificate') ||
    q.includes('streak') || q.includes('dashboard') || q.includes('login') ||
    q.includes('community') || q.includes('where to watch') || q.includes('password')
  ) {
    return `🏆 **Ravishing Art Hub Academy LMS Features:**\n\n• **Live Class Attendance:** Earn **100 XP** for every weekly live masterclass and Q&A session attended with Vrajangna Patel.\n• **Daily Streaks & XP:** Level up through tiers, unlock milestone badges, and earn community rewards.\n• **Win Wall & Community:** Share your artwork, student milestones, and client orders with fellow artists.\n• **Certificates:** Earn verified course completion and Renaissance Master certification upon submitting your portfolio projects.\n• **Student Portal:** Access all your registered video modules and curriculum inside **[Student Courses](/student/courses)**.\n\n👉 If you are already an enrolled student, access your portal at **[Student Login](/login)**!`;
  }

  // ─── 9. GENERAL ART QUESTION / STUDIO GREETING ───
  return `✨ **Hello! I'm Vraj, your AI Art Advisor at Ravishing Art Hub.**\n\nI can match your creative interests with our **30 step-by-step courses**, provide real-time membership pricing (managed dynamically from our database), or help you join master coach **Vrajangna Patel's** next live masterclass!\n\n**Popular questions you can ask me:**\n• *"What are the membership levels and current prices?"*\n• *"I am a beginner — how do I start?"*\n• *"Which course teaches wedding flower (varmala) preservation?"*\n• *"How do I make wood river tables or geode clocks?"*\n• *"When is the next live masterclass webinar?"*\n\nWhat would you like to create or explore today? 🎨`;
}

