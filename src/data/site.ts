export const site = {
  name: "Alphinist Lab",
  tagline: "AI made simple for your business.",
  description:
    "Alphinist Lab builds AI voice assistants, smart integrations, and custom AI solutions that automate the work in your business.",
  email: "contact@alphinistlab.com",
  phone: "+91 88254 19713",
  website: "www.alphinistlab.com",
  location: "OMR, Sholinganallur, Chennai, Tamil Nadu",
  parent: {
    name: "Zithtech",
    url: "https://www.zithtech.com/",
    tagline: "Your transparent software partner",
  },
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
];

// Industries we build for. `shipped` marks the ones backed by a delivered product in the showcase.
export const industries = [
  {
    slug: "education",
    name: "Education",
    line: "Voice assistants that give parents, teachers and principals instant answers.",
    uses: ["School ERP", "Fees & attendance", "Parent updates"],
    shipped: "PACO AI",
  },
  {
    slug: "lending",
    name: "Lending & finance",
    line: "Collections apps that read handwritten ledgers and match UPI to the bank.",
    uses: ["Daily collections", "Ledger digitisation", "UPI matching"],
    shipped: "TickBook",
  },
  {
    slug: "retail",
    name: "Retail & distribution",
    line: "Orders, stock and sales in one place, with forecasts you can act on.",
    uses: ["Inventory dashboards", "Demand forecasts", "Order assistants"],
  },
  {
    slug: "healthcare",
    name: "Healthcare & clinics",
    line: "Appointment assistants, digitised records and reminders in the patient's language.",
    uses: ["Appointments", "Record digitisation", "Reminders"],
  },
  {
    slug: "logistics",
    name: "Logistics & field teams",
    line: "Voice entry for staff on the move, and daily reports that write themselves.",
    uses: ["Field data entry", "Tracking", "Daily reports"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    line: "Production and quality data piped into live dashboards and alerts.",
    uses: ["Production dashboards", "Quality data", "Alerts"],
  },
];

// The technology stack, top layer (what people touch) to bottom layer (where data lives).
export const techLayers = [
  {
    name: "Interfaces",
    line: "Where people meet the software: web, mobile, voice and chat.",
    tech: ["React", "Astro", "Tailwind", "Voice UI", "Chat UI"],
  },
  {
    name: "Intelligence",
    line: "Models that listen, read, reason and act, wired to your rules.",
    tech: ["LLM agents + tools", "RAG", "Whisper STT", "Neural TTS", "Gemini Vision OCR"],
  },
  {
    name: "Applications & APIs",
    line: "The backend that runs your business logic and talks to your systems.",
    tech: ["FastAPI", "Laravel", "REST APIs", "Roles & permissions", "Integrations"],
  },
  {
    name: "Data",
    line: "Pipelines and stores that keep every number correct as you grow.",
    tech: ["PostgreSQL", "ETL / ELT", "Warehouses", "Dashboards"],
  },
];

// The two products in the "Selected work" showcase. Every name and figure in their motion cards is sample data.
export const projects = [
  {
    slug: "paco-ai",
    title: "PACO AI",
    category: "Voice assistant for a school ERP",
    summary:
      "Parents, teachers and principals ask by voice or text, in English or Tamil, and get the answer from the school's own records. Every answer follows the person's role.",
    tags: ["Voice & text", "English · தமிழ்", "Role-based answers", "School ERP"],
    youtubeId: "y4kyhvUHSbQ",
  },
  {
    slug: "tickbook",
    title: "TickBook",
    category: "Collections app for daily and interest-only lenders",
    summary:
      "Type it, say it, or upload your handwritten pages. TickBook records every collection, matches UPI to your bank, and has the answers ready next morning.",
    tags: ["Handwritten Tamil", "Voice entry", "UPI matching", "Daily & interest loans"],
    youtubeId: "Y3fTaktrOzk",
  },
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
