import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InlineCopy } from '../components/ui/InlineCopy';
import { getSiteContent } from '../content/siteContent';

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

describe('migrated content', () => {
  it('preserves the text of every migrated Polish inline content field', () => {
    const content = getSiteContent('pl').portfolio;
    const cases = [
      [
        content.about.hero.lead,
        'Mieszkam w Gdańsku, skąd pracuję AI-native. Buduję aplikacje, narzędzia i eksperymenty. Technologia, zarówno software, jak i hardware, była ze mną dużo wcześniej niż development. Do świata dev nie trafiłem jednak najkrótszą drogą.',
      ],
      [
        content.about.story.paragraphs[0]!,
        'Zaczynam od użytkownika i obecnego workflow. Sprawdzam istniejące rozwiązania, wymagania i ograniczenia, a następnie wybieram reprezentację problemu oraz technologię.',
      ],
      [
        content.about.story.paragraphs[1]!,
        'Pracuję szeroko: frontend, backend, API, dane, automatyzacja, AI i architektura aplikacji. Łączę te obszary w jeden workflow i w razie potrzeby szybko poznaję brakującą domenę.',
      ],
      [
        content.projects.hero.lead,
        'Projekty są na różnych etapach: od narzędzia shipped i publicznej bety po systemy rozwijane, prototyp oraz zakończony eksperyment. Każdy z nich pokazuje inny fragment procesu — od rozpoznania problemu po weryfikację założeń.',
      ],
      [
        content.skills.hero.lead,
        'Pracuję na styku product thinking, systems thinking, AI-native development i praktycznego budowania aplikacji full-stack. Poniżej są technologie i praktyki, z których korzystałem w swoich projektach.',
      ],
      [
        content.skills.architecture.paragraphs[0]!,
        'Dbam o jednoznaczne nazwy, lokalność kodu, małe moduły, czytelne public API, kierunek zależności oraz opis najważniejszych flows i schematów danych. Repozytorium traktuję jako część projektu systemu: jego struktura ma ułatwiać orientację człowiekowi, a jednocześnie ograniczać przestrzeń błędnych decyzji agenta.',
      ],
      [
        content.skills.architecture.paragraphs[1]!,
        'Ten temat stał się na tyle ważny w mojej pracy, że zacząłem rozwijać RepoAtlas — narzędzie edukacyjno-projektowe do wizualizowania architektur, odpowiedzialności modułów i reguł zależności. Projekt wyrósł bezpośrednio z potrzeby lepszego porządkowania repozytoriów i pracy z ich strukturą.',
      ],
    ] as const;

    for (const [copy, expectedText] of cases) {
      const { container, unmount } = render(<InlineCopy copy={copy} />);

      expect(container.textContent).toBe(expectedText);
      unmount();
    }
  });

  it('migrates the English empty hero leads to empty strings', () => {
    const content = getSiteContent('en').portfolio;

    expect(content.about.hero.lead).toBe('');
    expect(content.projects.hero.lead).toBe('');
    expect(content.skills.hero.lead).toBe('');

    const { container } = render(<InlineCopy copy={content.about.hero.lead} />);
    expect(container).toBeEmptyDOMElement();
  });
});
