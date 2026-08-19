import baseUiIcon from '../assets/tech/base-ui.png';
import radixUiIcon from '../assets/tech/radix-ui.png';
import shadcnUiIcon from '../assets/tech/shadcn-ui.png';
import tanstackQueryIcon from '../assets/tech/tanstack-query.png';
import zodIcon from '../assets/tech/zod.svg';

export type TechTagIcon =
  | { readonly kind: 'iconify'; readonly name: string }
  | { readonly kind: 'image'; readonly src: string };

export type TechTagDefinition = {
  readonly icon: TechTagIcon;
};

function icon(name: string): TechTagIcon {
  return { kind: 'iconify', name };
}

function image(src: string): TechTagIcon {
  return { kind: 'image', src };
}

/**
 * The display labels in skills.json are the registry keys on purpose. This
 * keeps the content JSON unchanged while making every stack item icon-aware.
 */
export const TECH_TAG_REGISTRY: Readonly<Record<string, TechTagDefinition>> = {
  React: { icon: icon('skill-icons:react-dark') },
  TypeScript: { icon: icon('skill-icons:typescript') },
  JavaScript: { icon: icon('skill-icons:javascript') },
  Vite: { icon: icon('skill-icons:vite-dark') },
  'TanStack Query': { icon: image(tanstackQueryIcon) },
  Zustand: { icon: icon('devicon:zustand') },
  Zod: { icon: image(zodIcon) },
  'Radix UI': { icon: image(radixUiIcon) },
  'Base UI': { icon: image(baseUiIcon) },
  'shadcn/ui': { icon: image(shadcnUiIcon) },
  'React Flow': { icon: icon('lucide:git-branch') },
  Python: { icon: icon('skill-icons:python-dark') },
  FastAPI: { icon: icon('devicon:fastapi') },
  Uvicorn: { icon: icon('lucide:server') },
  SQLAlchemy: { icon: icon('lucide:database') },
  PostgreSQL: { icon: icon('skill-icons:postgresql-dark') },
  Redis: { icon: icon('skill-icons:redis-dark') },
  Celery: { icon: icon('simple-icons:celery') },
  Alembic: { icon: icon('lucide:git-branch') },
  'Supabase': { icon: icon('devicon:supabase') },
  Cursor: { icon: icon('simple-icons:cursor') },
  'GitHub Copilot': { icon: icon('simple-icons:githubcopilot') },
  Codex: { icon: icon('simple-icons:openai') },
  Claude: { icon: icon('simple-icons:anthropic') },
  Kilocode: { icon: icon('lucide:code-2') },
  OpenRouter: { icon: icon('lucide:route') },
  MCP: { icon: icon('lucide:plug') },
  Context7: { icon: icon('lucide:book-open') },
  'code graphs': { icon: icon('lucide:network') },
  Vitest: { icon: icon('simple-icons:vitest') },
  pytest: { icon: icon('devicon:pytest') },
  Playwright: { icon: icon('simple-icons:playwright') },
  Git: { icon: icon('skill-icons:git') },
  GitHub: { icon: icon('simple-icons:github') },
  'CI/CD': { icon: icon('lucide:workflow') },
  'Docker — lokalnie': { icon: icon('skill-icons:docker') },
  Ruff: { icon: icon('lucide:check-check') },
};

export function getTechTagDefinition(name: string): TechTagDefinition | undefined {
  return TECH_TAG_REGISTRY[name];
}
