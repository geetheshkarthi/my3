import { articleSources } from "./articles";
import websiteDetails from "./websites.json";
/** My3 Digital Academy website (opens in a new tab from the header). */
export const academyUrl = "https://my3-digital-academy.my3-digital-in.workers.dev/";

export const IMG = "https://framerusercontent.com/images/";
export const img = (f: string, w = 1200) => (f.startsWith("/") ? f : `${IMG}${f}?width=${w}`);

export const contact = {
  email: "info@my3digital.com",
  phone: "+91 77801 96804",
  phoneHref: "tel:+917780196804",
  hyderabad: "Asian Suncity, Kondapur, Hyderabad, Telangana.",
  bangalore: "Our Bangalore operations.",
};

export const nav = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Our Work", to: "/work" },
  { label: "Insights", to: "/insights" },
  { label: "Webinars", to: "/webinars" },
  { label: "Contact", to: "/contact" },
] as const;

export const stats: [string, string, string, string][] = [
  ["Websites Delivered", "500", "+", "md:col-span-3"],
  ["Team Members", "25", "+", "md:col-span-2"],
  ["Digital Capabilities", "360", "°", "md:col-span-2"],
  ["Operating Cities — Hyderabad & Bangalore", "2", "", "md:col-span-3"],
];

export type Division = { slug: string; title: string; short: string; eyebrow: string; heading: string; intro: string[]; items: [string, string][]; extra?: string; cta: string };
export const divisions: Division[] = [
  {
    slug: "website-development", title: "Website Development & Digital Experiences", short: "Website Development",
    eyebrow: "Design · Development · Technology",
    heading: "Digital Experiences That Make an Impression. Websites That Deliver Performance.",
    intro: [
      "Your website is often the first meaningful interaction someone has with your business. It should do more than establish an online presence. It should communicate your value, build confidence and create opportunities.",
      "At My3 Digital, we design and develop websites that bring together visual sophistication, seamless user experiences and dependable technology. Every experience is thoughtfully planned around your brand, audience and business objectives.",
    ],
    items: [
      ["Corporate Website Development", "Professionally designed corporate websites that establish credibility, communicate your expertise and present your business with clarity."],
      ["E-commerce Website Development", "High-performance online stores designed to simplify shopping, improve product discovery and create seamless purchasing experiences."],
      ["Custom Website Development", "Tailor-made digital solutions developed around your specific requirements, functionality and business workflows."],
      ["3D & Interactive Website Development", "Immersive digital experiences featuring sophisticated animations, interactive elements, 3D visuals and engaging transitions."],
      ["UI/UX Design", "Intuitive interfaces and carefully structured user journeys that balance aesthetics, usability and conversion objectives."],
      ["Landing Page Development", "Purpose-built landing pages designed around specific campaigns, audiences and conversion goals."],
      ["Website Redesign & Revamp", "Transforming outdated websites into modern, responsive and visually compelling digital experiences."],
      ["Website Maintenance & Optimisation", "Technical improvements, performance optimisation, updates and ongoing support based on your requirements."],
    ],
    extra: "WordPress · Shopify · WooCommerce · Custom Development · Modern Web Technologies",
    cta: "Let's Build Your Website",
  },
  {
    slug: "branding-creative", title: "Branding & Creative Identity", short: "Branding & Creative",
    eyebrow: "Strategy · Identity · Creativity",
    heading: "Build a Brand That Is Recognised Before It Is Remembered.",
    intro: [
      "A strong brand is not defined by its logo alone. It is the perception, identity and experience that people associate with your business.",
      "We create cohesive brand identities that capture your vision, communicate your positioning and establish a distinctive presence in the market.",
    ],
    items: [
      ["Brand Strategy", "Brand positioning, audience understanding, differentiation and communication direction."],
      ["Logo Design", "Distinctive logo concepts designed to reflect your brand's personality and positioning."],
      ["Visual Identity Design", "Typography, colour systems, visual language and brand elements."],
      ["Brand Guidelines", "A comprehensive framework for maintaining consistency across platforms and communication."],
      ["Packaging Design", "Thoughtfully designed product packaging that enhances recognition and shelf presence."],
      ["Graphic Design", "Marketing creatives, brochures, presentations, digital assets and promotional materials."],
      ["Creative Direction", "A cohesive visual direction across campaigns, content and brand touchpoints."],
      ["Copywriting", "Brand messaging, website copy, campaign communication and marketing content."],
    ],
    cta: "Create Your Brand Identity",
  },
  {
    slug: "performance-marketing", title: "Performance Marketing & Paid Advertising", short: "Performance Marketing",
    eyebrow: "Advertising · Acquisition · Performance",
    heading: "Reach the Right Audience. Turn Attention Into Opportunity.",
    intro: [
      "Advertising is not simply about reaching more people. It is about reaching the right people with the right message at the right moment.",
      "We develop data-informed advertising strategies that help businesses generate qualified enquiries, increase product visibility and improve campaign efficiency. Our approach combines audience research, creative development, campaign management and continuous optimisation.",
    ],
    items: [
      ["Google Ads Management", "Capture high-intent audiences actively searching for your products and services through strategically managed search campaigns."],
      ["Meta Ads Management", "Reach and engage relevant audiences through Facebook and Instagram advertising, with creative-led campaigns built around your business objectives."],
      ["LinkedIn Advertising", "Connect with decision-makers, professionals and business audiences through targeted B2B advertising campaigns."],
      ["Lead Generation Campaigns", "Develop campaigns designed to attract relevant enquiries and create opportunities for your sales team."],
      ["E-commerce Performance Marketing", "Drive product discovery, website traffic and online purchases through structured acquisition and retargeting campaigns."],
      ["Creative Strategy & Ad Production", "Develop compelling advertising concepts, copy and creatives aligned with audience behaviour and campaign objectives."],
      ["Campaign Optimisation & Reporting", "Monitor campaign performance, evaluate key metrics and make informed adjustments to improve efficiency."],
    ],
    cta: "Plan Your Next Campaign",
  },
  {
    slug: "digital-marketing", title: "Digital Marketing & Online Growth", short: "Digital Marketing",
    eyebrow: "Visibility · Content · Growth",
    heading: "Build Visibility. Establish Authority. Stay Relevant.",
    intro: [
      "A strong digital presence requires consistency, strategic communication and a clear understanding of your audience.",
      "We help businesses strengthen their online presence through integrated marketing strategies that improve discoverability, build brand trust and create meaningful engagement.",
    ],
    items: [
      ["Search Engine Optimisation (SEO)", "Improve your website's search visibility through technical SEO, keyword strategy, on-page optimisation, content development and authority building."],
      ["Social Media Marketing", "Build a consistent social presence through content planning, creative development, platform management and audience engagement."],
      ["Personal Branding", "Position founders, professionals and industry experts through strategic content, professional video production, reels and social media presence."],
      ["Online Reputation Management (ORM)", "Monitor and strengthen how your brand is perceived online through reputation management and review strategies."],
      ["Content Marketing", "Create relevant, valuable content that educates your audience, communicates your expertise and supports your wider marketing strategy."],
      ["Email Marketing", "Develop structured email campaigns that nurture prospects, communicate with customers and support retention."],
      ["WhatsApp Marketing", "Leverage business messaging and communication workflows to engage customers and support enquiry management."],
    ],
    cta: "Strengthen Your Digital Presence",
  },
  {
    slug: "technology-automation", title: "Technology, Automation & Digital Consulting", short: "Technology & Automation",
    eyebrow: "Intelligence · Integration · Innovation",
    heading: "Smarter Systems. More Connected Businesses.",
    intro: [
      "Technology should simplify the way businesses operate, not make things more complicated.",
      "We help businesses identify opportunities to streamline processes, connect digital platforms and introduce intelligent automation into their operations. From CRM integration to AI-powered customer interactions, we build solutions that support efficiency and scalability.",
    ],
    items: [
      ["CRM Integration & Automation", "Connect your customer management systems with business workflows to organise leads, streamline follow-ups and improve visibility."],
      ["WhatsApp Automation", "Build automated communication journeys for enquiries, customer support, notifications and follow-ups."],
      ["AI Chatbots", "Integrate intelligent conversational experiences that assist website visitors and help businesses manage routine customer interactions."],
      ["Workflow Automation", "Simplify repetitive processes by connecting tools, platforms and operational workflows."],
      ["Market Research", "Understand your market, competitors, customer behaviour and business opportunities before making important decisions."],
      ["Go-To-Market Strategy", "Develop strategic approaches for introducing products, entering markets and reaching the right audiences."],
      ["Digital Consulting", "Identify gaps in your existing digital ecosystem and develop practical recommendations for improvement."],
    ],
    cta: "Explore Smarter Solutions",
  },
];

