import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import './ImageGallery.css';
import type { ContentAssetScope } from '../../content/mdx/loader';
import { getContentImages } from '../../content/mdx/imageAssets';

export type ImageGalleryCopy = {
  readonly label: string;
  readonly previous: string;
  readonly next: string;
  readonly image: (index: number) => string;
  readonly empty: string;
};

type ImageGalleryProps = {
  readonly scope: ContentAssetScope;
  readonly copy: ImageGalleryCopy;
};

export function ImageGallery({ scope, copy }: ImageGalleryProps) {
  const images = getContentImages(scope);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  function showPreviousImage() {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  }

  function showNextImage() {
    setCurrentIndex((index) => (index + 1) % images.length);
  }

  return (
    <section className="mdx-image-gallery" aria-label={copy.label}>
      {images.length > 1 ? (
        <button
          type="button"
          className="mdx-image-gallery__button mdx-image-gallery__button--previous"
          aria-label={copy.previous}
          onClick={showPreviousImage}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
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
      </div>

      {images.length > 1 ? (
        <button
          type="button"
          className="mdx-image-gallery__button mdx-image-gallery__button--next"
          aria-label={copy.next}
          onClick={showNextImage}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      ) : null}
    </section>
  );
}
