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
  dynamicWebinar?: any,
  isOngoing: boolean = false
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
    return `• ${code} (${name}): ${price}${offerInfo}${emiInfo} — ${desc}`;
  }).join('\n');

  const courseList = activeCourses.slice(0, 35).map((c: any) => {
    const id = c.id || '';
    const level = c.level || c.levelCode || 'General';
    const title = c.title || c.name || '';
    const desc = c.description || '';
    return `${id}. [${level}] ${title}: ${desc}`;
  }).join('\n');

  let webinarTiming = 'Weekly 90-minute live masterclass with Vrajangna Patel.';
  if (dynamicWebinar && dynamicWebinar.scheduledAt) {
    try {
      const dt = new Date(dynamicWebinar.scheduledAt);
      webinarTiming = `Next live session: ${dt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} IST (${dynamicWebinar.title || 'Resin Mastery Masterclass'}).`;
    } catch (_) {}
  }

  return `You are Vraj, an expert, warm, and highly authentic Art Advisor at Ravishing Art Hub (founded by acclaimed resin artist and master coach Vrajangna Patel).
You chat 1-on-1 with visitors on live chat exactly like a friendly human advisor (matching the clean conversational style of Ask EVA on EVM ERP).

CRITICAL CONVERSATIONAL & HUMAN COMMUNICATION RULES:
1. NATURAL HUMAN TONE — NO SCRIPTED ESSAYS OR TEMPLATE DUMPS:
   - Talk naturally, warmly, and concisely (strictly 2 to 4 short sentences maximum).
   - NEVER paste ready-made FAQ paragraphs, long bulleted checklists, or marketing brochures.
   - Answer the visitor's specific question directly with authentic details, specific numbers, and course info.
   - Always conclude with one natural, friendly follow-up question to keep the conversation flowing smoothly.

2. STRICT RULE FOR ONGOING CHATS (NEVER RE-GREET):
   ${isOngoing ? `• THIS IS AN ONGOING CONVERSATION IN PROGRESS. The visitor already knows who you are.
   • You MUST NEVER say "Hello", "Hi", "Hey", "Greetings", or "Welcome back".
   • You MUST NEVER introduce yourself again (do NOT say "I am Vraj", "As an advisor", etc.).
   • Jump straight into answering the user's specific question naturally.` : `• If this is the very first message, you may give a brief 1-sentence warm greeting before answering directly.`}

3. CLEAN TEXT — NO CLUTTERED LINKS:
   - Do NOT insert repetitive markdown links or URLs in your text. The UI automatically displays a clean, clickable action button directly beneath your response bubble.
   - If appropriate, simply say "You can explore memberships below" or "You can reserve a seat right below".

4. STRICT SCOPE RESTRICTION:
   - ONLY answer questions about resin art, pouring techniques, chemical safety, academy courses (30 courses in L0–L3), membership tiers/pricing, live masterclasses with Vrajangna Patel, and student business roadmaps.
   - For off-topic queries (coding, politics, general homework, sports, etc.), decline politely and naturally in 1-2 sentences: "I focus exclusively on resin art and our academy courses with Vrajangna Patel. What kind of resin project or course can I help you explore today?"

ACADEMY REFERENCE DATA:
Founder: Vrajangna Patel (10+ years coaching, 54k+ students, award-winning coach).
Levels & Pricing:
${levelDescriptions}

Courses:
${courseList}

