import type { PrepPriority, PrepTopic } from "@/lib/types/analysis";

export type JobRole =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "data"
  | "ml"
  | "devops"
  | "qa"
  | "security"
  | "general";

type CurriculumNode = {
  id: string;
  title: string;
  /** Why this topic matters for interviews */
  reason: string;
  /** Phrases that must appear in the JD to include this topic (unless alwaysForRole) */
  aliases: string[];
  subtopics: string[];
  alwaysForRoles?: JobRole[];
  /** If set, aliases only count when the detected role is one of these */
  aliasRoles?: JobRole[];
};

const ROLE_HINTS: Record<Exclude<JobRole, "general">, string[]> = {
  frontend: [
    "frontend",
    "front-end",
    "front end",
    "ui engineer",
    "react",
    "vue",
    "angular",
    "next.js",
    "css",
  ],
  backend: [
    "backend",
    "back-end",
    "back end",
    "server-side",
    "api engineer",
    "microservices",
    "spring boot",
    "django",
    "node.js",
  ],
  fullstack: ["full stack", "fullstack", "full-stack"],
  mobile: [
    "android",
    "ios",
    "mobile",
    "kotlin",
    "swift",
    "react native",
    "flutter",
  ],
  data: [
    "data engineer",
    "analytics",
    "etl",
    "warehouse",
    "spark",
    "snowflake",
    "dbt",
  ],
  ml: [
    "machine learning",
    "ml engineer",
    "deep learning",
    "nlp",
    "computer vision",
    "llm",
    "data scientist",
  ],
  devops: [
    "devops",
    "sre",
    "platform engineer",
    "kubernetes",
    "terraform",
    "ci/cd",
    "site reliability",
  ],
  qa: [
    "qa",
    "quality engineer",
    "sdet",
    "test automation",
    "quality assurance",
  ],
  security: [
    "security engineer",
    "appsec",
    "cybersecurity",
    "infosec",
    "penetration",
  ],
};

