export const site = {
  name: "Lightspeed Lab",
  tagline: "Software & AI, engineered.",
  description:
    "Lightspeed Lab builds web applications, AI systems, and data platforms for teams that need to move fast without breaking things.",
  email: "hello@lightspeedlab.in",
};

export const stack = [
  "FastAPI",
  "React",
  "Laravel",
  "PostgreSQL",
  "Gemini Vision OCR",
  "Whisper STT",
  "Neural TTS",
  "RAG systems",
  "AI agents + tools",
];

export const services = [
  {
    slug: "web-development",
    title: "Web Development",
    summary:
      "Fast, accessible, production-grade web apps and marketing sites built with modern frameworks.",
    points: [
      "Full-stack web applications",
      "Marketing & landing pages",
      "API design & integration",
      "Integration with existing systems",
      "Performance & SEO optimization",
    ],
  },
  {
    slug: "agentic-generative-ai",
    title: "Agentic & Generative AI",
    summary:
      "Agents, assistants and chatbots that do real work inside your product — not demos.",
    points: [
      "AI agents with tool use",
      "Chatbots & voice assistants",
      "RAG & knowledge-base systems",
      "Multilingual conversation",
      "Document & handwriting OCR",
      "Model integration & fine-tuning",
    ],
  },
  {
    slug: "data-science-analysis",
    title: "Data Science & Analysis",
    summary:
      "Turning raw data into decisions — analysis, modeling, and reporting that hold up under scrutiny.",
    points: [
      "Exploratory data analysis",
      "Predictive modeling",
      "Dashboards & reporting",
      "Statistical & business insights",
    ],
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    summary:
      "The plumbing underneath: pipelines, warehouses and schemas that stay correct as volume grows.",
    points: [
      "ETL / ELT pipelines",
      "Warehouse & schema design",
      "Database migration & modernization",
      "Data quality & validation",
    ],
  },
  {
    slug: "ai-data-automation",
    title: "AI & Data Automation",
    summary:
      "Automating the repetitive work — pipelines, workflows, and AI agents that run without you.",
    points: [
      "Workflow & process automation",
      "AI agent automation",
      "Legacy record migration",
      "Scheduled reporting & alerts",
    ],
  },
];

export const projects = [
  {
    slug: "gg-fin",
    title: "GG Fin — Ledger Modernization Platform",
    category: "AI Development",
    status: "Completed",
    summary:
      "Took decades of handwritten paper ledgers to a full digital platform. A Gemini Vision OCR pipeline reads the old Tamil-handwritten pages — mixed scripts, numerals and inconsistent hands — and migrates them into structured records, voice replaces manual data entry, and collections, debts, and daily totals are tracked in real time.",
    tags: ["FastAPI", "React", "PostgreSQL", "Gemini Vision OCR", "Whisper STT"],
    testimonial: {
      quote:
        "For years we ran everything out of notebooks — collections, debts, daily totals, all handwritten in Tamil. Digitizing that felt impossible until I saw it actually reading our old ledgers and taking entries by voice. Now I get a clear picture of the business every single day instead of chasing numbers at month-end.",
      name: "Ganapati",
      role: "Founder & CEO, GG Fin",
    },
  },
  {
    slug: "paco",
    title: "PACO — AI Assistant for School ERP",
    category: "AI Development",
    status: "In development",
    link: "https://pacoschool.in/",
    linkLabel: "pacoschool.in",
    summary:
      "A conversational assistant built into an end-to-end school management ERP used by 50+ schools. Principals, teachers, parents and students ask questions in plain language — by text or voice, in Tamil, Telugu, Hindi, Kannada or English — and get a concise spoken or written answer instead of navigating modules, filters and reports. The AI layer handles intent, tool selection and multilingual phrasing; the existing Laravel backend stays the system of record, so authentication, permissions and business rules govern every answer. Built for low latency on older Android devices and reusable by the mobile app.",
    summaryParagraphs: [
      "A conversational assistant built into an end-to-end school management ERP used by 50+ schools. Principals, teachers, parents and students ask questions in plain language — by text or voice, in Tamil, Telugu, Hindi, Kannada or English — and get a concise spoken or written answer instead of navigating modules, filters and reports.",
      "The AI layer handles intent, tool selection and multilingual phrasing; the existing Laravel backend stays the system of record, so authentication, permissions and business rules govern every answer. Built for low latency on older Android devices and reusable by the mobile app.",
    ],
    tags: ["Laravel", "PostgreSQL", "LLM agent + tools", "Speech to text", "Text to speech", "5 languages"],
    asks: [
      { mode: "VOICE", text: "இன்று எத்தனை ஆசிரியர்கள் விடுப்பில் இருக்கிறார்கள்?" },
      { mode: "CHAT", text: "How much school fee is pending, and till which term?" },
      { mode: "CHAT", text: "Which students scored below 40 in the last exam?" },
    ],
  },
];

export const languages = [
  { native: "தமிழ்", name: "Tamil" },
  { native: "తెలుగు", name: "Telugu" },
  { native: "हिन्दी", name: "Hindi" },
  { native: "ಕನ್ನಡ", name: "Kannada" },
  { native: "English", name: "English" },
];

export const process = [
  {
    step: "01",
    title: "Discover",
    description: "We dig into the problem, constraints, and goals before writing a line of code.",
  },
  {
    step: "02",
    title: "Design",
    description: "Architecture and scope are mapped out so there are no surprises mid-build.",
  },
  {
    step: "03",
    title: "Build",
    description: "Iterative development with regular check-ins, not a black box until launch day.",
  },
  {
    step: "04",
    title: "Ship & Support",
    description: "Deployed, documented, and supported after launch — not abandoned at handoff.",
  },
];