Webinar Schedule:
${webinarTiming}
`;
}

/**
 * Intelligent Academy & Art Project Matcher
 * Formats responses dynamically using database levels, prices, and courses.
 * Returns concise, natural human answers (2-3 sentences) without repetitive greetings.
 */
export function matchAndAnswerAcademyQuery(
  userQuery: string,
  dynamicLevels?: any[],
  dynamicCourses?: any[],
  dynamicWebinar?: any,
  isOngoing: boolean = false
): string {
  const q = userQuery.toLowerCase().trim();
  const levels = (dynamicLevels && dynamicLevels.length > 0) ? dynamicLevels : LEVEL_TIERS_INFO;

  // ─── 1. STRICT OFF-TOPIC DEFLECTION ───
  const isOffTopic =
    (
      q.includes('python') || q.includes('javascript') || q.includes('typescript') || q.includes('java code') ||
      q.includes('write code') || q.includes('c++') || q.includes('html tag') || q.includes('css code') ||
      q.includes('sql query') || q.includes('github') || q.includes('docker') || q.includes('kubernetes') ||
      q.includes('prime minister') || q.includes('president') || q.includes('election') || q.includes('politics') ||
      q.includes('bjp') || q.includes('congress') || q.includes('parliament') || q.includes('war in') ||
      q.includes('quantum') || q.includes('speed of light') || q.includes('calculate 2') || q.includes('solve for x') ||
      q.includes('math problem') || q.includes('capital of') || q.includes('who is einstein') || q.includes('essay on') ||
      q.includes('cricket') || q.includes('football') || q.includes('virat kohli') || q.includes('messi') ||
      q.includes('ronaldo') || q.includes('ipl match') || q.includes('movie download') || q.includes('song lyrics') ||
      q.includes('recipe for') || q.includes('how to cook') || q.includes('bitcoin') || q.includes('crypto') ||
      q.includes('stock market') || q.includes('weather forecast') || q.includes('medical symptoms')
    ) &&
    !q.includes('resin') && !q.includes('art') && !q.includes('epoxy') && !q.includes('vrajangna') &&
    !q.includes('course') && !q.includes('level') && !q.includes('mould') && !q.includes('mold') &&
    !q.includes('table') && !q.includes('clock') && !q.includes('varmala') && !q.includes('coaster');

  if (isOffTopic) {
    return `I specialize exclusively in resin artistry, our academy courses, and live masterclasses with Vrajangna Patel. What kind of resin project or course can I help you explore today?`;
  }

  // ─── 2. LIVE MASTERCLASS / WEBINAR ───
  if (
    q.includes('webinar') || q.includes('masterclass') || q.includes('live class') ||
    q.includes('workshop') || q.includes('free class') || q.includes('vrajangna patel') ||
    q.includes('timing') || q.includes('when is')
  ) {
    let timingSnippet = 'Vrajangna Patel hosts an exclusive 90-minute live masterclass covering the core secrets of resin art and custom order pricing.';
    if (dynamicWebinar && dynamicWebinar.scheduledAt) {
      try {
        const dt = new Date(dynamicWebinar.scheduledAt);
        timingSnippet = `Our next live session with Vrajangna Patel is scheduled for ${dt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} IST!`;
      } catch (_) {}
    }

    return `${timingSnippet} It is completely free to attend and includes our bonus Clarity Kit with pricing calculators and roadmap guides. Would you like to reserve your seat for the upcoming session?`;
  }

  // ─── 3. DYNAMIC LEVEL TIERS & PRICING ───
  if (
    q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('fee') ||
    q.includes('fees') || q.includes('tier') || q.includes('membership') || q.includes('subscription') ||
    q.includes('package') || q.includes('l0') || q.includes('l1') || q.includes('l2') ||
    q.includes('l3') || q.includes('silver') || q.includes('gold') || q.includes('diamond') ||
    q.includes('fast track') || q.includes('installment') || q.includes('emi')
  ) {
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
        let offerText = '';
        if (match.offerActive && match.offerTitle) {
          const discount = match.discountType === 'percentage' ? `${match.discountValue}% OFF` : `₹${match.discountValue} OFF`;
          offerText = ` We currently have an active offer: ${match.offerTitle} (${discount}).`;
        }
        let emiText = '';
        if (match.installmentsEnabled) {
          emiText = ` Flexible EMI is also available in ${match.totalInstallments || 3} monthly payments.`;
        }

        return `Our ${match.code} (${name}) is priced at ${price}.${offerText}${emiText} Are you looking to learn as a creative hobby or start taking custom client orders?`;
      }
    }

    // Friendly, crisp human overview of all 4 tiers
    return `Our academy memberships range from L0 Fast Track (₹499) for beginner basics, L1 Silver (₹4,999) for small decor and first sales, L2 Gold (₹19,999) for luxury geode art and clocks, to L3 Diamond (₹59,999) for bridal varmala preservation and river tables. Which level feels like the right fit for your creative goals?`;
  }

  // ─── 4. SPECIFIC ART PROJECTS ───

  // Project A: Bridal Varmala & Flower Preservation (Course 18 - L3)
  if (
    q.includes('varmala') || q.includes('flower') || q.includes('wedding') ||
    q.includes('bouquet') || q.includes('preserv') || q.includes('rose') ||
    q.includes('petal') || q.includes('garland')
  ) {
    return `Wedding flower and bridal varmala preservation is taught in Course 18 inside our Level 3 Diamond membership. You will learn specialized 3D silica sand drying to keep petals vibrant without browning, followed by bubble-free deep casting. Have you already got wedding flowers you want to preserve?`;
  }

  // Project B: Wood & Resin Tables / River Tables (Course 14 - L3)
  if (
    q.includes('table') || q.includes('river table') || q.includes('wood') ||
    q.includes('furniture') || q.includes('slab') || q.includes('live edge')
  ) {
    return `Wood and resin river tables are taught in Course 14 of our Level 3 Diamond certification. It covers live-edge wood selection, moisture testing, building leak-proof dams, deep-pour resin ratios, and mirror-finish polishing. Are you planning a coffee table or a larger dining table?`;
  }

  // Project C: Geode Wall Art & Druzy Crystals (Course 9 & 23 - L2 / L3)
  if (
    q.includes('geode') || q.includes('crystal') || q.includes('druzy') ||
    q.includes('agate') || q.includes('stone texture')
  ) {
    return `Luxury geode art with raw crystals and metallic veins is covered in Level 2 Gold (Course 9), with advanced synthetic druzy clusters in Level 3 Diamond (Course 23). Custom geode panels typically sell for ₹5,000 to ₹22,000. Have you worked with heat guns and metallic pigments before?`;
  }

  // Project D: Wall Clocks / Tree of Life (Course 11 & 24 - L2 / L3)
  if (
    q.includes('clock') || q.includes('tree of life') || q.includes('wall clock') ||
    q.includes('timepiece')
  ) {
    return `Our signature Tree of Life luxury wall clocks are taught in Level 2 Gold (Course 11), with advanced multi-layer metallic leafing in Level 3 Diamond (Course 24). They retail for ₹4,500 to ₹15,000 and are one of our students' fastest-selling items. Would you like to craft one for home decor or client sales?`;
  }

  // Project E: Ocean, Waves & Beach Theme (Course 8 & 12 - L1 / L2)
  if (
    q.includes('ocean') || q.includes('beach') || q.includes('wave') ||
    q.includes('ripple') || q.includes('seafoam') || q.includes('sand')
  ) {
    return `We teach ocean resin art across two levels — foundational shoreline sand and heat-gun seafoam in Level 1 Silver (Course 8), and multi-layer 3D ripples and transparent depth in Level 2 Gold (Course 12). Are you looking to make beach trays or larger wall art?`;
  }

  // Project F: Coasters, Keychains, Fridge Magnets (Course 4 - L1)
  if (
    q.includes('coaster') || q.includes('keychain') || q.includes('magnet') ||
    q.includes('bookmark') || q.includes('tray') || q.includes('small gift')
  ) {
    return `Coasters, bookmarks, and fridge magnets are taught in Level 1 Silver (Course 4). They are the quickest, lowest-risk projects to master with silicone molds and make great starter items or bulk corporate gifting sets. Would you like to start with small decor?`;
  }

  // Project G: Resin Jewelry & Accessories (Course 15 - L3)
  if (
    q.includes('jewel') || q.includes('earring') || q.includes('pendant') ||
    q.includes('ring') || q.includes('locket') || q.includes('bezel')
  ) {
    return `Resin jewelry, UV resin bezels, and dried botanical pendants are taught in Course 15 of our Level 3 Diamond membership. They cure in minutes under UV light and make beautiful wearable keepsakes. Are you interested in earrings or pendant lockets?`;
  }

  // Project H: 3D Photo Art, Keepsakes & Aarti Thalis (Course 13 & 25 - L3)
  if (
    q.includes('photo') || q.includes('thali') || q.includes('aarti') ||
    q.includes('keepsake') || q.includes('memory') || q.includes('candle') ||
    q.includes('concrete')
  ) {
    return `Memory keepsakes like 3D photo encapsulation blocks, decorative festive Aarti thalis, and concrete hybrid candles are all taught in Level 3 Diamond. They are very popular for anniversary and wedding gifts. Which of these projects interests you most?`;
  }

  // Project I: Marbling, Evil Eye, Lotus Pond (Course 5, 6, 7 - L1)
  if (
    q.includes('marble') || q.includes('marbling') || q.includes('evil eye') ||
    q.includes('iris') || q.includes('lotus') || q.includes('pond')
  ) {
    return `Marbling veins, protective Evil Eye wall hangings, and 3D multi-layer Lotus Ponds are all taught in Level 1 Silver (Courses 5, 6, and 7). They are great for developing color control and depth. Have you tried alcohol ink marbling before?`;
  }

  // ─── 5. BEGINNER QUESTIONS ───
  if (
    q.includes('beginner') || q.includes('zero') || q.includes('experience') ||
    q.includes('start') || q.includes('how to learn') || q.includes('drawing') ||
    q.includes('painting skill')
  ) {
    return `Yes, absolutely! More than 80% of our 54,000+ students started with zero art or drawing background. Resin is all about following the right chemical ratios, temperature control, and pouring sequence step-by-step. What kind of project are you hoping to create first?`;
  }

  // ─── 6. BUSINESS & EARNING MONEY ───
  if (
    q.includes('money') || q.includes('earn') || q.includes('business') ||
    q.includes('sell') || q.includes('profit') || q.includes('income') ||
    q.includes('client') || q.includes('market')
  ) {
    return `Our students earn between ₹20,000 and ₹75,000/month by focusing on high-margin custom orders — small items sell for ₹800–₹1,800, while geode clocks and varmala blocks command ₹5,000 to ₹25,000+. In Level 3, we specifically teach Reels marketing and pricing psychology so clients reach out to you. What monthly earnings goal do you have in mind?`;
  }

  // ─── 7. TECHNICAL TIPS: BUBBLES, RATIOS, SAFETY ───
  if (
    q.includes('bubble') || q.includes('ratio') || q.includes('mix') ||
    q.includes('cure') || q.includes('sticky') || q.includes('safety') ||
    q.includes('mask') || q.includes('toxic') || q.includes('tool') ||
    q.includes('heat gun') || q.includes('mold') || q.includes('mould')
  ) {
    return `Always mix strictly according to your resin's ratio (2:1 or 3:1) and stir slowly for 3–5 minutes scraping the sides and bottom. To eliminate bubbles, warm the resin bottles in lukewarm water before mixing and pass a heat gun 3 inches above the surface. Are you currently experiencing bubbles or sticky spots on a piece?`;
  }

  // ─── 8. LMS PLATFORM FEATURES: XP, ATTENDANCE, CERTIFICATES ───
  if (
    q.includes('xp') || q.includes('attendance') || q.includes('certificate') ||
    q.includes('streak') || q.includes('dashboard') || q.includes('login') ||
    q.includes('community') || q.includes('where to watch') || q.includes('password')
  ) {
    return `Enrolled students earn 100 XP for attending weekly live masterclasses with Vrajangna Patel, build daily streaks, and submit project photos for verified certificates. You can access your enrolled courses directly from the student portal below. Are you already enrolled with us?`;
  }

  // ─── 9. GENERAL ART QUESTION / STUDIO GREETING ───
  if (isOngoing) {
    return `I can guide you through any of our 30 academy courses, membership pricing, or upcoming masterclass sessions with Vrajangna Patel. What kind of resin project or question do you have in mind?`;
  }

  return `Welcome to Ravishing Art Hub! I'm Vraj, your art advisor. Whether you're curious about our courses, membership tiers, or upcoming live masterclasses with Vrajangna Patel, I'm here to help. What would you like to create or explore today?`;
}

