import type { ProjectTag } from './projectTags';

export type HeroContent = {
  readonly eyebrow: string;
  readonly title: readonly string[];
  readonly lead: string;
  readonly tags: readonly string[];
  readonly accentTag?: string;
};

export type WorkflowStep = {
  readonly index: string;
  readonly title: string;
  readonly text: string;
};

export type ProcessStep = WorkflowStep;

export type TimelineItem = {
  readonly date: string;
  readonly title: string;
  readonly text: string;
};

export type StatementContent = {
  readonly kicker: string;
  readonly title: string;
  readonly text: string;
};

export type CallToAction = {
  readonly eyebrow: string;
  readonly title: string;
  readonly label: string;
  readonly target: string;
};

export type HomeCard = {
  readonly label: string;
  readonly description: string;
};

export type HomeContent = {
  readonly kicker: string;
  readonly portfolioSections: string;
  readonly cards: {
    readonly about: HomeCard;
    readonly projects: HomeCard;
    readonly skills: HomeCard;
    readonly blog: HomeCard;
  };
  readonly basedIn: string;
  readonly workingWorldwide: string;
};

export type AboutContent = {
  readonly hero: HeroContent;
  readonly workflow: {
    readonly heading: string;
    readonly intro: string;
    readonly steps: readonly WorkflowStep[];
    readonly example: {
      readonly label: string;
      readonly title: string;
      readonly text: string;
      readonly steps: readonly ProcessStep[];
    };
  };
  readonly timeline: {
    readonly heading: string;
    readonly intro: string;
    readonly items: readonly TimelineItem[];
  };
  readonly statement: StatementContent;
  readonly cta: CallToAction;
};

export type ProjectDetail = {
  readonly label: string;
  readonly text: string;
};

export type Project = {
  readonly slug: string;
  readonly caseStudySlug?: string;
  readonly index: string;
  readonly category: string;
  readonly tags: readonly ProjectTag[];
  readonly title: string;
  readonly description: string;
  readonly facts: readonly string[];
  readonly outcome: string;
  readonly anchor: string;
  readonly details: readonly ProjectDetail[];
};

export type ProjectsContent = {
  readonly hero: HeroContent;
  readonly selected: {
    readonly heading: string;
    readonly intro: string;
    readonly projects: readonly Project[];
  };
  readonly statement: StatementContent;
  readonly cta: CallToAction;
};

export type Competency = {
  readonly index: string;
  readonly title: string;
  readonly skills: readonly string[];
};

export type SkillsShowcase = {
  readonly eyebrow: string;
  readonly title: readonly string[];
  readonly intro: string;
  readonly columns: readonly {
    readonly title: string;
    readonly skills: readonly string[];
  }[];
  readonly softTitle: string;
  readonly softSkills: readonly string[];
};

export type ToolBand = {
  readonly title: string;
  readonly tools: readonly string[];
};

export type VerificationCard = {
  readonly title: string;
  readonly text: string;
  readonly highlighted?: boolean;
};

export type SkillsContent = {
  readonly hero: HeroContent;
  readonly showcase: SkillsShowcase;
  readonly competencies: {
    readonly heading: string;
    readonly intro: string;
    readonly items: readonly Competency[];
  };
  readonly stack: {
    readonly heading: string;
    readonly intro: string;
    readonly bands: readonly ToolBand[];
  };
  readonly architecture: {
    readonly heading: string;
    readonly intro: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly points: readonly string[];
  };
  readonly verification: {
    readonly heading: string;
    readonly intro: string;
    readonly cards: readonly VerificationCard[];
  };
  readonly statement: StatementContent;
  readonly cta: CallToAction;
};

export type BlogContent = {
  readonly eyebrow: string;
  readonly title: readonly string[];
  readonly intro: string;
};

export type PortfolioContent = {
  readonly about: AboutContent;
  readonly projects: ProjectsContent;
  readonly skills: SkillsContent;
  readonly blog: BlogContent;
};
