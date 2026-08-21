import { createElement, type ReactNode } from 'react';

import { ContentLink } from './ContentLink';

type ParseResult = {
  readonly nodes: ReactNode[];
  readonly index: number;
  readonly closed: boolean;
};

type Marker = '***' | '**' | '*';

type InlineLink = {
  readonly href: string;
  readonly label: string;
  readonly end: number;
};

const inlineCodeClassName = 'inline-copy__code';
const inlineLinkClassName = 'inline-copy__link';
const inlineStrongClassName = 'inline-copy__strong';

export function renderInlineMarkdown(value: string): readonly ReactNode[] {
  return renderSequence(normalizeLineEndings(value), 0).nodes;
}

function renderSequence(source: string, start: number, closingMarker?: Marker): ParseResult {
  const nodes: ReactNode[] = [];
  let text = '';
  let index = start;

  const flushText = () => {
    if (text) {
      nodes.push(text);
      text = '';
    }
  };

  while (index < source.length) {
    if (closingMarker && source.startsWith(closingMarker, index)) {
      flushText();
      return { nodes, index: index + closingMarker.length, closed: true };
    }

    const character = source[index];

    if (character === undefined) {
      break;
    }

    if (character === '\\') {
      const nextCharacter = source[index + 1];

      if (isEscapableMarker(nextCharacter)) {
        text += nextCharacter;
        index += 2;
        continue;
      }

      text += character;
      index += 1;
      continue;
    }

    if (character === '\n') {
      flushText();
      nodes.push(createElement('br', { key: `break-${index}` }));
      index += 1;
      continue;
    }

    if (character === '`') {
      const closingIndex = findClosingCode(source, index + 1);

      if (closingIndex > index + 1) {
        flushText();
        nodes.push(
          createElement(
            'code',
            { key: `code-${index}`, className: inlineCodeClassName },
            source.slice(index + 1, closingIndex),
          ),
        );
        index = closingIndex + 1;
        continue;
      }

      text += character;
      index += 1;
      continue;
    }

    if (character === '[') {
      const link = parseInlineLink(source, index);

      if (link) {
        flushText();
        nodes.push(
          createElement(
            ContentLink,
            { key: `link-${index}`, href: link.href, className: inlineLinkClassName },
            renderSequence(link.label, 0).nodes,
          ),
        );
        index = link.end;
        continue;
      }
    }

    const marker = getMarker(source, index);

    if (!marker) {
      text += character;
      index += 1;
      continue;
    }

    const contentStart = index + marker.length;

    if (source.startsWith(marker, contentStart)) {
      text += marker;
      index = contentStart;
      continue;
    }

    const inner = renderSequence(source, contentStart, marker);

    if (!inner.closed) {
      text += marker;
      index = contentStart;
      continue;
    }

    flushText();
    nodes.push(renderFormattedNode(marker, inner.nodes, index));
    index = inner.index;
  }

  flushText();
  return { nodes, index, closed: false };
}

function renderFormattedNode(marker: Marker, children: readonly ReactNode[], index: number): ReactNode {
  if (marker === '***') {
    const emphasis = createElement('em', null, children);
    return createElement('strong', { key: `strong-${index}`, className: inlineStrongClassName }, emphasis);
  }

  if (marker === '**') {
    return createElement('strong', { key: `strong-${index}`, className: inlineStrongClassName }, children);
  }

  return createElement('em', { key: `em-${index}` }, children);
}

function getMarker(source: string, index: number): Marker | null {
  if (source.startsWith('***', index)) {
    return '***';
  }

  if (source.startsWith('**', index)) {
    return '**';
  }

  return source[index] === '*' ? '*' : null;
}

function findClosingCode(source: string, start: number): number {
  let index = start;

  while (index < source.length) {
    if (source[index] === '\\' && source[index + 1] === '`') {
      index += 2;
      continue;
    }

    if (source[index] === '`') {
      return index;
    }

    index += 1;
  }

  return -1;
}

function parseInlineLink(source: string, start: number): InlineLink | null {
  const labelEnd = findClosingLinkLabel(source, start + 1);

  if (labelEnd <= start + 1 || source[labelEnd + 1] !== '(') {
    return null;
  }

  const hrefStart = labelEnd + 2;
  const hrefEnd = findClosingLinkDestination(source, hrefStart);

  if (hrefEnd < 0) {
    return null;
  }

  const href = source.slice(hrefStart, hrefEnd).trim();

  if (!isSafeInlineHref(href)) {
    return null;
  }

  return {
    href,
    label: source.slice(start + 1, labelEnd),
    end: hrefEnd + 1,
  };
}

function findClosingLinkLabel(source: string, start: number): number {
  let index = start;

  while (index < source.length) {
    if (source[index] === '\\' && source[index + 1] === ']') {
      index += 2;
      continue;
    }

    if (source[index] === ']') {
      return index;
    }

    index += 1;
  }

  return -1;
}

function findClosingLinkDestination(source: string, start: number): number {
  let depth = 0;
  let index = start;

  while (index < source.length) {
    if (source[index] === '\\' && source[index + 1] !== undefined) {
      index += 2;
      continue;
    }

    if (source[index] === '(') {
      depth += 1;
      index += 1;
      continue;
    }

    if (source[index] === ')') {
      if (depth === 0) {
        return index;
      }

      depth -= 1;
    }

    index += 1;
  }

  return -1;
}

function isSafeInlineHref(value: string): boolean {
  if (!value || hasControlCharacter(value)) {
    return false;
  }

  try {
    const protocol = new URL(value, 'https://inline-copy.invalid').protocol;

    return protocol === 'http:'
      || protocol === 'https:'
      || protocol === 'mailto:'
      || protocol === 'tel:';
  } catch {
    return false;
  }
}

function hasControlCharacter(value: string): boolean {
  return Array.from(value).some((character) => {
    const codePoint = character.codePointAt(0);

    return codePoint !== undefined && (codePoint <= 0x1f || codePoint === 0x7f);
  });
}

function isEscapableMarker(value: string | undefined): value is '*' | '`' | '\\' | '[' | ']' | '(' | ')' {
  return value === '*'
    || value === '`'
    || value === '\\'
    || value === '['
    || value === ']'
    || value === '('
    || value === ')';
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}
