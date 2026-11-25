import { articles, divisions, pillars } from "@/content/site";

/**
 * 100% Real-World Original Photography mapped from `public/insights/` and `public/industries/`
 * across every single one of the 37 deliverables in `divisions` (zero external stock or AI renders).
 */
export const capabilityImages: Record<string, string> = {
  // Division 01: Website Development & Digital Experiences
  "Corporate Website Development": "/insights/premium-websites-that-convert.jpg",
  "E-commerce Website Development": "/insights/shopify-vs-wordpress-which-is-better.jpg",
  "Custom Website Development": "/insights/what-makes-a-website-look-premium.jpg",
  "3D & Interactive Website Development": "/insights/3d-interactive-websites-future-of-web-design.jpg",
  "UI/UX Design": "/insights/when-to-redesign-your-website.jpg",
  "Landing Page Development": "/insights/premium-websites-that-convert.jpg",
  "Website Redesign & Revamp": "/insights/when-to-redesign-your-website.jpg",
  "Website Maintenance & Optimisation": "/industries/i6.jpg",

  // Division 02: Branding & Creative Identity
  "Brand Strategy": "/insights/website-branding-and-marketing-working-together.jpg",
  "Logo Design": "/insights/why-your-business-needs-more-than-a-logo.jpg",
  "Visual Identity Design": "/insights/why-your-business-needs-more-than-a-logo.jpg",
  "Brand Guidelines": "/insights/website-branding-and-marketing-working-together.jpg",
  "Packaging Design": "/industries/i2.jpg",
  "Graphic Design": "/industries/i1.jpg",
  "Creative Direction": "/insights/personal-branding-for-business-owners.jpg",
  Copywriting: "/insights/why-digital-marketing-needs-a-strategy.jpg",

  // Division 03: Performance Marketing & Paid Advertising
  "Google Ads Management": "/insights/meta-ads-vs-google-ads.jpg",
  "Meta Ads Management": "/insights/meta-vs-google-ads-masterclass.jpg",
  "LinkedIn Advertising": "/insights/personal-branding-for-business-owners.jpg",
  "Lead Generation Campaigns": "/insights/why-digital-marketing-needs-a-strategy.jpg",
  "E-commerce Performance Marketing": "/insights/why-ecommerce-websites-fail-to-convert.jpg",
  "Creative Strategy & Ad Production": "/industries/i8.jpg",
  "Campaign Optimisation & Reporting": "/insights/meta-ads-vs-google-ads.jpg",

  // Division 04: Digital Marketing & Online Growth
  "Search Engine Optimisation (SEO)": "/insights/seo-strategy-for-businesses-2026.jpg",
  "Social Media Marketing": "/insights/meta-vs-google-ads-masterclass.jpg",
  "Personal Branding": "/insights/personal-branding-for-business-owners.jpg",
  "Online Reputation Management (ORM)": "/industries/i4.jpg",
  "Content Marketing": "/insights/why-digital-marketing-needs-a-strategy.jpg",
  "Email Marketing": "/insights/why-ecommerce-websites-fail-to-convert.jpg",
  "WhatsApp Marketing": "/insights/ai-chatbots-whatsapp-automation-businesses.jpg",

  // Division 05: Technology, Automation & Digital Consulting
  "CRM Integration & Automation": "/insights/automation-for-growing-businesses.jpg",
  "WhatsApp Automation": "/insights/ai-chatbots-whatsapp-automation-businesses.jpg",
  "AI Chatbots": "/insights/3d-interactive-websites-future-of-web-design.jpg",
  "Workflow Automation": "/insights/automation-for-growing-businesses.jpg",
  "Market Research": "/industries/i7.jpg",
  "Go-To-Market Strategy": "/insights/website-branding-and-marketing-working-together.jpg",
  "Digital Consulting": "/industries/i5.jpg",
};

export type ServiceCardItem = {
  id: string;
  slug: string;
  handle: string;
  title: string;
  category: string;
  subtitle: string;
  image: string;
  focalPosition?: string;
};

