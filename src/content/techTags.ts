import codeGraphIcon from '../assets/tech/codegraph.webp';
import comfyUiIcon from '../assets/tech/comfyui.webp';
import context7Icon from '../assets/tech/context7.svg';
import googleStitchIcon from '../assets/tech/google-stitch.webp';
import impeccableIcon from '../assets/tech/impeccable.webp';
import reactFlowIcon from '../assets/tech/react-flow.ico';
import rtkIcon from '../assets/tech/rtk.webp';
import baseUiIcon from '../assets/tech/base-ui.png';
import radixUiIcon from '../assets/tech/radix-ui.png';
import shadcnUiIcon from '../assets/tech/shadcn-ui.png';
import tanstackQueryIcon from '../assets/tech/tanstack-query.png';

export type TechTagIcon =
  | { readonly kind: 'iconify'; readonly name: string; readonly color?: string }
  | { readonly kind: 'image'; readonly src: string };

export type TechTagDefinition = {
  readonly icon: TechTagIcon;
};

function icon(name: string, color?: string): TechTagIcon {
  return color === undefined ? { kind: 'iconify', name } : { kind: 'iconify', name, color };
}

function image(src: string): TechTagIcon {
  return { kind: 'image', src };
}

// Used explicitly for technologies whose final brand asset will be added later.
const temporaryIcon = icon('lucide:code-2');

/**
 * Every label used by the practical technology list has one entry here.
 * Iconify handles standard icon sets; local images are reserved for custom
 * assets and the few icons that already exist in the portfolio materials.
 */
export const TECH_TAG_REGISTRY = {
  // Frontend
  React: { icon: icon('skill-icons:react-dark') },
  TypeScript: { icon: icon('skill-icons:typescript') },
  'TanStack Query': { icon: image(tanstackQueryIcon) },
  XState: { icon: icon('simple-icons:xstate') },
  Zustand: { icon: icon('devicon:zustand') },
  'React Flow': { icon: image(reactFlowIcon) },
  PixiJS: { icon: icon('devicon:pixijs') },
  IndexedDB: { icon: temporaryIcon },

  // UI Systems
  'Tailwind CSS': { icon: icon('skill-icons:tailwindcss-dark') },
  'shadcn/ui': { icon: image(shadcnUiIcon) },
  'Radix UI': { icon: image(radixUiIcon) },
  'Base UI': { icon: image(baseUiIcon) },

  // Backend & APIs
  Python: { icon: icon('skill-icons:python-dark') },
  FastAPI: { icon: icon('devicon:fastapi') },
  Pydantic: { icon: icon('simple-icons:pydantic') },
  SQLAlchemy: { icon: icon('simple-icons:sqlalchemy') },
  Celery: { icon: icon('simple-icons:celery') },
  OpenAPI: { icon: icon('devicon:openapi') },

  // Data & Search
  PostgreSQL: { icon: icon('skill-icons:postgresql-dark') },
  Redis: { icon: icon('skill-icons:redis-dark') },
  pgvector: { icon: temporaryIcon },
  Qdrant: { icon: icon('simple-icons:qdrant', '#DC244C') },

  // AI & Coding Agents
  Cursor: { icon: icon('simple-icons:cursor') },
  Codex: { icon: icon('simple-icons:openai') },
  Claude: { icon: icon('simple-icons:anthropic') },
  'OpenAI API': { icon: icon('simple-icons:openai') },
  'Gemini API': { icon: icon('simple-icons:googlegemini') },
  OpenRouter: { icon: icon('simple-icons:openrouter') },
  'LM Studio': { icon: icon('simple-icons:lmstudio') },
  ComfyUI: { icon: image(comfyUiIcon) },

  // MCP
  Context7: { icon: image(context7Icon) },
  'CodeGraph (local)': { icon: image(codeGraphIcon) },

  // Agentic Tooling
  CodeGraph: { icon: image(codeGraphIcon) },
  RTK: { icon: image(rtkIcon) },
  'Google Stitch': { icon: image(googleStitchIcon) },
  Mermaid: { icon: icon('simple-icons:mermaid', '#ff3670') },
  Impeccable: { icon: image(impeccableIcon) },

  // Quality & Delivery
  'CI/CD': { icon: icon('lucide:workflow') },
  Git: { icon: icon('skill-icons:git') },
  GitHub: { icon: icon('simple-icons:github') },
  Docker: { icon: icon('skill-icons:docker') },
  Vitest: { icon: icon('simple-icons:vitest', '#6E9F18') },
  pytest: { icon: icon('devicon:pytest') },
  Playwright: { icon: icon('simple-icons:playwright') },
  ESLint: { icon: icon('devicon:eslint') },
  Knip: { icon: icon('simple-icons:knip', '#F56E0F') },
} satisfies Readonly<Record<string, TechTagDefinition>>;

export type TechTagName = keyof typeof TECH_TAG_REGISTRY;

export function getTechTagDefinition(name: string): TechTagDefinition | undefined {
  if (!Object.hasOwn(TECH_TAG_REGISTRY, name)) {
    return undefined;
  }

  return TECH_TAG_REGISTRY[name as TechTagName];
}

export function getTechTagIcon(name: string): TechTagIcon {
  return getTechTagDefinition(name)?.icon ?? temporaryIcon;
}
