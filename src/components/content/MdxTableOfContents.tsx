import { Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type MouseEvent, type RefObject } from 'react';
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

const contentTopGap = 24;
const readingLineViewportRatio = 0.18;
const minimumReadingLineOffset = 72;
const maximumReadingLineOffset = 160;

function getScrollContainer(article: HTMLElement): HTMLElement | null {
  return article.closest<HTMLElement>('.project-modal__body');
}

function getReadingLine(scrollContainer: HTMLElement | null): number {
  const viewportBounds = scrollContainer?.getBoundingClientRect();
  const viewportTop = viewportBounds?.top ?? 0;
  const viewportHeight = viewportBounds?.height ?? window.innerHeight;
  const readingLineOffset = Math.min(
    maximumReadingLineOffset,
    Math.max(minimumReadingLineOffset, viewportHeight * readingLineViewportRatio),
  );

  return viewportTop + readingLineOffset;
}

function scrollToHeading(article: HTMLElement, target: HTMLElement) {
  const scrollContainer = getScrollContainer(article);
  const behavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  if (scrollContainer) {
    const top = scrollContainer.scrollTop
      + target.getBoundingClientRect().top
      - scrollContainer.getBoundingClientRect().top
      - contentTopGap;

    scrollContainer.scrollTo({ top: Math.max(0, top), behavior });
    return;
  }

  window.scrollTo({
    top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - contentTopGap),
    behavior,
  });
}

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
  const navigationId = useId();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const navigationRef = useRef<HTMLElement | null>(null);
  const [items, setItems] = useState<readonly TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);

      if (!mediaQuery.matches) {
        setIsOpen(false);
      }
    };

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
        window.requestAnimationFrame(() => toggleRef.current?.focus());
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const article = articleRef.current;
    const scrollContainer = article ? getScrollContainer(article) : null;

    if (!article || !scrollContainer || !isMobile) {
      return undefined;
    }

    scrollContainer.classList.toggle('is-toc-open', isOpen);
    article.toggleAttribute('inert', isOpen);

    let focusFrame = 0;

    if (isOpen) {
      focusFrame = window.requestAnimationFrame(() => {
        const activeLink = navigationRef.current?.querySelector<HTMLAnchorElement>('[aria-current="location"]');
        const firstLink = navigationRef.current?.querySelector<HTMLAnchorElement>('.mdx-toc__link');
        (activeLink ?? firstLink)?.focus();
      });
    }

    return () => {
      window.cancelAnimationFrame(focusFrame);
      scrollContainer.classList.remove('is-toc-open');
      article.removeAttribute('inert');
    };
  }, [articleRef, isMobile, isOpen]);

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

    const scrollRoot = getScrollContainer(article);
    const scrollTarget: Window | HTMLElement = scrollRoot ?? window;

    function updateActiveFromScroll() {
      const activationLine = getReadingLine(scrollRoot);
      let currentId = entries[0]?.id ?? '';

      entries.forEach((entry) => {
        if (entry.element.getBoundingClientRect().top <= activationLine) {
          currentId = entry.id;
        }
      });

      const isAtEnd = scrollRoot
        ? scrollRoot.scrollHeight > scrollRoot.clientHeight
          && scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 2
        : document.documentElement.scrollHeight > window.innerHeight
          && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (isAtEnd) {
        currentId = entries.at(-1)?.id ?? currentId;
      }

      setActiveId((previousId) => (previousId === currentId ? previousId : currentId));
    }

    updateActiveFromScroll();
    scrollTarget.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', updateActiveFromScroll);
      window.removeEventListener('resize', updateActiveFromScroll);
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

    if (!article || !target) {
      return;
    }

    setActiveId(id);
    setIsOpen(false);

    window.requestAnimationFrame(() => {
      if (!document.contains(target)) {
        return;
      }

      scrollToHeading(article, target);

      const hadTabIndex = target.hasAttribute('tabindex');
      target.tabIndex = -1;
      target.focus({ preventScroll: true });

      if (!hadTabIndex) {
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    });
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
        ref={toggleRef}
        type="button"
        className="mdx-toc__toggle"
        aria-expanded={isOpen}
        aria-controls={navigationId}
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
          onClick={() => {
            setIsOpen(false);
            window.requestAnimationFrame(() => toggleRef.current?.focus());
          }}
        />
      ) : null}
      <nav
        ref={navigationRef}
        id={navigationId}
        className={`mdx-toc scrollbar-hidden${isOpen ? ' mdx-toc--open' : ''}`}
        aria-label={label}
        aria-hidden={isMobile && !isOpen ? true : undefined}
      >
        <p className="mdx-toc__label">{label}</p>
        {renderItems(items)}
      </nav>
    </>
  );
}
