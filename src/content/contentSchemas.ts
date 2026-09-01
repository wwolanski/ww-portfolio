export type ContentSchema =
  | {
      readonly type: 'string';
      readonly values?: readonly string[];
      readonly format?: 'url';
      readonly placeholders?: readonly string[];
    }
  | { readonly type: 'array'; readonly items: ContentSchema; readonly sequentialIndexes?: boolean; readonly uniqueBy?: readonly string[] }
  | {
      readonly type: 'object';
      readonly properties: Readonly<Record<string, ContentSchema>>;
      readonly optional?: readonly string[];
      readonly equalLength?: readonly (readonly [string, string])[];
    };

const string = { type: 'string' } as const satisfies ContentSchema;
const stringArray = { type: 'array', items: string } as const satisfies ContentSchema;

function object(
  properties: Readonly<Record<string, ContentSchema>>,
  options: Pick<Extract<ContentSchema, { type: 'object' }>, 'optional' | 'equalLength'> = {},
): ContentSchema {
  return { type: 'object', properties, ...options };
}

function template(...placeholders: readonly string[]): ContentSchema {
  return { type: 'string', placeholders };
}

function array(
  items: ContentSchema,
  options: Pick<Extract<ContentSchema, { type: 'array' }>, 'sequentialIndexes' | 'uniqueBy'> = {},
): ContentSchema {
  return { type: 'array', items, ...options };
}

const heroSchema = object({
  eyebrow: string,
  title: stringArray,
  lead: string,
});

const visualPanelSchema = object({
  kicker: string,
  title: string,
});

const visualPanelCardSchema = object({
  heading: string,
  status: string,
  metric: string,
});

const blogVisualPanelSchema = object({
  kicker: string,
  title: string,
  cards: array(visualPanelCardSchema),
});

function ctaSchema(target: 'projects' | 'skills'): ContentSchema {
  return object({
    eyebrow: string,
    title: string,
    label: string,
    target: { type: 'string', values: [target] },
  });
}

const indexedTextSchema = object({
  index: string,
  title: string,
  text: string,
});

export const homeContentSchema = object({
  kicker: string,
  portfolioSections: string,
  cards: object({
    about: object({ label: string, description: string }),
    projects: object({ label: string, description: string }),
    skills: object({ label: string, description: string }),
    blog: object({ label: string, description: string }),
  }),
  basedIn: string,
  workingWorldwide: string,
});

export const aboutContentSchema = object({
  hero: heroSchema,
  visualPanel: visualPanelSchema,
  workflow: object({
    heading: string,
    intro: string,
    steps: array(indexedTextSchema, { sequentialIndexes: true }),
    example: object({
      label: string,
      title: string,
      text: string,
      steps: array(indexedTextSchema, { sequentialIndexes: true }),
    }),
  }),
  timeline: object({
    heading: string,
    intro: string,
    items: array(object({ date: string, title: string, text: string })),
  }),
  statement: object({ kicker: string, title: string, text: string }),
  cta: ctaSchema('projects'),
});

const projectSchema = object({
  slug: string,
  caseStudySlug: string,
  externalLink: object({
    provider: { type: 'string', values: ['github', 'vercel'] },
    href: { type: 'string', format: 'url' },
  }),
  index: string,
  category: string,
  tags: array({
    type: 'string',
    values: ['shipped', 'in-development', 'discontinued', 'prototype-paused', 'public-beta'],
  }),
  title: string,
  description: string,
  facts: stringArray,
  outcome: string,
  anchor: string,
  details: array(object({ label: string, text: string })),
}, { optional: ['caseStudySlug', 'externalLink'] });

export const projectsContentSchema = object({
  hero: heroSchema,
  visualPanel: visualPanelSchema,
  selected: object({
    projects: array(projectSchema, {
      sequentialIndexes: true,
      uniqueBy: ['slug', 'anchor'],
    }),
  }),
  cta: ctaSchema('skills'),
});

const titledTextSchema = object({ title: string, text: string });

export const skillsContentSchema = object({
  visualPanel: visualPanelSchema,
  boundary: object({
    eyebrow: string,
    title: stringArray,
    lead: string,
    decision: object({
      currentTitle: string,
      currentText: string,
      question: string,
      yes: string,
      no: string,
      stay: object({ title: string, text: string, meta: string }),
      rise: object({ title: string, text: string, meta: string }),
      center: string,
    }),
    layersHeading: string,
    layers: array(titledTextSchema),
    principles: array(titledTextSchema),
    practiceHeading: string,
    examples: array(object({ title: string, label: string })),
    musicNote: string,
  }, { equalLength: [['layers', 'principles']] }),
  stack: object({
    heading: string,
    intro: string,
    bands: array(object({ title: string, tools: stringArray })),
  }),
  cta: ctaSchema('projects'),
});

export const blogContentSchema = object({
  eyebrow: string,
  title: stringArray,
  intro: string,
  visualPanel: blogVisualPanelSchema,
});

export const uiContentSchema = object({
  language: object({ label: string, polish: string, english: string, switchTo: template('language') }),
  theme: object({ switchToLight: string, switchToDark: string }),
  common: object({
    skipToContent: string,
    primaryNavigation: string,
    openNavigation: string,
    closeNavigation: string,
    navigationDescription: string,
    home: string,
    backHome: string,
    artwork: template('label'),
    projectDetails: template('title'),
  }),
  projectContent: object({
    caseStudy: string,
    openCaseStudy: template('title'),
    openExternal: template('provider', 'title'),
    openGallery: template('title'),
    close: string,
    loading: string,
    preparation: string,
    error: string,
    onlyPolish: string,
    viewPolish: string,
  }),
  content: object({
    tableOfContents: string,
    openTableOfContents: string,
    closeTableOfContents: string,
    expandProcess: string,
    collapseProcess: string,
    imageGallery: object({
      label: string,
      previous: string,
      next: string,
      image: template('index'),
      empty: string,
      expand: string,
      close: string,
    }),
  }),
  actions: object({ openPage: template('label'), open: string }),
  blog: object({
    filterArticles: string,
    all: string,
    readArticle: template('title'),
    articleTags: string,
    backToBlog: string,
    loadingIndex: string,
    errorIndex: string,
    loadingArticle: string,
    missingArticle: string,
    errorArticle: string,
    readTime: template('time'),
  }),
});

export const localeContentSchemas = {
  about: aboutContentSchema,
  blog: blogContentSchema,
  home: homeContentSchema,
  projects: projectsContentSchema,
  skills: skillsContentSchema,
  ui: uiContentSchema,
} as const;
