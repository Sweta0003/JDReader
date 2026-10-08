import type { JobRole } from "@/lib/analysis/prepCurriculum";
import type { CourseSuggestion, ProjectSuggestion } from "@/lib/types/analysis";

type CatalogItem = {
  when: (jobLower: string, role: JobRole) => boolean;
  courses: CourseSuggestion[];
  projects: ProjectSuggestion[];
};

const ROLE_DEFAULTS: Record<JobRole, { courses: CourseSuggestion[]; projects: ProjectSuggestion[] }> =
  {
    frontend: {
      courses: [
        {
          title: "The Odin Project — Full Stack JavaScript (frontend path)",
          provider: "The Odin Project",
          focus: "HTML, CSS, JS, React, Git, and shipping real pages",
          url: "https://www.theodinproject.com/paths/full-stack-javascript",
        },
        {
          title: "Meta Front-End Developer",
          provider: "Coursera",
          focus: "React, UI, and interview-style frontend projects",
          url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        },
      ],
      projects: [
        {
          title: "Production-style dashboard",
          why: "Shows component architecture, data fetching, and accessible UI — what frontend interviews look for.",
          deliverables: [
            "Auth + protected routes",
            "Tables/filters with loading and empty states",
            "Dark mode and responsive layout",
            "Unit tests for key components",
            "Live demo + GitHub README with screenshots",
          ],
        },
        {
          title: "Design-system clone (buttons, forms, modal)",
          why: "Proves CSS depth and reusable API design, not only tutorial apps.",
          deliverables: [
            "Storybook or documented component gallery",
            "Keyboard and screen-reader support",
            "Theming tokens",
          ],
        },
      ],
    },
    backend: {
      courses: [
        {
          title: "CS50's Introduction to Computer Science",
          provider: "Harvard / edX",
          focus: "Algorithms, C, Python, SQL, and web basics",
          url: "https://cs50.harvard.edu/x/",
        },
        {
          title: "IBM Back-End Development",
          provider: "Coursera",
          focus: "APIs, databases, containers, and backend workflows",
          url: "https://www.coursera.org/professional-certificates/ibm-backend-development",
        },
      ],
      projects: [
        {
          title: "REST API with auth, Postgres, and tests",
          why: "Backend interviews expect you to design endpoints, data models, and failure cases.",
          deliverables: [
            "CRUD + pagination + validation",
            "JWT or session auth",
            "Migrations and seed data",
            "Integration tests and OpenAPI/Swagger",
            "Docker Compose for local run",
          ],
        },
        {
          title: "Event-driven worker (queue + retries)",
          why: "Matches job posts that mention scale, async work, or reliability.",
          deliverables: [
            "Producer/consumer with a queue",
            "Idempotent handlers and dead-letter path",
            "Metrics/logs for a failed job",
          ],
        },
      ],
    },
    fullstack: {
      courses: [
        {
          title: "The Odin Project — Full Stack JavaScript",
          provider: "The Odin Project",
          focus: "Frontend + Node backend, databases, and deployment",
          url: "https://www.theodinproject.com/paths/full-stack-javascript",
        },
        {
          title: "Full-Stack Open",
          provider: "University of Helsinki",
          focus: "React, Node, testing, and CI",
          url: "https://fullstackopen.com/en/",
        },
      ],
      projects: [
        {
          title: "End-to-end product (web app + API + DB)",
          why: "Full-stack roles want one repo that proves you can ship a feature across layers.",
          deliverables: [
            "User accounts and a core workflow",
            "API + UI for the same domain",
            "Tests on both sides",
            "Deployed demo (Vercel/Render/Fly)",
          ],
        },
      ],
    },
    mobile: {
      courses: [
        {
          title: "Android Basics with Compose",
          provider: "Google / Android Developers",
          focus: "Kotlin, Compose, architecture, and app quality",
          url: "https://developer.android.com/courses/android-basics-compose/course",
        },
        {
          title: "iOS App Dev with SwiftUI",
          provider: "Apple Developer",
          focus: "SwiftUI, app lifecycle, and Apple platform APIs",
          url: "https://developer.apple.com/tutorials/app-dev-training",
        },
      ],
      projects: [
        {
          title: "Offline-first mobile app with profiling notes",
          why: "Mobile interviews care about lifecycle, networking, and performance (jank, battery, ANRs).",
          deliverables: [
            "Local cache / Room or Core Data",
            "Background work that respects battery limits",
            "Crash-free happy path + empty/error states",
            "README with profiler screenshots (CPU/memory/battery)",
            "Play Store / TestFlight or APK/IPA build instructions",
          ],
        },
        {
          title: "Feature clone with architecture (MVVM / Clean)",
          why: "Shows you can structure code the way product teams review PRs.",
          deliverables: [
            "Clear layers (UI, domain, data)",
            "Unit tests for ViewModels/use cases",
            "CI for lint + tests",
          ],
        },
      ],
    },
    data: {
      courses: [
        {
          title: "Google Data Analytics",
          provider: "Coursera",
          focus: "SQL, spreadsheets, and analysis storytelling",
          url: "https://www.coursera.org/professional-certificates/google-data-analytics",
        },
        {
          title: "Data Engineering Zoomcamp",
          provider: "DataTalks.Club",
          focus: "Pipelines, warehouses, Spark/dbt-style workflows",
          url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
        },
      ],
      projects: [
        {
          title: "Batch pipeline: source → warehouse → dashboard",
          why: "Data roles hire on pipelines you can explain, not only notebooks.",
          deliverables: [
            "Ingest from a public API or files",
            "Transform with tests (dbt or equivalent)",
            "Scheduled run (Airflow/cron)",
            "Dashboard with 3–5 business metrics",
          ],
        },
      ],
    },
    ml: {
      courses: [
        {
          title: "Machine Learning Specialization",
          provider: "DeepLearning.AI / Coursera",
          focus: "Supervised learning, networks, and practical ML",
          url: "https://www.coursera.org/specializations/machine-learning-introduction",
        },
        {
          title: "Practical Deep Learning for Coders",
          provider: "fast.ai",
          focus: "Applied DL you can ship in a notebook then a small app",
          url: "https://course.fast.ai/",
        },
      ],
      projects: [
        {
          title: "End-to-end ML demo (data → model → API)",
          why: "ML interviews want leakage-aware training plus a way to serve predictions.",
          deliverables: [
            "Clear train/val/test split and metrics",
            "Baseline vs improved model",
            "Simple inference API or Streamlit/Gradio UI",
            "Write-up of failure cases and next steps",
          ],
        },
      ],
    },
    devops: {
      courses: [
        {
          title: "Google Cloud DevOps / SRE fundamentals",
          provider: "Google Cloud Skills Boost",
          focus: "CI/CD, monitoring, and reliability practices",
          url: "https://www.cloudskillsboost.google/",
        },
        {
          title: "Kubernetes Basics",
          provider: "Kubernetes / CNCF",
          focus: "Pods, deployments, services, and cluster mental model",
          url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        },
      ],
      projects: [
        {
          title: "App + pipeline + infra-as-code",
          why: "DevOps/SRE portfolios should show you can ship and operate, not only write YAML.",
          deliverables: [
            "Dockerfile and Kubernetes manifests or Terraform",
            "CI (lint, test, build, deploy)",
            "Health checks, logs, and a simple dashboard",
            "Runbook for a failed deploy",
          ],
        },
      ],
    },
    qa: {
      courses: [
        {
          title: "Test Automation University",
          provider: "Applitools",
          focus: "UI, API, and framework design for SDETs",
          url: "https://testautomationu.applitools.com/",
        },
      ],
      projects: [
        {
          title: "Layered test suite for a public app",
          why: "QA/SDET interviews look for strategy, not a pile of recorded clicks.",
          deliverables: [
            "API tests + a few critical UI e2e tests",
            "Page objects or screenplay pattern",
            "CI report with flaky-test notes",
          ],
        },
      ],
    },
    security: {
      courses: [
        {
          title: "Google Cybersecurity Certificate",
          provider: "Coursera",
          focus: "Foundations, SIEM basics, and security ops",
          url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
        },
        {
          title: "OWASP Web Security Testing Guide (read + lab)",
          provider: "OWASP",
          focus: "Practical web app testing checklist",
          url: "https://owasp.org/www-project-web-security-testing-guide/",
        },
      ],
      projects: [
        {
          title: "Secure a small web app and document findings",
          why: "Security roles want evidence you can find, fix, and explain issues.",
          deliverables: [
            "Threat model (1 page)",
            "Fixes for XSS/CSRF/injection on a demo app",
            "Before/after notes and remaining risk",
          ],
        },
      ],
    },
    general: {
      courses: [
        {
          title: "CS50's Introduction to Computer Science",
          provider: "Harvard / edX",
          focus: "Coding fundamentals and problem solving",
          url: "https://cs50.harvard.edu/x/",
        },
        {
          title: "Grokking the Coding Interview (patterns)",
          provider: "Educative",
          focus: "DSA patterns used in software interviews",
          url: "https://www.educative.io/courses/grokking-the-coding-interview",
        },
      ],
      projects: [
        {
          title: "Flagship project that matches the JD stack",
          why: "When the role is mixed, one polished project beats five tutorials.",
          deliverables: [
            "Problem statement and users",
            "Architecture diagram",
            "Tests and a live or recorded demo",
            "README that maps features to the job description",
          ],
        },
      ],
    },
  };

