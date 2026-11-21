import { NextRequest, NextResponse } from 'next/server';
import {
  buildSystemPrompt,
  formatDynamicLevelsText,
  LEVEL_TIERS_INFO,
  COURSES_CATALOG,
  MENTOR_PROFILE,
  COMMON_FAQS
} from '@/lib/ai/knowledgeBase';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DynamicContext {
  levels?: any[];
  courses?: any[];
  webinar?: any;
}

// In-memory cache for dynamic data fetched on the server
let serverCache: {
  levels: any[];
  courses: any[];
  webinar: any;
  cachedAt: number;
} = {
  levels: [],
  courses: [],
  webinar: null,
  cachedAt: 0,
};

const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

/**
 * Fetch dynamic levels, courses, and next webinar from the backend database API
 */
async function getDynamicServerData(): Promise<DynamicContext> {
  const now = Date.now();
  if (serverCache.cachedAt && (now - serverCache.cachedAt) < CACHE_TTL_MS && serverCache.levels.length > 0) {
    return {
      levels: serverCache.levels,
      courses: serverCache.courses,
      webinar: serverCache.webinar,
    };
  }

  const backendUrlsToTry = [
    process.env.INTERNAL_API_URL,
    process.env.BACKEND_API_URL,
    process.env.NEXT_PUBLIC_API_URL,
    'https://api.ravishingarthub.com/api',
    'http://localhost:5000/api'
  ].filter(Boolean) as string[];

  for (const baseUrl of backendUrlsToTry) {
    try {
      const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const [levelsRes, coursesRes, webinarRes] = await Promise.allSettled([
        fetch(`${cleanBase}/dashboard/levels`, { signal: controller.signal }).then((r) => r.ok ? r.json() : []),
        fetch(`${cleanBase}/courses`, { signal: controller.signal }).then((r) => r.ok ? r.json() : []),
        fetch(`${cleanBase}/webinar/next`, { signal: controller.signal }).then((r) => r.ok ? r.json() : null),
      ]);

      clearTimeout(timeoutId);

      const levels = (levelsRes.status === 'fulfilled' && Array.isArray(levelsRes.value) && levelsRes.value.length > 0)
        ? levelsRes.value
        : [];
      const courses = (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value) && coursesRes.value.length > 0)
        ? coursesRes.value
        : [];
      const webinar = (webinarRes.status === 'fulfilled' && webinarRes.value?.data)
        ? webinarRes.value.data
        : null;

      if (levels.length > 0 || courses.length > 0) {
        serverCache = {
          levels: levels.length > 0 ? levels : serverCache.levels,
          courses: courses.length > 0 ? courses : serverCache.courses,
          webinar: webinar || serverCache.webinar,
          cachedAt: now,
        };
        return {
          levels: serverCache.levels,
          courses: serverCache.courses,
          webinar: serverCache.webinar,
        };
      }
    } catch (_) {
      // Try next candidate URL
    }
  }

  return {
    levels: serverCache.levels.length > 0 ? serverCache.levels : undefined,
    courses: serverCache.courses.length > 0 ? serverCache.courses : undefined,
    webinar: serverCache.webinar,
  };
}

/**
 * Intelligent Academy & Art Project Matcher
 * Formats responses dynamically using database levels, prices, and courses.
 * Strictly deflects non-art / non-academy questions.
 */
function matchAndAnswerAcademyQuery(
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, dynamicData: clientDynamicData } = body as {
      messages: ChatMessage[];
      dynamicData?: DynamicContext;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || '';
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Fetch or resolve dynamic context (levels, courses, webinar)
    let dynamicContext: DynamicContext = {};

    // 1. If client sent dynamic data (already loaded on page), use it
    if (clientDynamicData?.levels && clientDynamicData.levels.length > 0) {
      dynamicContext = clientDynamicData;
    } else {
      // 2. Otherwise fetch or use server cached data
      dynamicContext = await getDynamicServerData();
    }

    // IF GEMINI API KEY IS CONFIGURED: Call Google Gemini (gemini-3.5-flash with gemini-3.1-flash-lite fallback)
    if (apiKey) {
      const systemPrompt = buildSystemPrompt(
        dynamicContext.levels,
        dynamicContext.courses,
        dynamicContext.webinar
      );

      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Try gemini-3.5-flash first, then gemini-3.1-flash-lite
      const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];

      for (const model of modelsToTry) {
        try {
          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

          const geminiRes = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              },
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 1024,
              }
            })
          });

          if (geminiRes.ok && geminiRes.body) {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            const stream = new ReadableStream({
              async start(controller) {
                const reader = geminiRes.body!.getReader();
                let buffer = '';

                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                      if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6).trim();
                        if (jsonStr === '[DONE]') continue;
                        try {
                          const parsed = JSON.parse(jsonStr);
                          const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                          if (textChunk) {
                            controller.enqueue(encoder.encode(textChunk));
                          }
                        } catch (_) {}
                      }
                    }
                  }
                } catch (err) {
                  controller.error(err);
                } finally {
                  controller.close();
                }
              }
            });

            return new Response(stream, {
              headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache, no-transform',
              }
            });
          }
        } catch (err) {
          console.warn(`Model ${model} stream attempt failed, trying next fallback:`, err);
        }
      }
    }

    // FALLBACK: Fast built-in academy matching engine using dynamic levels and courses
    const matchedResponse = matchAndAnswerAcademyQuery(
      latestUserMessage,
      dynamicContext.levels,
      dynamicContext.courses,
      dynamicContext.webinar
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = matchedResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 8));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform',
      }
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', details: error?.message },
      { status: 500 }
    );
  }
}