/** 15 Service Capability Cards powering Curved Waves, Carousel, Dock & 15-Tile Mosaic */
export const serviceCatalogCards: ServiceCardItem[] = [
  {
    id: "svc-web",
    slug: "website-development",
    handle: "@webcraft",
    title: "Corporate Websites",
    category: "Website Development",
    subtitle: "High-authority digital platforms built for clarity, performance, and enquiries.",
    image: "/insights/premium-websites-that-convert.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-uiux",
    slug: "website-development",
    handle: "@uiux",
    title: "UI/UX & Redesign",
    category: "Experience Design",
    subtitle: "Structured wireframes, intuitive user journeys, and high-converting layouts.",
    image: "/insights/when-to-redesign-your-website.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-ecom",
    slug: "website-development",
    handle: "@commerce",
    title: "E-Commerce Stores",
    category: "Digital Retail",
    subtitle: "Shopify, WooCommerce & custom stores engineered for effortless checkout.",
    image: "/insights/shopify-vs-wordpress-which-is-better.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-3d",
    slug: "website-development",
    handle: "@interactive",
    title: "3D & Interactive Web",
    category: "Interactive Motion",
    subtitle: "Immersive modern web experiences with tactile scroll motion and responsiveness.",
    image: "/insights/3d-interactive-websites-future-of-web-design.jpg",
    focalPosition: "center 30%",
  },
  {
    id: "svc-brand",
    slug: "branding-creative",
    handle: "@identity",
    title: "Brand Strategy & Identity",
    category: "Branding & Creative",
    subtitle: "Cohesive typography, visual systems, logo marks, and brand guidelines.",
    image: "/insights/why-your-business-needs-more-than-a-logo.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-ads",
    slug: "performance-marketing",
    handle: "@paidmedia",
    title: "Google & Meta Paid Ads",
    category: "Performance Marketing",
    subtitle: "High-intent search and paid social campaigns focused on measurable leads.",
    image: "/insights/meta-ads-vs-google-ads.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-seo",
    slug: "digital-marketing",
    handle: "@seogrowth",
    title: "SEO & Search Authority",
    category: "Online Growth",
    subtitle: "Technical optimisation, content clusters, and sustained organic visibility.",
    image: "/insights/seo-strategy-for-businesses-2026.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-crm",
    slug: "technology-automation",
    handle: "@automation",
    title: "CRM & AI Chatbots",
    category: "Technology & Systems",
    subtitle: "WhatsApp workflows, automated lead routing, and AI conversational assistants.",
    image: "/insights/ai-chatbots-whatsapp-automation-businesses.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-custom",
    slug: "website-development",
    handle: "@engineering",
    title: "Custom Web Systems",
    category: "Full-Stack Web",
    subtitle: "Tailor-made portals and responsive web applications aligned to workflows.",
    image: "/insights/what-makes-a-website-look-premium.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-guidelines",
    slug: "branding-creative",
    handle: "@ecosystems",
    title: "Integrated Brand Systems",
    category: "Design Systems",
    subtitle: "Unifying website design, brand positioning, and campaign messaging.",
    image: "/insights/website-branding-and-marketing-working-together.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-social",
    slug: "digital-marketing",
    handle: "@socialmedia",
    title: "Social Media & Paid Creative",
    category: "Audience Growth",
    subtitle: "Consistent creative distribution across Instagram, LinkedIn, and Meta.",
    image: "/insights/meta-vs-google-ads-masterclass.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-cro",
    slug: "performance-marketing",
    handle: "@conversion",
    title: "Conversion Architecture",
    category: "Paid Acquisition",
    subtitle: "E-commerce funnel diagnostics, landing pages, and ROAS optimisation.",
    image: "/insights/why-ecommerce-websites-fail-to-convert.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-personal",
    slug: "digital-marketing",
    handle: "@founders",
    title: "Personal Branding",
    category: "Founder Visibility",
    subtitle: "Executive positioning, editorial presence, and credible thought leadership.",
    image: "/insights/personal-branding-for-business-owners.jpg",
    focalPosition: "center 20%",
  },
  {
    id: "svc-workflow",
    slug: "technology-automation",
    handle: "@workflows",
    title: "Business Workflow Automation",
    category: "Operations Scale",
    subtitle: "Automated pipelines removing manual bottlenecks across sales & support.",
    image: "/insights/automation-for-growing-businesses.jpg",
    focalPosition: "center center",
  },
  {
    id: "svc-strategy",
    slug: "technology-automation",
    handle: "@consulting",
    title: "Digital Growth Strategy",
    category: "Advisory",
    subtitle: "Research-backed roadmaps connecting brand, web, and marketing execution.",
    image: "/insights/why-digital-marketing-needs-a-strategy.jpg",
    focalPosition: "center center",
  },
];

