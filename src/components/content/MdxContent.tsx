import { MDXProvider } from '@mdx-js/react';
import type { MDXComponents } from 'mdx/types.js';
import type { ComponentProps } from 'react';

import './MdxContent.css';
import { ImageGallery } from './ImageGallery';
import { ContentAlert } from './ContentAlert';
import { contentAlertTypes, type ContentAlertType } from './contentAlertTypes';
import type { ContentAssetScope, ContentDocument } from '../../content/mdx/loader';
import type { Messages } from '../../content/messages';

type MdxContentProps = {
  readonly document: ContentDocument;
  readonly messages: Messages;
  readonly scope?: ContentAssetScope;
};

type AlertBlockquoteProps = ComponentProps<'blockquote'> & {
  readonly 'data-alert-type'?: string;
};

function isContentAlertType(value: string | undefined): value is ContentAlertType {
  return contentAlertTypes.includes(value as ContentAlertType);
}

function ContentBlockquote({ 'data-alert-type': alertType, children, ...props }: AlertBlockquoteProps) {
  if (isContentAlertType(alertType)) {
    return <ContentAlert type={alertType}>{children}</ContentAlert>;
  }

  return <blockquote {...props}>{children}</blockquote>;
}

function ContentImage({ alt = '', ...props }: ComponentProps<'img'>) {
  return <img {...props} alt={alt} loading="lazy" decoding="async" />;
}

function ContentLink({ target, rel, ...props }: ComponentProps<'a'>) {
  const safeRel = target === '_blank' ? rel ?? 'noreferrer' : rel;

  return <a {...props} target={target} rel={safeRel} />;
}

function ContentPre({ className, ...props }: ComponentProps<'pre'>) {
  return <pre {...props} className={className ? `mdx-code-block ${className}` : 'mdx-code-block'} />;
}

function ContentCode({ className, ...props }: ComponentProps<'code'>) {
  return <code {...props} className={className ? `mdx-code ${className}` : 'mdx-code'} />;
}

function ContentTable({ children, ...props }: ComponentProps<'table'>) {
  return (
    <div className="mdx-table-wrap">
      <table {...props}>{children}</table>
    </div>
  );
}

const contentComponents = {
  a: ContentLink,
  blockquote: ContentBlockquote,
  code: ContentCode,
  img: ContentImage,
  pre: ContentPre,
  table: ContentTable,
} satisfies MDXComponents;

export function MdxContent({ document, messages, scope }: MdxContentProps) {
  const Component = document.Component;
  const scopedComponents = {
    ...contentComponents,
    ImageGallery: scope
      ? () => (
          <ImageGallery
            key={`${scope.type}:${scope.locale}:${scope.slug}`}
            scope={scope}
            copy={messages.content.imageGallery}
          />
        )
      : () => null,
  } satisfies MDXComponents;

  return (
    <article className="mdx-content">
      <MDXProvider components={scopedComponents}>
        <Component />
      </MDXProvider>
    </article>
  );
}
