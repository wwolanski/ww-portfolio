import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';

import type { ContentAssetScope } from '../../content/mdx/loader';
import { getContentImages, type ContentImage } from '../../content/mdx/imageAssets';

export type ImageGalleryCopy = {
  readonly label: string;
  readonly previous: string;
  readonly next: string;
  readonly image: (index: number) => string;
  readonly empty: string;
  readonly expand: string;
  readonly close: string;
};

type ImageGalleryProps = {
  readonly scope: ContentAssetScope;
  readonly copy: ImageGalleryCopy;
};

type GalleryArrowProps = {
  readonly direction: 'previous' | 'next';
  readonly label: string;
  readonly className: string;
  readonly onClick: () => void;
};

export type ImageLightboxProps = {
  readonly images: readonly PreviewImage[];
  readonly imageIndex: number;
  readonly imageAlt: string;
  readonly copy: ImageGalleryCopy;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onClose: () => void;
};

type PreviewImage = Pick<ContentImage, 'src' | 'alt'>;

type ImagePreviewProps = {
  readonly image: PreviewImage;
  readonly copy: ImageGalleryCopy;
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

const noAction = () => undefined;

function GalleryArrow({ direction, label, className, onClick }: GalleryArrowProps) {
  return (
    <button type="button" className={className} aria-label={label} onClick={onClick}>
      {direction === 'previous' ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
    </button>
  );
}

export function ImageLightbox({
  images,
  imageIndex,
  imageAlt,
  copy,
  triggerRef,
  onPrevious,
  onNext,
  onClose,
}: ImageLightboxProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const openerElement = triggerRef.current;
    const rootElement = document.documentElement;
    const hadScrollLock = rootElement.classList.contains('is-scroll-locked');
    const overlayElement = overlayRef.current;

    rootElement.classList.add('is-scroll-locked');
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        event.stopPropagation();
        onPrevious();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
        onNext();
        return;
      }

      if (event.key !== 'Tab' || !overlayElement) {
        return;
      }

      event.stopPropagation();

      const focusableElements = Array.from(overlayElement.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => element.tabIndex >= 0 && !element.closest('[inert], [aria-hidden="true"]'));

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
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

    overlayElement?.addEventListener('keydown', handleKeyDown, true);

    return () => {
      overlayElement?.removeEventListener('keydown', handleKeyDown, true);

      if (!hadScrollLock) {
        rootElement.classList.remove('is-scroll-locked');
      }

      const focusTarget = openerElement ?? previousActiveElement;

      if (focusTarget && document.contains(focusTarget)) {
        focusTarget.focus();
      }
    };
  }, [onClose, onPrevious, onNext, triggerRef]);

  const image = images[imageIndex];

  if (!image) {
    return null;
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div ref={overlayRef} className="image-lightbox" role="presentation" onClick={handleBackdropClick}>
      <section
        ref={panelRef}
        className="image-lightbox__panel"
        role="dialog"
        aria-modal="true"
        aria-label={copy.label}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          className="image-lightbox__image"
          src={image.src}
          alt={imageAlt}
          decoding="async"
        />
        <span className="image-lightbox__counter" aria-live="polite" aria-atomic="true">
          {imageIndex + 1}/{images.length}
        </span>
      </section>
      <button
        ref={closeButtonRef}
        type="button"
        className="image-lightbox__close"
        aria-label={copy.close}
        onClick={onClose}
      >
        <X aria-hidden="true" />
      </button>
      {images.length > 1 ? (
        <>
          <GalleryArrow
            direction="previous"
            label={copy.previous}
            className="image-lightbox__arrow image-lightbox__arrow--previous"
            onClick={onPrevious}
          />
          <GalleryArrow
            direction="next"
            label={copy.next}
            className="image-lightbox__arrow image-lightbox__arrow--next"
            onClick={onNext}
          />
        </>
      ) : null}
    </div>,
    document.body,
  );
}

export function ImagePreview({ image, copy }: ImagePreviewProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const openLightbox = useCallback(() => setIsLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);
  const accessibleLabel = image.alt ? `${copy.expand}: ${image.alt}` : copy.expand;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mdx-image-preview"
        aria-label={accessibleLabel}
        aria-haspopup="dialog"
        onClick={openLightbox}
      >
        <img
          className="mdx-image-preview__image"
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
        />
        <span className="mdx-image-preview__icon" aria-hidden="true">
          <Expand />
        </span>
      </button>
      {isLightboxOpen ? (
        <ImageLightbox
          images={[image]}
          imageIndex={0}
          imageAlt={image.alt}
          copy={copy}
          triggerRef={triggerRef}
          onPrevious={noAction}
          onNext={noAction}
          onClose={closeLightbox}
        />
      ) : null}
    </>
  );
}

export function ImageGallery({ scope, copy }: ImageGalleryProps) {
  const images = getContentImages(scope);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement | null>(null);

  const showPreviousImage = useCallback(
    () => setCurrentIndex((index) => (index - 1 + images.length) % images.length),
    [images.length],
  );
  const showNextImage = useCallback(
    () => setCurrentIndex((index) => (index + 1) % images.length),
    [images.length],
  );
  const openLightbox = useCallback(() => setIsLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);

  if (images.length === 0) {
    return (
      <div className="mdx-image-gallery mdx-image-gallery--empty" role="status">
        <p>{copy.empty}</p>
      </div>
    );
  }

  const imageIndex = Math.min(currentIndex, images.length - 1);
  const image = images[imageIndex];

  if (!image) {
    return null;
  }

  const imageAlt = image.alt === 'Image' ? copy.image(imageIndex + 1) : image.alt;

  return (
    <section className="mdx-image-gallery" aria-label={copy.label}>
      {images.length > 1 ? (
        <GalleryArrow
          direction="previous"
          label={copy.previous}
          className="mdx-image-gallery__button mdx-image-gallery__button--previous"
          onClick={showPreviousImage}
        />
      ) : null}

      <div className="mdx-image-gallery__frame">
        <img
          className="mdx-image-gallery__image"
          src={image.src}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
        />
        <span className="mdx-image-gallery__counter" aria-live="polite" aria-atomic="true">
          {imageIndex + 1}/{images.length}
        </span>
        <button
          ref={expandButtonRef}
          type="button"
          className="mdx-image-gallery__expand"
          aria-label={copy.expand}
          aria-haspopup="dialog"
          onClick={openLightbox}
        >
          <Expand aria-hidden="true" />
        </button>
      </div>

      {images.length > 1 ? (
        <GalleryArrow
          direction="next"
          label={copy.next}
          className="mdx-image-gallery__button mdx-image-gallery__button--next"
          onClick={showNextImage}
        />
      ) : null}

      {isLightboxOpen ? (
        <ImageLightbox
          images={images}
          imageIndex={imageIndex}
          imageAlt={imageAlt}
          copy={copy}
          triggerRef={expandButtonRef}
          onPrevious={showPreviousImage}
          onNext={showNextImage}
          onClose={closeLightbox}
        />
      ) : null}
    </section>
  );
}
