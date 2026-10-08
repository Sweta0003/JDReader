/** Curated terms for gap detection; matched case-insensitively in JD vs resume. */
export const SKILL_DICTIONARY: string[] = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C#",
  ".NET",
  "Go",
  "Rust",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Git",
  "REST",
  "GraphQL",
  "microservices",
  "system design",
  "distributed systems",
  "machine learning",
  "data structures",
  "algorithms",
  "Agile",
  "Scrum",
  "leadership",
  "communication",
  "problem solving",
  "TensorFlow",
  "PyTorch",
  "LLM",
  "OpenAI",
  "Tailwind",
  "HTML",
  "CSS",
  "Vue",
  "Angular",
  "Spring Boot",
  "FastAPI",
  "Django",
  "Flask",
  "Terraform",
  "Kafka",
  "Elasticsearch",
  "Spark",
  "Snowflake",
  "dbt",
  "Figma",
  "unit testing",
  "integration testing",
  "TDD",
  "security",
  "OAuth",
  "performance optimization",
  "C++",
  "C",
  "Swift",
  "Kotlin",
  "Ruby",
  "PHP",
  "Laravel",
  "Rails",
  "Scala",
  "Hadoop",
  "Airflow",
  "Looker",
  "Tableau",
  "Power BI",
  "Jenkins",
  "GitHub Actions",
  "GitLab",
  "Jira",
  "Confluence",
  "SAP",
  "Salesforce",
  "DevOps",
  "SRE",
  "iOS",
  "Android",
  "React Native",
  "Flutter",
  "Solidity",
  "blockchain",
  "RAG",
  "vector database",
  "Pinecone",
  "LangChain",
  "prompt engineering",
  "MLOps",
  "computer vision",
  "NLP",
  "deep learning",
  "statistics",
  "A/B testing",
  "product management",
  "stakeholder management",
  "cross-functional",
  "mentoring",
  "technical leadership",
  "architecture",
  "API design",
  "event-driven",
  "serverless",
  "Lambda",
  "EC2",
  "S3",
  "IAM",
  "networking",
  "Linux",
  "Bash",
  "Shell",
  "NoSQL",
  "MySQL",
  "Oracle",
  "SQLite",
  "DynamoDB",
  "Cassandra",
  "gRPC",
  "WebSocket",
  "SaaS",
  "B2B",
  "fintech",
  "healthcare",
  "HIPAA",
  "SOC 2",
  "GDPR",
];

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function extractTermsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const term of SKILL_DICTIONARY) {
    const pattern = new RegExp(`\\b${escapeRegExp(term.toLowerCase())}\\b`, "i");
    if (pattern.test(lower)) {
      found.add(term);
    }
  }

  const extraPatterns = [
    /\b(\d+\+?\s*years?\s*(?:of\s*)?experience)\b/gi,
    /\b(bachelor'?s?|master'?s?|ph\.?d\.?)\b/gi,
  ];
  for (const re of extraPatterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      found.add(m[0].trim());
    }
  }

  return [...found];
}

export function termsMissingFromResume(
  jobTerms: string[],
  resumeText: string
): string[] {
  const resumeLower = resumeText.toLowerCase();
  return jobTerms.filter((term) => {
    const pattern = new RegExp(`\\b${escapeRegExp(term.toLowerCase())}\\b`, "i");
    return !pattern.test(resumeLower);
  });
}
