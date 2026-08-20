import { createElement, type ReactNode } from 'react';

type ParseResult = {
  readonly nodes: ReactNode[];
  readonly index: number;
  readonly closed: boolean;
};

type Marker = '***' | '**' | '*';

const inlineCodeClassName = 'inline-copy__code';

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
    return createElement('strong', { key: `strong-${index}` }, emphasis);
  }

  if (marker === '**') {
    return createElement('strong', { key: `strong-${index}` }, children);
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

function isEscapableMarker(value: string | undefined): value is '*' | '`' | '\\' {
  return value === '*' || value === '`' || value === '\\';
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}
