export const site = {
  name: "Cortexa",
  tagline: "Software & AI, engineered.",
  description:
    "Cortexa builds web applications, AI systems, and data platforms for teams that need to move fast without breaking things.",
  email: "hello@cortexa.dev",
};

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
      "Performance & SEO optimization",
    ],
  },
  {
    slug: "ai-development",
    title: "AI Development",
    summary:
      "Custom AI features and products, from LLM-powered tools to model integration and fine-tuning.",
    points: [
      "LLM-powered applications & agents",
      "RAG & knowledge-base systems",
      "Model integration & fine-tuning",
      "AI feature prototyping",
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
    slug: "automation",
    title: "Data & AI Automation",
    summary:
      "Automating the repetitive work — pipelines, workflows, and AI agents that run without you.",
    points: [
      "Data pipeline automation",
      "Workflow & process automation",
      "AI agent automation",
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
      "Took a family finance business from handwritten paper ledgers to a full digital platform — AI reads and migrates the old Tamil-handwriting records, voice replaces manual data entry, and collections, debts, and daily totals are tracked in real time.",
    tags: ["FastAPI", "React", "PostgreSQL", "Gemini Vision OCR", "Whisper STT"],
    testimonial: {
      quote:
        "For years we ran everything out of notebooks — collections, debts, daily totals, all handwritten in Tamil. Digitizing that felt impossible until I saw it actually reading our old ledgers and taking entries by voice. Now I get a clear picture of the business every single day instead of chasing numbers at month-end.",
      name: "Ganapati",
      role: "Founder & CEO, GG Fin",
    },
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