const STACK_EXTRAS: CatalogItem[] = [
  {
    when: (j) => j.includes("react") || j.includes("next.js"),
    courses: [
      {
        title: "Next.js Learn",
        provider: "Vercel",
        focus: "App Router, data fetching, and deployment",
        url: "https://nextjs.org/learn",
      },
    ],
    projects: [
      {
        title: "Next.js product site with SSR/SSG pages",
        why: "Common ask on React/Next job posts.",
        deliverables: [
          "At least one server-rendered list page",
          "Form that posts to an API route",
          "Deployed on Vercel with env vars documented",
        ],
      },
    ],
  },
  {
    when: (j) => j.includes("aws") || j.includes("amazon web services"),
    courses: [
      {
        title: "AWS Skill Builder — Cloud Practitioner / Developer extras",
        provider: "AWS",
        focus: "Core AWS services used in job descriptions",
        url: "https://skillbuilder.aws/",
      },
    ],
    projects: [
      {
        title: "Deploy the API on AWS (or LocalStack)",
        why: "Turns “familiar with AWS” from a resume keyword into a demo.",
        deliverables: [
          "S3 or EC2/Lambda + documented IAM",
          "Cost/security notes in the README",
        ],
      },
    ],
  },
  {
    when: (j) => j.includes("kubernetes") || j.includes("docker"),
    courses: [
      {
        title: "Docker Getting Started",
        provider: "Docker",
        focus: "Images, compose, and local-to-prod mental model",
        url: "https://docs.docker.com/get-started/",
      },
    ],
    projects: [],
  },
  {
    when: (j) => j.includes("python"),
    courses: [
      {
        title: "Python for Everybody",
        provider: "University of Michigan / Coursera",
        focus: "Python syntax, data, and APIs",
        url: "https://www.py4e.com/",
      },
    ],
    projects: [],
  },
  {
    when: (j) => j.includes("sql") || j.includes("postgres"),
    courses: [
      {
        title: "Select Star SQL",
        provider: "Select Star SQL",
        focus: "Hands-on SQL for interviews",
        url: "https://selectstarsql.com/",
      },
    ],
    projects: [],
  },
  {
    when: (j, role) =>
      role === "mobile" || j.includes("android") || j.includes("kotlin"),
    courses: [],
    projects: [
      {
        title: "Play Store-quality polish pass",
        why: "Hiring managers open the app; crashes and poor battery behavior stand out.",
        deliverables: [
          "Baseline profile / startup time note",
          "No obvious ANR on a 10-minute session",
          "Accessibility (TalkBack/VoiceOver) on main flows",
        ],
      },
    ],
  },
  {
    when: (j) =>
      j.includes("machine learning") ||
      j.includes("llm") ||
      j.includes("pytorch") ||
      j.includes("tensorflow"),
    courses: [
      {
        title: "Hugging Face NLP course",
        provider: "Hugging Face",
        focus: "Transformers, fine-tuning, and pipelines",
        url: "https://huggingface.co/learn/nlp-course",
      },
    ],
    projects: [
      {
        title: "Small RAG or classifier with an eval set",
        why: "LLM/ML JDs expect you to measure quality, not only call an API.",
        deliverables: [
          "Labeled eval examples",
          "Latency and quality notes",
          "Clear limits of the demo",
        ],
      },
    ],
  },
];

function dedupeCourses(list: CourseSuggestion[]): CourseSuggestion[] {
  const seen = new Set<string>();
  const out: CourseSuggestion[] = [];
  for (const c of list) {
    const key = c.url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out.slice(0, 8);
}

function dedupeProjects(list: ProjectSuggestion[]): ProjectSuggestion[] {
  const seen = new Set<string>();
  const out: ProjectSuggestion[] = [];
  for (const p of list) {
    const key = p.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out.slice(0, 6);
}

export function buildGrowthSuggestions(
  jobText: string,
  role: JobRole
): { courses: CourseSuggestion[]; projects: ProjectSuggestion[] } {
  const jobLower = jobText.toLowerCase();
  const defaults = ROLE_DEFAULTS[role];
  const courses = [...defaults.courses];
  const projects = [...defaults.projects];

  for (const extra of STACK_EXTRAS) {
    if (!extra.when(jobLower, role)) continue;
    courses.push(...extra.courses);
    projects.push(...extra.projects);
  }

  return {
    courses: dedupeCourses(courses),
    projects: dedupeProjects(projects),
  };
}