/** Hero 7-Card Arc (`-12°, -8°, -4°, 0°, +4°, +8°, +12°`) -> Shared-Element Deck -> Right Diagonal */
export const heroServiceCards = [
  {
    id: "hero-web",
    title: "Corporate Websites",
    category: "Division 01 · Web",
    handle: "@webcraft",
    image: "/insights/premium-websites-that-convert.jpg",
    slug: "website-development",
    heroRotate: -12,
    heroY: 32,
  },
  {
    id: "hero-uiux",
    title: "UI/UX & Redesign",
    category: "Experience Design",
    handle: "@uiux",
    image: "/insights/when-to-redesign-your-website.jpg",
    slug: "website-development",
    heroRotate: -8,
    heroY: 16,
  },
  {
    id: "hero-ecom",
    title: "E-Commerce Builds",
    category: "Digital Retail",
    handle: "@commerce",
    image: "/insights/shopify-vs-wordpress-which-is-better.jpg",
    slug: "website-development",
    heroRotate: -4,
    heroY: 4,
  },
  {
    id: "hero-3d",
    title: "3D & Interactive Web",
    category: "Motion Engineering",
    handle: "@interactive",
    image: "/insights/3d-interactive-websites-future-of-web-design.jpg",
    slug: "website-development",
    heroRotate: 0,
    heroY: -6,
  },
  {
    id: "hero-brand",
    title: "Brand & Identity",
    category: "Division 02 · Brand",
    handle: "@identity",
    image: "/insights/why-your-business-needs-more-than-a-logo.jpg",
    slug: "branding-creative",
    heroRotate: 4,
    heroY: 4,
  },
  {
    id: "hero-ads",
    title: "Performance Paid Ads",
    category: "Division 03 · Media",
    handle: "@paidmedia",
    image: "/insights/meta-ads-vs-google-ads.jpg",
    slug: "performance-marketing",
    heroRotate: 8,
    heroY: 16,
  },
  {
    id: "hero-ai",
    title: "CRM & AI Automation",
    category: "Division 05 · Systems",
    handle: "@automation",
    image: "/insights/ai-chatbots-whatsapp-automation-businesses.jpg",
    slug: "technology-automation",
    heroRotate: 12,
    heroY: 32,
  },
];

/** 6 Shared Cards for Stage 2: Stacked Center -> Diagonal Staircase -> Folder 3x2 Grid */
export const stageTwoSharedCards = [
  {
    id: "st2-web",
    handle: "@webcraft",
    title: "High-Converting Websites",
    category: "Division 01 · Web",
    metric: "8 Deliverables",
    image: "/insights/premium-websites-that-convert.jpg",
    slug: "website-development",
    stackRotate: -9,
    stairRotate: -7,
  },
  {
    id: "st2-brand",
    handle: "@identity",
    title: "Branding & Visual Systems",
    category: "Division 02 · Creative",
    metric: "8 Deliverables",
    image: "/insights/why-your-business-needs-more-than-a-logo.jpg",
    slug: "branding-creative",
    stackRotate: 6,
    stairRotate: 4,
  },
  {
    id: "st2-ads",
    handle: "@paidmedia",
    title: "Google & Meta Performance",
    category: "Division 03 · Paid",
    metric: "7 Deliverables",
    image: "/insights/meta-ads-vs-google-ads.jpg",
    slug: "performance-marketing",
    stackRotate: -4,
    stairRotate: -3,
  },
  {
    id: "st2-seo",
    handle: "@seogrowth",
    title: "SEO & Digital Presence",
    category: "Division 04 · Growth",
    metric: "7 Deliverables",
    image: "/insights/seo-strategy-for-businesses-2026.jpg",
    slug: "digital-marketing",
    stackRotate: 3,
    stairRotate: 3,
  },
  {
    id: "st2-ai",
    handle: "@automation",
    title: "AI Chatbots & CRM",
    category: "Division 05 · Tech",
    metric: "7 Deliverables",
    image: "/insights/ai-chatbots-whatsapp-automation-businesses.jpg",
    slug: "technology-automation",
    stackRotate: -5,
    stairRotate: -4,
  },
  {
    id: "st2-commerce",
    handle: "@commerce",
    title: "E-Commerce & UX Flows",
    category: "Retail & CRO",
    metric: "500+ Built",
    image: "/insights/shopify-vs-wordpress-which-is-better.jpg",
    slug: "website-development",
    stackRotate: 8,
    stairRotate: 6,
  },
];

/** Folder Toggle Alternate Cards: Key Industry Sectors Served (real photos from `public/industries/`) */
export const sectorGridCards = [
  {
    title: "Technology & SaaS",
    category: "Digital Products",
    metric: "Enterprise Web",
    image: "/industries/i6.jpg",
    slug: "technology-automation",
  },
  {
    title: "D2C & E-Commerce",
    category: "Retail Velocity",
    metric: "Storefronts & CRO",
    image: "/industries/i2.jpg",
    slug: "website-development",
  },
  {
    title: "Healthcare & Clinics",
    category: "Patient Trust",
    metric: "SEO & Bookings",
    image: "/industries/i5.jpg",
    slug: "digital-marketing",
  },
  {
    title: "Real Estate & Architecture",
    category: "High-Value Leads",
    metric: "Brand & Paid Ads",
    image: "/industries/i4.jpg",
    slug: "performance-marketing",
  },
  {
    title: "Fashion & Lifestyle",
    category: "Creative Direction",
    metric: "Visual Identity",
    image: "/industries/i1.jpg",
    slug: "branding-creative",
  },
  {
    title: "Retail & Hospitality",
    category: "Local & Omnichannel",
    metric: "Growth Campaigns",
    image: "/industries/i8.jpg",
    slug: "performance-marketing",
  },
];