export const capabilities: [string, string, string][] = [
  ["Website Development & Digital Experiences", "We design and develop sophisticated digital platforms that combine aesthetics, functionality and performance.", "Corporate Websites · E-commerce · Custom Development · Interactive Websites · Landing Pages"],
  ["Branding & Creative", "We create distinctive brand identities that establish recognition, communicate value and build lasting impressions.", "Brand Strategy · Logo Design · Visual Identity · Packaging · Creative Direction"],
  ["Performance Marketing", "We develop and manage strategic advertising campaigns designed to reach the right audience and generate meaningful business opportunities.", "Google Ads · Meta Ads · LinkedIn Ads · Lead Generation · Campaign Strategy"],
  ["Digital Marketing & Content", "We help brands build visibility, strengthen their digital presence and create meaningful connections with their audiences.", "SEO · Social Media Marketing · Content Strategy · Personal Branding · ORM"],
  ["Technology & Automation", "We integrate intelligent technology and automated workflows to simplify operations, improve efficiency and create connected digital experiences.", "CRM Integration · WhatsApp Automation · AI Chatbots · Workflow Automation"],
];

export const approach: [string, string][] = [
  ["Strategy Before Execution", "Every project begins with understanding your business, audience, objectives and market."],
  ["Design With Purpose", "We believe exceptional design should do more than look impressive. It should communicate, engage and create value."],
  ["Technology That Works", "We develop reliable, scalable and performance-focused digital solutions built around your business requirements."],
  ["Execution That Matters", "We focus on thoughtful implementation, measurable objectives and continuous improvement."],
  ["A Collaborative Partnership", "We work closely with our clients, maintaining transparency and ownership throughout the engagement."],
];

