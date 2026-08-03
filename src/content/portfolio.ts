export type Project = {
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly technologies: readonly string[];
  readonly metric: string;
  readonly href: string;
};

export const projects = [
  {
    title: 'TaskFlow',
    category: 'Product engineering',
    summary: 'A focused workspace that turns complex delivery plans into calm, measurable progress.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    metric: '42% faster planning',
    href: 'https://github.com/wollanski',
  },
  {
    title: 'Signal RAG',
    category: 'Applied AI',
    summary: 'A retrieval platform for accurate answers across large, fast-changing knowledge bases.',
    technologies: ['Python', 'FastAPI', 'pgvector', 'OpenAI'],
    metric: '91% answer precision',
    href: 'https://github.com/wollanski',
  },
  {
    title: 'Orbit Commerce',
    category: 'Full-stack platform',
    summary: 'A composable commerce engine built for teams that need speed without sacrificing reliability.',
    technologies: ['React', 'NestJS', 'AWS', 'Docker'],
    metric: '1.8s LCP',
    href: 'https://github.com/wollanski',
  },
] satisfies readonly Project[];

export type Article = {
  readonly title: string;
  readonly category: string;
  readonly date: string;
  readonly readTime: string;
  readonly description: string;
};

export const articles = [
  { title: 'Designing systems that can change', category: 'Architecture', date: 'Jul 18, 2026', readTime: '8 min', description: 'Practical boundaries, useful abstractions, and the art of leaving room for tomorrow.' },
  { title: 'A practical guide to Docker', category: 'Tutorial', date: 'Jun 04, 2026', readTime: '11 min', description: 'From local feedback loops to production-ready images, without container mythology.' },
  { title: 'RAG pipelines, explained', category: 'AI', date: 'May 21, 2026', readTime: '9 min', description: 'The decisions that matter when retrieval quality needs to survive real-world data.' },
  { title: 'Clean code is contextual', category: 'Engineering', date: 'Apr 09, 2026', readTime: '6 min', description: 'Why readable systems are built through judgment, not rigid rules.' },
] satisfies readonly Article[];

export const skillGroups = [
  { title: 'Frontend', index: '01', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Accessibility', 'Testing Library'] },
  { title: 'Backend', index: '02', skills: ['Node.js', 'Python', 'PostgreSQL', 'REST & GraphQL', 'Event-driven systems', 'API design'] },
  { title: 'Platform', index: '03', skills: ['Docker', 'AWS', 'Kubernetes', 'CI/CD', 'Observability', 'Infrastructure as code'] },
  { title: 'AI Engineering', index: '04', skills: ['RAG pipelines', 'LLM integrations', 'Vector search', 'Evaluation', 'Prompt systems', 'OpenAI API'] },
] as const;
