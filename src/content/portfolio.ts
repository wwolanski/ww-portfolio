import type { Locale } from '../routing/locale';

export type Principle = {
  readonly title: string;
  readonly text: string;
};

export type Project = {
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly technologies: readonly string[];
  readonly metric: string;
  readonly href: string;
};

export type Article = {
  readonly title: string;
  readonly category: string;
  readonly date: string;
  readonly readTime: string;
  readonly description: string;
};

export type SkillGroup = {
  readonly title: string;
  readonly index: string;
  readonly skills: readonly string[];
};

export type PageCopy = {
  readonly eyebrow: string;
  readonly title: readonly [string, string];
  readonly intro: string;
};

export type PortfolioContent = {
  readonly about: PageCopy & {
    readonly storyHeading: string;
    readonly lead: string;
    readonly storyParagraphs: readonly string[];
    readonly principlesHeading: string;
    readonly principlesIntro: string;
    readonly principles: readonly Principle[];
    readonly nowHeading: string;
  };
  readonly projects: PageCopy & {
    readonly sectionHeading: string;
    readonly sectionIntro: string;
    readonly projects: readonly Project[];
    readonly noteLead: string;
    readonly noteText: string;
  };
  readonly skills: PageCopy & {
    readonly sectionHeading: string;
    readonly sectionIntro: string;
    readonly groups: readonly SkillGroup[];
    readonly beyondStackHeading: string;
    readonly beyondStackTitle: string;
    readonly beyondStackText: string;
    readonly strengths: readonly string[];
  };
  readonly blog: PageCopy & {
    readonly sectionHeading: string;
    readonly sectionIntro: string;
    readonly articles: readonly Article[];
  };
};