export const process: [string, string][] = [
  ["Discover", "We understand your business, objectives, audience, competition and expectations."],
  ["Strategise", "We define the creative direction, technical approach and execution roadmap."],
  ["Design", "We translate the strategy into meaningful visual experiences and user journeys."],
  ["Develop & Execute", "Our team brings the approved direction to life through development, implementation and execution."],
  ["Refine & Deliver", "We test, optimise and deliver the final solution, ensuring everything is ready for launch."],
];

export const industries = ["Fashion & Lifestyle", "Beauty & Wellness", "Food & Beverage", "Real Estate & Interiors", "Healthcare & Professional Services", "Technology & SaaS", "Education & Consulting", "Retail & E-commerce"];

export const pillars: [string, string, string][] = [
  ["Digital Experiences", "Websites & technology", "Sophisticated, high-performance websites and e-commerce platforms — not just ordinary websites."],
  ["Brand Identity", "Branding & creativity", "Brands that command attention through branding, creative direction, content and digital presence."],
  ["Digital Growth", "Marketing & performance", "Digital presence turned into business growth through performance marketing, SEO and strategic execution."],
  ["Intelligent Automation", "Technology & systems", "Connected systems, CRM integration and AI-powered interactions that help businesses operate more efficiently."],
];

export const values: [string, string][] = [
  ["Integrity in Every Interaction", "We value honest communication, realistic expectations and transparent working relationships."],
  ["Excellence in Execution", "We believe every detail matters, from the first creative concept to the final delivery."],
  ["Innovation With Intention", "We embrace emerging technologies and new ideas when they create genuine value."],
  ["Accountability & Ownership", "We take responsibility for our work, our commitments and the quality of our execution."],
  ["Collaboration Over Transactions", "We believe the strongest outcomes come from working together, understanding our clients and building long-term relationships."],
  ["Continuous Evolution", "Digital never stands still. Neither do we. We continuously learn, adapt and improve."],
];

export type Project = { slug: string; name: string; category: string; image: string; summary: string; scope: string[] };
export const projects: Project[] = [
  { slug: "aurelia-living", name: "Aurelia Living", category: "Website Development", image: "xI9E3S6iH41RiUFn2SU3im7jZY.png", summary: "A refined corporate website for a premium interiors studio, built to present its portfolio with clarity and generate qualified design enquiries.", scope: ["UI/UX Design", "Corporate Website Development", "SEO Foundations"] },
  { slug: "verde-botanics", name: "Verde Botanics", category: "E-commerce Development", image: "m8VezOrPRQrqXZ9HqQraGhrSiAM.png", summary: "A Shopify storefront for a natural skincare label, designed around product discovery, ingredient storytelling and a seamless checkout.", scope: ["Shopify Development", "Product Photography Direction", "Conversion Optimisation"] },
  { slug: "saffron-and-co", name: "Saffron & Co.", category: "Branding & Packaging", image: "RQ1gslathz3HEce33oz3ZKjbWI.png", summary: "A complete brand identity and packaging system for a ritual-inspired wellness range, from logo to shelf presence.", scope: ["Brand Strategy", "Visual Identity", "Packaging Design"] },
  { slug: "northline-grooming", name: "Northline Grooming", category: "Digital Marketing", image: "GGCsWA8LjYu1QKmliG0pIVgh6E.png", summary: "An integrated social and performance campaign that introduced a men's grooming brand to new audiences across Instagram and Google.", scope: ["Meta Ads", "Google Ads", "Social Media Marketing"] },
  { slug: "blue-tide-labs", name: "Blue Tide Labs", category: "Interactive Digital Experiences", image: "vse8xy6LXbKEqdBYHYYg5I1UrxU.webp", summary: "An immersive product launch website with scroll-driven motion and 3D product moments for a haircare innovation brand.", scope: ["3D & Interactive Development", "Creative Direction", "Landing Pages"] },
];

