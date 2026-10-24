export const site = {
  name: "Alphinist Lab",
  tagline: "AI made simple for your business.",
  description:
    "Alphinist Lab builds AI voice assistants, smart integrations, and custom AI solutions that automate the work in your business.",
  email: "contact@alphinistlab.com",
  phone: "+91 88254 19713",
  website: "www.alphinistlab.com",
  location: "OMR, Sholinganallur, Chennai, Tamil Nadu",
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
