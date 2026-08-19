import { Menu, X } from 'lucide-react';
import { useEffect, useState, type MouseEvent, type RefObject } from 'react';
import type { MDXContent } from 'mdx/types.js';

type MdxTableOfContentsProps = {
  readonly articleRef: RefObject<HTMLElement | null>;
  readonly contentKey: MDXContent;
  readonly label: string;
  readonly openLabel: string;
  readonly closeLabel: string;
};

type HeadingLevel = 1 | 2 | 3;

type TableOfContentsItem = {
  readonly id: string;
  readonly label: string;
  readonly level: HeadingLevel;
  readonly children: TableOfContentsItem[];
};

type HeadingEntry = {
  readonly element: HTMLHeadingElement;
  readonly id: string;
};

function createHeadingId(text: string, index: number): string {
  const slug = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return slug || `section-${index + 1}`;
}

function getHeadingLabel(heading: HTMLHeadingElement, index: number): string {
  return heading.textContent?.trim() || `Section ${index + 1}`;
}

function createHeadingTree(headings: readonly HTMLHeadingElement[]) {
  const usedIds = new Set<string>();
  const roots: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];
  const entries: HeadingEntry[] = [];

  headings.forEach((heading, index) => {
    const baseId = heading.id || createHeadingId(getHeadingLabel(heading, index), index);
    let id = baseId;
    let duplicateIndex = 2;

    while (usedIds.has(id)) {
      id = `${baseId}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedIds.add(id);
    heading.id = id;

    const level = Number(heading.tagName.slice(1)) as HeadingLevel;
    const item: TableOfContentsItem = {
      id,
      label: getHeadingLabel(heading, index),
      level,
      children: [],
    };

    while (true) {
      const current = stack.at(-1);

      if (!current || current.level < level) {
        break;
      }

      stack.pop();
    }

    const parent = stack.at(-1);

    if (parent) {
      parent.children.push(item);
    } else {
      roots.push(item);
    }

    stack.push(item);
    entries.push({ element: heading, id });
  });

  return { entries, items: roots };
}

export function MdxTableOfContents({
  articleRef,
  contentKey,
  label,
  openLabel,
  closeLabel,
}: MdxTableOfContentsProps) {
  const [items, setItems] = useState<readonly TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const article = articleRef.current;

    if (!article) {
      return undefined;
    }

    const allHeadings = Array.from(article.querySelectorAll<HTMLHeadingElement>('h1, h2, h3'));
    const firstHeading = allHeadings[0];
    const headings = firstHeading?.tagName === 'H1' ? allHeadings.slice(1) : allHeadings;
    const { entries, items: nextItems } = createHeadingTree(headings);

    setItems(nextItems);
    setActiveId(entries[0]?.id ?? '');

    const scrollRoot = article.closest<HTMLElement>('.project-modal');
    const scrollTarget: Window | HTMLElement = scrollRoot ?? window;
    const stickyHeader = scrollRoot?.querySelector<HTMLElement>('.project-modal__header');

    function getActivationLine() {
      const rootTop = scrollRoot?.getBoundingClientRect().top ?? 0;
      const headerBottom = stickyHeader?.getBoundingClientRect().bottom ?? rootTop + 80;

      return headerBottom + 24;
    }

    function updateActiveFromScroll() {
      const activationLine = getActivationLine();
      let currentId = entries[0]?.id ?? '';

      entries.forEach((entry) => {
        if (entry.element.getBoundingClientRect().top <= activationLine) {
          currentId = entry.id;
        }
      });

      setActiveId((previousId) => (previousId === currentId ? previousId : currentId));
    }

    updateActiveFromScroll();
    scrollTarget.addEventListener('scroll', updateActiveFromScroll, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', updateActiveFromScroll);
    };
  }, [articleRef, contentKey]);

  if (items.length === 0) {
    return null;
  }

  function handleItemClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();

    const article = articleRef.current;
    const target = article
      ? Array.from(article.querySelectorAll<HTMLElement>('h1, h2, h3')).find((heading) => heading.id === id)
      : undefined;

    if (!target) {
      return;
    }

    setActiveId(id);
    setIsOpen(false);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderItems(tocItems: readonly TableOfContentsItem[], nested = false) {
    return (
      <ol className={nested ? 'mdx-toc__nested-list' : 'mdx-toc__list'}>
        {tocItems.map((item) => (
          <li
            key={item.id}
            className={`mdx-toc__item mdx-toc__item--level-${item.level}${activeId === item.id ? ' is-active' : ''}`}
          >
            <a
              className="mdx-toc__link"
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'location' : undefined}
              tabIndex={isMobile && !isOpen ? -1 : undefined}
              onClick={(event) => handleItemClick(event, item.id)}
            >
              {item.label}
            </a>
            {item.children.length > 0 ? renderItems(item.children, true) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <>
      <button
        type="button"
        className="mdx-toc__toggle"
        aria-expanded={isOpen}
        aria-controls="mdx-toc-navigation"
        aria-label={isOpen ? closeLabel : openLabel}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {isOpen ? (
        <button
          type="button"
          className="mdx-toc__scrim"
          aria-label={closeLabel}
          onClick={() => setIsOpen(false)}
        />
      ) : null}
      <nav
        id="mdx-toc-navigation"
        className={`mdx-toc${isOpen ? ' mdx-toc--open' : ''}`}
        aria-label={label}
        aria-hidden={isMobile && !isOpen ? true : undefined}
      >
        <p className="mdx-toc__label">{label}</p>
        {renderItems(items)}
      </nav>
    </>
  );
}
