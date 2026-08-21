import { LoaderCircle, TriangleAlert, FileText } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

import type { Messages } from '../../content/messages';
import type { ContentAssetScope, ContentDocument, ContentRequest } from '../../content/mdx/loader';
import { loadContent } from '../../content/mdx/loader';
import { MdxContent, type MdxContentVariant } from './MdxContent';

type ContentDocumentViewProps = {
  readonly request: ContentRequest;
  readonly messages: Messages;
  readonly loadingMessage: string;
  readonly missingMessage: string;
  readonly errorMessage: string;
  readonly scope?: ContentAssetScope;
  readonly variant?: MdxContentVariant;
  readonly topActions?: ReactNode;
  readonly header?: ReactNode;
};

type LoadState = {
  readonly status: 'loading' | 'loaded' | 'missing' | 'error';
  readonly document: ContentDocument | null;
};

export function ContentDocumentView({
  request,
  messages,
  loadingMessage,
  missingMessage,
  errorMessage,
  scope,
  variant = 'modal',
  topActions,
  header,
}: ContentDocumentViewProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading', document: null });
  const { locale, slug, type } = request;

  useEffect(() => {
    let isActive = true;

    void loadContent({ locale, slug, type })
      .then((document) => {
        if (isActive) {
          setState({ status: document ? 'loaded' : 'missing', document });
        }
      })
      .catch(() => {
        if (isActive) {
          setState({ status: 'error', document: null });
        }
      });

    return () => {
      isActive = false;
    };
  }, [locale, slug, type]);

  if (state.status === 'loading') {
    return (
      <section className="content-document-state" role="status" aria-live="polite">
        <LoaderCircle className="content-document-state__spinner" aria-hidden="true" />
        <p>{loadingMessage}</p>
      </section>
    );
  }

  if (state.status !== 'loaded' || !state.document) {
    return (
      <section className="content-document-state content-document-state--error" role="alert">
        <TriangleAlert aria-hidden="true" />
        <p>{state.status === 'missing' ? missingMessage : errorMessage}</p>
      </section>
    );
  }

  return (
    <MdxContent
      document={state.document}
      messages={messages}
      scope={scope ?? request}
      variant={variant}
      topActions={topActions}
      header={header}
    />
  );
}

export function ContentDocumentPlaceholder({ message }: { readonly message: string }) {
  return (
    <section className="content-document-state" aria-live="polite">
      <FileText aria-hidden="true" />
      <p>{message}</p>
    </section>
  );
}
