import { Icon } from '@iconify/react';
import { FileText, Languages, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { ContentDocument } from '../../content/mdx/loader';
import { loadContent } from '../../content/mdx/loader';
import type { Messages } from '../../content/messages';
import type { Project } from '../../content/types';
import type { Locale } from '../../routing/locale';
import { MdxContent } from './MdxContent';

type ProjectCaseStudyProps = {
  readonly project: Project;
  readonly locale: Locale;
  readonly messages: Messages;
  readonly onViewPolish: () => void;
};

export function ProjectCaseStudy({ project, locale, messages, onViewPolish }: ProjectCaseStudyProps) {
  if (!project.caseStudySlug) {
    return <ProjectContentPlaceholder message={messages.projectContent.preparation} />;
  }

  if (locale !== 'pl') {
    return (
      <section className="project-content-state project-content-state--locale" aria-live="polite">
        <Languages aria-hidden="true" />
        <p>{messages.projectContent.onlyPolish}</p>
        <button type="button" className="project-content-state__action" onClick={onViewPolish}>
          <Icon icon="circle-flags:pl" width="20" height="20" aria-hidden="true" />
          <span>{messages.projectContent.viewPolish}</span>
        </button>
      </section>
    );
  }

  return (
    <LoadedProjectCaseStudy
      key={`${locale}:${project.caseStudySlug}`}
      slug={project.caseStudySlug}
      locale={locale}
      messages={messages}
    />
  );
}

type LoadedProjectCaseStudyProps = {
  readonly slug: string;
  readonly locale: Locale;
  readonly messages: Messages;
};

type LoadState = {
  readonly status: 'loading' | 'loaded' | 'missing' | 'error';
  readonly document: ContentDocument | null;
};

function LoadedProjectCaseStudy({ slug, locale, messages }: LoadedProjectCaseStudyProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading', document: null });

  useEffect(() => {
    let isActive = true;

    void loadContent({ type: 'project', slug, locale })
      .then((document) => {
        if (!isActive) {
          return;
        }

        setState({ status: document ? 'loaded' : 'missing', document });
      })
      .catch(() => {
        if (isActive) {
          setState({ status: 'error', document: null });
        }
      });

    return () => {
      isActive = false;
    };
  }, [locale, slug]);

  if (state.status === 'loading') {
    return (
      <section className="project-content-state" role="status" aria-live="polite">
        <LoaderCircle className="project-content-state__spinner" aria-hidden="true" />
        <p>{messages.projectContent.loading}</p>
      </section>
    );
  }

  if (state.status !== 'loaded' || !state.document) {
    return (
      <section className="project-content-state project-content-state--error" role="alert">
        <TriangleAlert aria-hidden="true" />
        <p>{state.status === 'missing' ? messages.projectContent.preparation : messages.projectContent.error}</p>
      </section>
    );
  }

  return (
    <MdxContent
      document={state.document}
      messages={messages}
      scope={{ type: 'project', slug, locale }}
    />
  );
}

function ProjectContentPlaceholder({ message }: { readonly message: string }) {
  return (
    <section className="project-content-state" aria-live="polite">
      <FileText aria-hidden="true" />
      <p>{message}</p>
    </section>
  );
}
