import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InlineCopy } from '../components/ui/InlineCopy';

describe('InlineCopy', () => {
  it('renders emphasis, strong text, and inline code', () => {
    const { container } = render(<InlineCopy copy="A **bold**, *italic*, and `code`." />);

    expect(container.querySelector('strong')).toHaveTextContent('bold');
    expect(container.querySelector('strong')).toHaveClass('inline-copy__strong');
    expect(container.querySelector('em')).toHaveTextContent('italic');
    expect(container.querySelector('code')).toHaveTextContent('code');
    expect(container.textContent).toBe('A bold, italic, and code.');
  });

  it('supports nested emphasis', () => {
    const { container } = render(<InlineCopy copy="***bold italic***" />);

    expect(container.querySelector('strong > em')).toHaveTextContent('bold italic');
    expect(container.textContent).toBe('bold italic');
  });

  it('renders Markdown links with nested formatting and a decorative arrow', () => {
    const { container } = render(<InlineCopy copy="**[RepoAtlas](/pl/projects?caseStudy=repoatlas)**" />);
    const link = container.querySelector<HTMLAnchorElement>('a.inline-copy__link');

    expect(link).toHaveAttribute('href', '/pl/projects?caseStudy=repoatlas');
    expect(link).toHaveAccessibleName('RepoAtlas');
    expect(link?.parentElement).toHaveClass('inline-copy__strong');
    expect(link?.querySelector('.content-link__icon')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.content-link__icon')).toHaveLength(1);
    expect(container.textContent).toBe('RepoAtlas');
  });

  it('keeps links inside code, malformed links, and unsafe links as text', () => {
    const copy = '`[code](/path)` [open](/path [unsafe](javascript:alert(1))';
    const { container } = render(<InlineCopy copy={copy} />);

    expect(container.querySelector('code')).toHaveTextContent('[code](/path)');
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.content-link__icon')).toHaveLength(0);
    expect(container.textContent).toBe('[code](/path) [open](/path [unsafe](javascript:alert(1))');
  });

  it('renders every newline as a line break, including stacked newlines', () => {
    const { container } = render(<InlineCopy copy={'first\n\nthird'} />);

    expect(container.querySelectorAll('br')).toHaveLength(2);
    expect(container.textContent).toBe('firstthird');
  });

  it('normalizes Windows line endings', () => {
    const { container } = render(<InlineCopy copy={'first\r\nsecond'} />);

    expect(container.querySelectorAll('br')).toHaveLength(1);
    expect(container.textContent).toBe('firstsecond');
  });

  it('supports escaping formatting markers', () => {
    const copy = String.raw`\*literal\* \`code\` \\`;
    const { container } = render(<InlineCopy copy={copy} />);

    expect(container.querySelector('em')).not.toBeInTheDocument();
    expect(container.querySelector('code')).not.toBeInTheDocument();
    expect(container.textContent).toBe('*literal* `code` \\');
  });

  it('keeps unmatched markers as literal text', () => {
    const { container } = render(<InlineCopy copy="A **bold" />);

    expect(container.querySelector('strong')).not.toBeInTheDocument();
    expect(container.textContent).toBe('A **bold');
  });

  it('does not format content inside inline code', () => {
    const { container } = render(<InlineCopy copy="`**not bold** *not italic*`" />);

    expect(container.querySelector('strong')).not.toBeInTheDocument();
    expect(container.querySelector('em')).not.toBeInTheDocument();
    expect(container.querySelector('code')).toHaveTextContent('**not bold** *not italic*');
  });

  it('renders HTML-looking input as text', () => {
    const { container } = render(<InlineCopy copy={'<img src="x" onerror="alert(1)" />'} />);

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(container.textContent).toBe('<img src="x" onerror="alert(1)" />');
  });
});