const CATALOG: CurriculumNode[] = [
  {
    id: "dsa",
    title: "Data structures & algorithms",
    reason:
      "Most software interviews start with coding rounds. Cover patterns, not random problems.",
    aliases: [
      "data structures",
      "algorithms",
      "coding",
      "leetcode",
      "problem solving",
      "dsa",
    ],
    alwaysForRoles: [
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "ml",
      "general",
    ],
    subtopics: [
      "Arrays, strings, hashing",
      "Two pointers / sliding window",
      "Stacks, queues, heaps",
      "Trees, graphs, BFS/DFS",
      "Dynamic programming (core patterns)",
      "Time and space complexity",
    ],
  },
  {
    id: "system-design",
    title: "System design",
    reason:
      "Mid/senior roles expect you to design scalable services and trade off consistency, latency, and cost.",
    aliases: [
      "system design",
      "distributed systems",
      "scalability",
      "architecture",
      "microservices",
      "high availability",
    ],
    alwaysForRoles: ["backend", "fullstack", "devops", "ml", "general"],
    subtopics: [
      "Requirements, capacity, and API sketch",
      "Load balancing, caching, CDNs",
      "SQL vs NoSQL and data modeling",
      "Queues, pub/sub, and async processing",
      "Consistency, replication, sharding",
      "Observability: logs, metrics, tracing",
    ],
  },
  {
    id: "behavioral",
    title: "Behavioral & leadership",
    reason:
      "Hiring managers test collaboration, ownership, and conflict handling with STAR stories.",
    aliases: [
      "leadership",
      "mentor",
      "cross-functional",
      "stakeholder",
      "communication",
      "agile",
      "scrum",
    ],
    alwaysForRoles: [
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "data",
      "ml",
      "devops",
      "qa",
      "security",
      "general",
    ],
    subtopics: [
      "STAR stories: impact, conflict, failure, ownership",
      "Working with PMs, design, and other teams",
      "Mentoring / code review examples",
      "Prioritization under ambiguity",
    ],
  },
  {
    id: "js-ts",
    title: "JavaScript & TypeScript",
    reason: "Core language depth for web and Node interviews.",
    aliases: ["javascript", "typescript", "es6", "node.js", "nodejs"],
    alwaysForRoles: ["frontend", "fullstack"],
    subtopics: [
      "Closures, this, prototypes, event loop",
      "Promises / async-await / error handling",
      "TypeScript types, generics, and narrowing",
      "Modules, bundling, and runtime differences (browser vs Node)",
    ],
  },
  {
    id: "react",
    title: "React & frontend architecture",
    reason: "Expect component design, hooks, and state questions.",
    aliases: ["react", "next.js", "redux", "frontend"],
    alwaysForRoles: ["frontend"],
    subtopics: [
      "Hooks, rendering, and re-render control",
      "State management (local vs global)",
      "Routing, data fetching, and caching",
      "Accessibility and forms",
      "Testing components (React Testing Library)",
    ],
  },
  {
    id: "css-ui",
    title: "HTML, CSS & UI fundamentals",
    reason: "UI roles still probe layout, responsive design, and browser basics.",
    aliases: ["html", "css", "tailwind", "ui", "ux", "responsive"],
    alwaysForRoles: ["frontend"],
    subtopics: [
      "Flexbox, Grid, and responsive layouts",
      "Specificity, cascade, and modern CSS",
      "Semantic HTML and accessibility (a11y)",
      "Performance: paint, layout, assets",
    ],
  },
  {
    id: "backend-apis",
    title: "Backend APIs & services",
    reason: "You will be asked to design and debug HTTP APIs and service boundaries.",
    aliases: [
      "rest",
      "graphql",
      "api",
      "microservices",
      "grpc",
      "backend",
      "node.js",
      "spring boot",
      "django",
      "fastapi",
    ],
    alwaysForRoles: ["backend", "fullstack"],
    subtopics: [
      "REST vs GraphQL vs RPC",
      "AuthN/AuthZ (sessions, JWT, OAuth)",
      "Idempotency, pagination, versioning",
      "Error handling and retries",
      "Service design and domain boundaries",
    ],
  },
  {
    id: "databases",
    title: "Databases & SQL",
    reason: "Almost every backend/data interview includes modeling and query questions.",
    aliases: [
      "sql",
      "postgres",
      "postgresql",
      "mysql",
      "mongodb",
      "redis",
      "dynamodb",
      "nosql",
      "database",
    ],
    alwaysForRoles: ["backend", "fullstack", "data"],
    subtopics: [
      "Schema design and normalization",
      "Indexes, query plans, and N+1",
      "Transactions and isolation",
      "Caching with Redis",
      "When to use SQL vs document/key-value stores",
    ],
  },
  {
    id: "cloud-devops",
    title: "Cloud, containers & CI/CD",
    reason: "Production roles expect you to ship and operate software, not only write it.",
    aliases: [
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "ci/cd",
      "terraform",
      "devops",
      "sre",
    ],
    alwaysForRoles: ["devops"],
    subtopics: [
      "Containers vs VMs; Docker images",
      "Kubernetes: pods, services, deployments",
      "CI/CD pipelines and environments",
      "IAM, networking, and secrets",
      "Infrastructure as code (Terraform)",
    ],
  },
  {
    id: "testing",
    title: "Testing & quality",
    reason: "Interviewers look for how you prevent regressions, not just happy-path code.",
    aliases: [
      "unit testing",
      "integration testing",
      "tdd",
      "qa",
      "test automation",
      "sdet",
    ],
    alwaysForRoles: ["qa"],
    subtopics: [
      "Unit vs integration vs e2e",
      "Test doubles, fixtures, and flaky tests",
      "Coverage that matters vs vanity coverage",
      "CI gates and quality metrics",
    ],
  },
  {
    id: "security",
    title: "Application security",
    reason: "Web and API roles increasingly include security basics in interviews.",
    aliases: ["security", "oauth", "owasp", "auth", "encryption", "gdpr", "hipaa"],
    alwaysForRoles: ["security"],
    subtopics: [
      "OWASP Top 10 (XSS, CSRF, injection)",
      "Auth, sessions, and token storage",
      "Secrets management",
      "Threat modeling at a high level",
    ],
  },
  {
    id: "mobile-core",
    title: "Mobile app fundamentals",
    reason: "Mobile interviews mix platform APIs, architecture, and shipping quality.",
    aliases: ["android", "ios", "kotlin", "swift", "react native", "flutter"],
    alwaysForRoles: ["mobile"],
    subtopics: [
      "App lifecycle and navigation",
      "Architecture (MVVM / Clean / Compose or SwiftUI)",
      "Networking, persistence, and offline",
      "Threading / coroutines / GCD",
      "Release, store guidelines, and crash reporting",
    ],
  },
  {
    id: "mobile-perf",
    title: "Mobile performance, memory & battery",
    reason:
      "Product mentions like battery or jank map to performance interviews, not a standalone trivia topic.",
    aliases: [
      "battery",
      "battery life",
      "wake lock",
      "jank",
      "anr",
      "memory leak",
      "frame rate",
    ],
    alwaysForRoles: ["mobile"],
    aliasRoles: ["mobile"],
    subtopics: [
      "Profiling CPU, GPU, and memory",
      "ANRs, frozen frames, and main-thread work",
      "Battery: wake locks, background jobs, Doze / background limits",
      "Startup time, binary size, and rendering",
      "Network and image loading costs",
    ],
  },
  {
    id: "python",
    title: "Python",
    reason: "Language depth plus standard library usage for backend, data, and ML roles.",
    aliases: ["python", "django", "flask", "fastapi"],
    subtopics: [
      "Data types, comprehensions, iterators",
      "OOP, typing, and packaging",
      "asyncio / concurrency",
      "Testing with pytest",
    ],
  },
  {
    id: "java",
    title: "Java / JVM",
    reason: "Enterprise backend interviews go deep on language and concurrency.",
    aliases: ["java", "spring", "spring boot", "jvm", "kotlin"],
    subtopics: [
      "Collections, generics, and memory model",
      "Concurrency and thread safety",
      "Spring: DI, MVC, data, security",
      "Exceptions, streams, and JVM basics",
    ],
  },
  {
    id: "ml",
    title: "Machine learning fundamentals",
    reason: "ML interviews mix theory, metrics, and applied modeling.",
    aliases: [
      "machine learning",
      "deep learning",
      "tensorflow",
      "pytorch",
      "nlp",
      "computer vision",
      "llm",
    ],
    alwaysForRoles: ["ml"],
    subtopics: [
      "Supervised vs unsupervised; bias/variance",
      "Feature engineering and data leakage",
      "Metrics (precision/recall, ROC, calibration)",
      "Overfitting, regularization, and validation",
      "MLOps: training, serving, monitoring",
    ],
  },
  {
    id: "data-eng",
    title: "Data engineering",
    reason: "Pipeline, warehouse, and reliability questions dominate data roles.",
    aliases: ["spark", "airflow", "snowflake", "dbt", "etl", "kafka", "hadoop"],
    alwaysForRoles: ["data"],
    subtopics: [
      "Batch vs streaming pipelines",
      "Warehouse modeling (star/snowflake)",
      "Orchestration (Airflow) and SLAs",
      "Data quality and lineage",
    ],
  },
  {
    id: "networking-os",
    title: "OS, networking & concurrency",
    reason: "Low-level and backend interviews often probe how programs actually run.",
    aliases: [
      "linux",
      "networking",
      "tcp",
      "http",
      "concurrency",
      "multithreading",
      "operating system",
    ],
    alwaysForRoles: ["backend", "devops", "mobile"],
    subtopics: [
      "Processes vs threads; locks and deadlocks",
      "HTTP/TCP basics and TLS",
      "Memory, I/O, and file descriptors",
      "Debugging with logs and profilers",
    ],
  },
  {
    id: "scripting-automation",
    title: "Scripting & automation",
    reason:
      "Only include this when the job actually needs automation (shell/Python), not because the word “scripting” appeared in passing.",
    aliases: ["bash", "shell scripting", "powershell", "automation scripts"],
    subtopics: [
      "Bash/PowerShell for glue work",
      "Idempotent scripts and error handling",
      "Parsing logs/files and calling APIs",
      "Scheduling (cron) and CI hooks",
    ],
  },
];

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n.toLowerCase()));
}