/** Featured Editorial Spotlight Slides mapped strictly to the 5 real My3 divisions */
export const serviceSpotlights = [
  {
    slug: divisions[0]!.slug,
    title: divisions[0]!.heading,
    divisionLabel: "Division 01 · Website Development",
    image: "/insights/premium-websites-that-convert.jpg",
    tag: "@webcraft",
    category: divisions[0]!.eyebrow,
    desc: divisions[0]!.intro[0]!,
    cta: divisions[0]!.cta,
  },
  {
    slug: divisions[1]!.slug,
    title: divisions[1]!.heading,
    divisionLabel: "Division 02 · Branding & Creative",
    image: "/insights/website-branding-and-marketing-working-together.jpg",
    tag: "@identity",
    category: divisions[1]!.eyebrow,
    desc: divisions[1]!.intro[0]!,
    cta: divisions[1]!.cta,
  },
  {
    slug: divisions[2]!.slug,
    title: divisions[2]!.heading,
    divisionLabel: "Division 03 · Performance Ads",
    image: "/insights/meta-ads-vs-google-ads.jpg",
    tag: "@paidmedia",
    category: divisions[2]!.eyebrow,
    desc: divisions[2]!.intro[0]!,
    cta: divisions[2]!.cta,
  },
  {
    slug: divisions[3]!.slug,
    title: divisions[3]!.heading,
    divisionLabel: "Division 04 · Online Growth",
    image: "/insights/seo-strategy-for-businesses-2026.jpg",
    tag: "@visibility",
    category: divisions[3]!.eyebrow,
    desc: divisions[3]!.intro[0]!,
    cta: divisions[3]!.cta,
  },
  {
    slug: divisions[4]!.slug,
    title: divisions[4]!.heading,
    divisionLabel: "Division 05 · AI & Automation",
    image: "/insights/automation-for-growing-businesses.jpg",
    tag: "@automation",
    category: divisions[4]!.eyebrow,
    desc: divisions[4]!.intro[0]!,
    cta: divisions[4]!.cta,
  },
];

/** Verified Real Technology Platforms & Capabilities from `src/content/site.ts` (zero fabricated logos) */
export const platformCapabilities = [
  { name: "WORDPRESS", role: "Enterprise CMS" },
  { name: "SHOPIFY", role: "E-Commerce" },
  { name: "WOOCOMMERCE", role: "Online Stores" },
  { name: "CUSTOM CODE", role: "Web Applications" },
  { name: "GOOGLE ADS", role: "Search Intent" },
  { name: "META ADS", role: "Paid Social" },
  { name: "LINKEDIN ADS", role: "B2B Lead Gen" },
  { name: "TECHNICAL SEO", role: "Organic Growth" },
  { name: "WHATSAPP API", role: "Automation" },
  { name: "CRM PIPELINES", role: "Lead Routing" },
  { name: "AI CHATBOTS", role: "Support Workflows" },
];

/** 3 Real My3 Service Pillar Offerings for Section 18 (using genuine `pillars` copy from `site.ts`, no invented pricing) */
export const pillarOfferings = [
  {
    index: "01",
    eyebrow: pillars[0]![1],
    title: pillars[0]![0],
    summary: pillars[0]![2],
    scope: "Corporate Websites · E-Commerce · UI/UX Design · 3D & Interactive",
    divisionSlug: "website-development",
    accent: "#2456A4",
  },
  {
    index: "02",
    eyebrow: pillars[1]![1],
    title: pillars[1]![0],
    summary: pillars[1]![2],
    scope: "Brand Strategy · Logo & Visual Systems · Creative Direction · Guidelines",
    divisionSlug: "branding-creative",
    accent: "#1C4587",
  },
  {
    index: "03",
    eyebrow: `${pillars[2]![1]} & ${pillars[3]![1]}`,
    title: `${pillars[2]![0]} & Automation`,
    summary: `${pillars[2]![2]} ${pillars[3]![2]}`,
    scope: "SEO · Google & Meta Ads · CRM Integration · AI Chatbots · Workflows",
    divisionSlug: "performance-marketing",
    accent: "#163567",
  },
];

/** Featured editorial reads from `site.ts` `articles` for Bento enrichment */
export const bentoEditorialArticles = articles.slice(0, 4);

export const divisionTabLabels: Record<string, string> = {
  "website-development": "Websites",
  "branding-creative": "Branding",
  "performance-marketing": "Paid Ads",
  "digital-marketing": "Online Growth",
  "technology-automation": "Automation",
};