export const portfolioContent = {
  en: {
    about: {
      eyebrow: 'About · 01',
      title: ['I build software', 'with intent.'],
      intro: 'Full-stack developer focused on products that feel effortless to use and remain a pleasure to maintain. I connect thoughtful interfaces, reliable systems, and practical AI.',
      storyHeading: 'The short story',
      lead: 'I’m Wojciech — an engineer who likes turning complicated problems into calm, useful products.',
      storyParagraphs: [
        'My work lives where product thinking meets engineering discipline. I care about the small interaction a user notices and the quiet architectural decision that keeps a system healthy years later.',
        'I collaborate closely, explain trade-offs clearly, and ship in deliberate increments. The goal is not clever code. It is software that earns trust.',
      ],
      principlesHeading: 'How I work',
      principlesIntro: 'Three principles guide every engagement.',
      principles: [
        { title: 'Start with why', text: 'I reduce ambiguity before writing code, so the solution serves a real need.' },
        { title: 'Design for change', text: 'Clear boundaries and simple abstractions keep products adaptable as they grow.' },
        { title: 'Own the outcome', text: 'From product decisions to production metrics, I stay close to the whole system.' },
      ],
      nowHeading: 'Currently exploring human-centered AI products and dependable developer platforms.',
    },
    projects: {
      eyebrow: 'Selected work · 02',
      title: ['Built to make', 'a difference.'],
      intro: 'A selection of products shaped from first sketch to production. Each one balances user needs, technical constraints, and measurable outcomes.',
      sectionHeading: 'Featured projects',
      sectionIntro: 'Full-stack work across product, platform, and applied AI.',
      projects: [
        { title: 'TaskFlow', category: 'Product engineering', summary: 'A focused workspace that turns complex delivery plans into calm, measurable progress.', technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], metric: '42% faster planning', href: 'https://github.com/wollanski' },
        { title: 'Signal RAG', category: 'Applied AI', summary: 'A retrieval platform for accurate answers across large, fast-changing knowledge bases.', technologies: ['Python', 'FastAPI', 'pgvector', 'OpenAI'], metric: '91% answer precision', href: 'https://github.com/wollanski' },
        { title: 'Orbit Commerce', category: 'Full-stack platform', summary: 'A composable commerce engine built for teams that need speed without sacrificing reliability.', technologies: ['React', 'NestJS', 'AWS', 'Docker'], metric: '1.8s LCP', href: 'https://github.com/wollanski' },
      ],
      noteLead: 'Good software is a sequence of good decisions.',
      noteText: 'Every case study can be discussed in detail during an interview — including constraints, rejected approaches, and lessons learned.',
    },
    skills: {
      eyebrow: 'Toolkit · 03',
      title: ['Wide range.', 'Sharp judgment.'],
      intro: 'Technology is a means, not the destination. I choose tools for their fit, understand their trade-offs, and combine them into systems teams can confidently own.',
      sectionHeading: 'Capabilities',
      sectionIntro: 'A T-shaped toolkit with product engineering at its core.',
      groups: [
        { title: 'Frontend', index: '01', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Accessibility', 'Testing Library'] },
        { title: 'Backend', index: '02', skills: ['Node.js', 'Python', 'PostgreSQL', 'REST & GraphQL', 'Event-driven systems', 'API design'] },
        { title: 'Platform', index: '03', skills: ['Docker', 'AWS', 'Kubernetes', 'CI/CD', 'Observability', 'Infrastructure as code'] },
        { title: 'AI Engineering', index: '04', skills: ['RAG pipelines', 'LLM integrations', 'Vector search', 'Evaluation', 'Prompt systems', 'OpenAI API'] },
      ],
      beyondStackHeading: 'Beyond the stack',
      beyondStackTitle: 'Engineering is more than syntax.',
      beyondStackText: 'I bring discovery, system design, accessibility, testing, security thinking, observability, and clear technical communication into the same workflow.',
      strengths: ['Product discovery', 'Technical leadership', 'System design', 'Performance', 'Accessibility', 'Mentoring'],
    },
    blog: {
      eyebrow: 'Notes & ideas · 04',
      title: ['Thinking', 'in public.'],
      intro: 'Field notes on building maintainable systems, useful AI, and software teams that keep learning. Written to clarify ideas and share what works.',
      sectionHeading: 'Latest writing',
      sectionIntro: 'Practical ideas for people who build digital products.',
      articles: [
        { title: 'Designing systems that can change', category: 'Architecture', date: 'Jul 18, 2026', readTime: '8 min', description: 'Practical boundaries, useful abstractions, and the art of leaving room for tomorrow.' },
        { title: 'A practical guide to Docker', category: 'Tutorial', date: 'Jun 04, 2026', readTime: '11 min', description: 'From local feedback loops to production-ready images, without container mythology.' },
        { title: 'RAG pipelines, explained', category: 'AI', date: 'May 21, 2026', readTime: '9 min', description: 'The decisions that matter when retrieval quality needs to survive real-world data.' },
        { title: 'Clean code is contextual', category: 'Engineering', date: 'Apr 09, 2026', readTime: '6 min', description: 'Why readable systems are built through judgment, not rigid rules.' },
      ],
    },
  },
  pl: {
    about: {
      eyebrow: 'O mnie · 01',
      title: ['Tworzę software', 'z intencją.'],
      intro: 'Programista full-stack skupiony na produktach, z których korzysta się intuicyjnie i które przyjemnie się rozwija. Łączę przemyślane interfejsy, niezawodne systemy i praktyczne AI.',
      storyHeading: 'Krótko o mnie',
      lead: 'Jestem Wojciech — inżynierem, który lubi zmieniać złożone problemy w spokojne i użyteczne produkty.',
      storyParagraphs: [
        'Moja praca powstaje na styku myślenia produktowego i inżynierskiej dyscypliny. Zwracam uwagę zarówno na małą interakcję, którą zauważa użytkownik, jak i na cichą decyzję architektoniczną, która chroni system przez lata.',
        'Blisko współpracuję, jasno tłumaczę kompromisy i dostarczam rozwiązania w przemyślanych etapach. Celem nie jest sprytny kod. Celem jest software, któremu można zaufać.',
      ],
      principlesHeading: 'Jak pracuję',
      principlesIntro: 'Trzy zasady prowadzą mnie w każdym projekcie.',
      principles: [
        { title: 'Zaczynam od „dlaczego”', text: 'Zmniejszam niepewność przed napisaniem kodu, żeby rozwiązanie odpowiadało na prawdziwą potrzebę.' },
        { title: 'Projektuję na zmiany', text: 'Jasne granice i proste abstrakcje pomagają produktom rozwijać się bez utraty elastyczności.' },
        { title: 'Biorę odpowiedzialność za efekt', text: 'Od decyzji produktowych po metryki produkcyjne pozostaję blisko całego systemu.' },
      ],
      nowHeading: 'Obecnie rozwijam produkty AI projektowane z myślą o ludziach oraz niezawodne platformy dla developerów.',
    },
    projects: {
      eyebrow: 'Wybrane realizacje · 02',
      title: ['Zbudowane, by', 'robić różnicę.'],
      intro: 'Wybór produktów rozwijanych od pierwszego szkicu do produkcji. Każdy łączy potrzeby użytkowników, ograniczenia techniczne i mierzalne rezultaty.',
      sectionHeading: 'Wybrane projekty',
      sectionIntro: 'Projekty full-stack z obszarów produktu, platform i praktycznego AI.',
      projects: [
        { title: 'TaskFlow', category: 'Inżynieria produktu', summary: 'Skupiona przestrzeń robocza, która zmienia złożone plany dostaw w spokojny i mierzalny postęp.', technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], metric: '42% szybsze planowanie', href: 'https://github.com/wollanski' },
        { title: 'Signal RAG', category: 'Praktyczne AI', summary: 'Platforma wyszukiwania zapewniająca trafne odpowiedzi w dużych i szybko zmieniających się bazach wiedzy.', technologies: ['Python', 'FastAPI', 'pgvector', 'OpenAI'], metric: '91% precyzji odpowiedzi', href: 'https://github.com/wollanski' },
        { title: 'Orbit Commerce', category: 'Platforma full-stack', summary: 'Komponowalny silnik e-commerce dla zespołów, które potrzebują szybkości bez utraty niezawodności.', technologies: ['React', 'NestJS', 'AWS', 'Docker'], metric: '1,8 s LCP', href: 'https://github.com/wollanski' },
      ],
      noteLead: 'Dobry software to sekwencja dobrych decyzji.',
      noteText: 'Każde case study można szczegółowo omówić podczas rozmowy — razem z ograniczeniami, odrzuconymi podejściami i najważniejszymi wnioskami.',
    },
    skills: {
      eyebrow: 'Narzędzia · 03',
      title: ['Szeroki zakres.', 'Trafne decyzje.'],
      intro: 'Technologia jest środkiem, nie celem. Dobieram narzędzia do problemu, rozumiem ich kompromisy i łączę je w systemy, za które zespoły mogą brać odpowiedzialność.',
      sectionHeading: 'Kompetencje',
      sectionIntro: 'Zestaw umiejętności w kształcie litery T, którego centrum stanowi inżynieria produktu.',
      groups: [
        { title: 'Frontend', index: '01', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Dostępność', 'Testing Library'] },
        { title: 'Backend', index: '02', skills: ['Node.js', 'Python', 'PostgreSQL', 'REST i GraphQL', 'Systemy zdarzeniowe', 'Projektowanie API'] },
        { title: 'Platforma', index: '03', skills: ['Docker', 'AWS', 'Kubernetes', 'CI/CD', 'Observability', 'Infrastructure as code'] },
        { title: 'Inżynieria AI', index: '04', skills: ['Pipeline’y RAG', 'Integracje z LLM', 'Wyszukiwanie wektorowe', 'Ewaluacja', 'Systemy promptów', 'OpenAI API'] },
      ],
      beyondStackHeading: 'Poza technologią',
      beyondStackTitle: 'Inżynieria to coś więcej niż składnia.',
      beyondStackText: 'Łączę odkrywanie potrzeb, projektowanie systemów, dostępność, testowanie, myślenie o bezpieczeństwie, obserwowalność i jasną komunikację techniczną w jednym procesie.',
      strengths: ['Odkrywanie produktu', 'Przywództwo techniczne', 'Projektowanie systemów', 'Wydajność', 'Dostępność', 'Mentoring'],
    },
    blog: {
      eyebrow: 'Notatki i idee · 04',
      title: ['Myślę', 'publicznie.'],
      intro: 'Notatki o budowaniu systemów, które da się utrzymywać, użytecznym AI i zespołach, które nie przestają się uczyć. Piszę, żeby porządkować idee i dzielić się tym, co działa.',
      sectionHeading: 'Najnowsze teksty',
      sectionIntro: 'Praktyczne idee dla osób tworzących cyfrowe produkty.',
      articles: [
        { title: 'Jak projektować systemy gotowe na zmiany', category: 'Architektura', date: '18 lip 2026', readTime: '8 min', description: 'Praktyczne granice, użyteczne abstrakcje i sztuka zostawiania miejsca na jutro.' },
        { title: 'Praktyczny przewodnik po Dockerze', category: 'Poradnik', date: '04 cze 2026', readTime: '11 min', description: 'Od lokalnej pętli informacji zwrotnej po obrazy gotowe na produkcję — bez mitologii kontenerów.' },
        { title: 'Pipeline’y RAG bez tajemnic', category: 'AI', date: '21 maj 2026', readTime: '9 min', description: 'Decyzje, które mają znaczenie, gdy jakość wyszukiwania musi wytrzymać prawdziwe dane.' },
        { title: 'Czysty kod zależy od kontekstu', category: 'Inżynieria', date: '09 kwi 2026', readTime: '6 min', description: 'Dlaczego czytelne systemy powstają dzięki osądowi, a nie sztywnym regułom.' },
      ],
    },
  },
} satisfies Record<Locale, PortfolioContent>;