export function detectJobRole(jobText: string): JobRole {
  const t = jobText.toLowerCase();
  const scores: Array<[JobRole, number]> = [];
  for (const [role, hints] of Object.entries(ROLE_HINTS) as Array<
    [Exclude<JobRole, "general">, string[]]
  >) {
    const hits = hints.filter((h) => t.includes(h)).length;
    if (hits > 0) scores.push([role, hits]);
  }
  scores.sort((a, b) => b[1] - a[1]);
  if (scores.length === 0) return "general";
  if (
    scores.some(([r]) => r === "frontend") &&
    scores.some(([r]) => r === "backend")
  ) {
    return "fullstack";
  }
  return scores[0][0];
}

function aliasHit(jobLower: string, aliases: string[]): boolean {
  return aliases.some((a) => jobLower.includes(a.toLowerCase()));
}

/**
 * Build a study curriculum: parent topics + subtopics required to interview for this JD.
 * Maps noisy product words (e.g. battery life) into real interview topics.
 */
export function buildPrepCurriculum(
  jobText: string,
  resumeText: string
): PrepTopic[] {
  const jobLower = jobText.toLowerCase();
  const resumeLower = resumeText.toLowerCase();
  const role = detectJobRole(jobText);

  const selected: PrepTopic[] = [];

  for (const node of CATALOG) {
    const aliasAllowed =
      !node.aliasRoles || node.aliasRoles.includes(role);
    const mentioned = aliasAllowed && aliasHit(jobLower, node.aliases);
    const roleCore = node.alwaysForRoles?.includes(role) ?? false;
    if (!mentioned && !roleCore) continue;

    const coveredOnResume = node.aliases.filter((a) =>
      resumeLower.includes(a.toLowerCase())
    ).length;

    let priority: PrepPriority = "medium";
    if (mentioned && coveredOnResume === 0) priority = "high";
    else if (mentioned) priority = "medium";
    else priority = "low";

    const reasonParts = [node.reason];
    if (mentioned) {
      reasonParts.push("This showed up (or maps from wording) in the job description.");
    } else {
      reasonParts.push(
        `Included because it is a standard interview track for a ${role} role.`
      );
    }

    selected.push({
      topic: node.title,
      reason: reasonParts.join(" "),
      priority,
      subtopics: node.subtopics,
    });
  }

  selected.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return selected.slice(0, 12);
}
