import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useRef, type RefObject } from 'react';

import './ProjectModal.css';
import type { Messages } from '../../content/messages';
import type { Project } from '../../content/types';
import type { Locale } from '../../routing/locale';
import { ProjectCaseStudy } from '../content/ProjectCaseStudy';

type ProjectModalProps = {
  readonly project: Project;
  readonly locale: Locale;
  readonly messages: Messages;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
  readonly onClose: () => void;
  readonly onViewPolish: () => void;
};

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function ProjectModal({
  project,
  locale,
  messages,
  triggerRef,
  onClose,
  onViewPolish,
}: ProjectModalProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const openerElement = triggerRef.current;
    const rootElement = document.documentElement;
    const hadScrollLock = rootElement.classList.contains('is-scroll-locked');

    rootElement.classList.add('is-scroll-locked');
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => element.tabIndex >= 0 && !element.closest('[inert], [aria-hidden="true"]'));

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      if (!hadScrollLock) {
        rootElement.classList.remove('is-scroll-locked');
      }

      const focusTarget = openerElement ?? previousActiveElement;

      if (focusTarget && document.contains(focusTarget)) {
        focusTarget.focus();
      }
    };
  }, [onClose, triggerRef]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div className="project-modal" role="presentation" onClick={handleBackdropClick}>
      <section
        ref={panelRef}
        className="project-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="project-modal__header">
          <h2 className="project-modal__title">{project.title}</h2>
          <button ref={closeButtonRef} type="button" className="project-modal__close" onClick={onClose} aria-label={messages.projectContent.close}>
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="project-modal__body">
          <ProjectCaseStudy
            project={project}
            locale={locale}
            messages={messages}
            onViewPolish={onViewPolish}
          />
        </div>
      </section>
    </div>,
    document.body,
  );
}