export const gallery = ["K6JSUhg1G2HWZJVcv79gP03sec.jpg", "GXf9Wl0jnBpg9F6HcjTRxnGz7Ng.png", "q9IraMwoO3NDSCliMcU69QA.jpg", "uS1mItvvj9GLldsKjU2D6ydU8FY.png", "i897zPDwT7rromKYXXzo3bOG21Y.png", "BD63fmo6xYaHDhSeb0V56KpsI.jpg", "Nx4ThBPMIraErRqvHKdFT7KzoPc.jpg", "TtZcaJa7zpLkixwTz1chxH40Gfc.png", "jHMXRkzsN5Qm1zv9maNddhxgfC4.jpg", "oWAdmBIeqObr4ebyHgIdjCXlgco.jpg"];

export type Article = { slug: string; category: string; title: string; excerpt: string; image: string; date: string; read: string; body: [string, string][]; service: string; cta: string };

/** Turns the article markup in articles.ts ("## Heading" sections) into [heading, text] pairs. */
export const articles: Article[] = articleSources.map((a) => {
  const body = a.content.split(/^## /m).map((x) => x.trim()).filter(Boolean).map((sec) => {
    const i = sec.indexOf("\n");
    return [sec.slice(0, i).trim(), sec.slice(i + 1).trim()] as [string, string];
  });
  const words = a.content.split(/\s+/).length;
  return { slug: a.slug, category: a.category, title: a.title, excerpt: a.excerpt, image: a.image, date: a.date, read: `${Math.max(3, Math.round(words / 220))} min read`, body, service: a.service, cta: a.cta };
});

export type Webinar = { slug: string; title: string; date: string; time: string; duration: string; price: number; host: string; image: string; summary: string; agenda: string[]; audience: string };
export const webinars: Webinar[] = [
  { slug: "premium-websites-that-convert", title: "Premium Websites That Convert: Design Principles for 2027", date: "10 Dec 2026", time: "6:00 PM IST", duration: "60 minutes", price: 499, host: "My3 Digital Web Team", image: "/insights/premium-websites-that-convert.jpg", summary: "A practical session on the typography, structure, performance and user journeys that make a website feel premium — and generate enquiries.", agenda: ["What visitors judge in the first five seconds", "Typography, space and visual hierarchy", "Performance and Core Web Vitals", "Live website teardown and Q&A"], audience: "Founders, marketing managers and business owners planning a new website or redesign." },
  { slug: "meta-vs-google-ads-masterclass", title: "Meta vs Google Ads Masterclass: Where Should Your Budget Go?", date: "17 Dec 2026", time: "6:00 PM IST", duration: "75 minutes", price: 799, host: "My3 Performance Marketing Team", image: "/insights/meta-vs-google-ads-masterclass.jpg", summary: "Understand the difference between intent-based and demand-generation advertising, and how to plan a budget that supports your business objectives.", agenda: ["Intent vs demand: choosing the right platform", "Structuring campaigns for lead generation", "Creative that performs", "Measurement, reporting and optimisation"], audience: "Business owners and marketers running or planning paid advertising campaigns." },
  { slug: "automation-for-growing-businesses", title: "WhatsApp Automation & AI Chatbots for Growing Businesses", date: "8 Jan 2027", time: "5:30 PM IST", duration: "60 minutes", price: 0, host: "My3 Technology Team", image: "/insights/automation-for-growing-businesses.jpg", summary: "See how automated enquiry handling, follow-ups and AI-assisted conversations can save time and improve customer experience.", agenda: ["Where automation makes sense", "WhatsApp journeys for enquiries and support", "AI chatbots on your website", "CRM integration essentials"], audience: "Teams handling a growing volume of enquiries and customer conversations." },
];

export const hero = {
  eyebrow: "Digital craft, elevated",
  title: "Digital Excellence. Engineered for Growth.",
  text: "A premium digital agency creating exceptional websites, distinctive brands and intelligent growth strategies for ambitious businesses",
};

export const capabilityImages = ["/capabilities/c1.jpg", "/capabilities/c2.jpg", "/capabilities/c3.jpg", "/capabilities/c4.jpg", "/capabilities/c5.jpg"];

/** One photo per industry, in the same order as `industries`. */
export const industryImages = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/industries/i${n}.jpg`);

/** Website showcase (same videos and details as the Our Work page; the details live in websites.json). */
export type Website = { title: string; category: string; url: string; about: string; brief: string; did: string[]; video: string; poster: string };
export const websites: Website[] = websiteDetails.map((d, i) => ({ ...d, video: `/work-showcase/Portfolio_videos/p${i + 1}.webm`, poster: `/work-showcase/Portfolio_videos/p${i + 1}.webp` }));
