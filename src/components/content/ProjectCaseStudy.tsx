import { Icon } from '@iconify/react';
import { Languages } from 'lucide-react';

import type { Messages } from '../../content/messages';
import type { Project } from '../../content/types';
import type { Locale } from '../../routing/locale';
import { ContentDocumentPlaceholder, ContentDocumentView } from './ContentDocumentView';

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
      <section className="content-document-state content-document-state--locale" aria-live="polite">
        <Languages aria-hidden="true" />
        <p>{messages.projectContent.onlyPolish}</p>
        <button type="button" className="content-document-state__action" onClick={onViewPolish}>
          <Icon icon="circle-flags:pl" width="20" height="20" aria-hidden="true" />
          <span>{messages.projectContent.viewPolish}</span>
        </button>
      </section>
    );
  }

  return (
    <ContentDocumentView
      key={`${locale}:${project.caseStudySlug}`}
      request={{ type: 'project', slug: project.caseStudySlug, locale }}
      messages={messages}
      loadingMessage={messages.projectContent.loading}
      missingMessage={messages.projectContent.preparation}
      errorMessage={messages.projectContent.error}
      variant="modal"
    />
  );
}

function ProjectContentPlaceholder({ message }: { readonly message: string }) {
  return <ContentDocumentPlaceholder message={message} />;
}
