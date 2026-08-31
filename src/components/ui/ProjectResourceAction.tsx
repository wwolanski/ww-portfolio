import { Icon } from '@iconify/react';
import { Images } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { ContentAssetScope } from '../../content/mdx/loader';
import { getContentImages } from '../../content/mdx/imageAssets';
import type { Messages } from '../../content/messages';
import type { Project, ProjectExternalLink } from '../../content/types';
import type { Locale } from '../../routing/locale';
import { ImageLightbox } from '../content/ImageGallery';

type ProjectResourceActionProps = {
  readonly project: Project;
  readonly locale: Locale;
  readonly messages: Messages;
};

const providerLabels = {
  github: 'GitHub',
  vercel: 'Vercel',
} as const;

export function ProjectResourceAction({ project, locale, messages }: ProjectResourceActionProps) {
  if (project.externalLink) {
    return <ExternalProjectLink project={project} link={project.externalLink} messages={messages} />;
  }

  return <ProjectGalleryAction project={project} locale={locale} messages={messages} />;
}

type ExternalProjectLinkProps = {
  readonly project: Project;
  readonly link: ProjectExternalLink;
  readonly messages: Messages;
};

function ExternalProjectLink({ project, link, messages }: ExternalProjectLinkProps) {
  const providerLabel = providerLabels[link.provider];
  const label = messages.projectContent.openExternal(providerLabel, project.title);

  return (
    <a
      className={`project-resource-action project-resource-action--${link.provider}`}
      data-project-action="external"
      data-project-provider={link.provider}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    >
      <ProjectProviderIcon provider={link.provider} />
    </a>
  );
}

function ProjectProviderIcon({ provider }: { readonly provider: ProjectExternalLink['provider'] }) {
  return (
    <Icon
      icon={`simple-icons:${provider}`}
      width="1.35em"
      height="1.35em"
      aria-hidden="true"
    />
  );
}

type ProjectGalleryActionProps = {
  readonly project: Project;
  readonly locale: Locale;
  readonly messages: Messages;
};

function ProjectGalleryAction({ project, locale, messages }: ProjectGalleryActionProps) {
  const scope = useMemo<ContentAssetScope>(
    () => ({
      type: 'project',
      slug: project.caseStudySlug ?? project.slug,
      locale,
    }),
    [locale, project.caseStudySlug, project.slug],
  );
  const images = useMemo(() => getContentImages(scope), [scope]);
  const [imageIndex, setImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const showPreviousImage = useCallback(
    () => setImageIndex((index) => (index - 1 + images.length) % images.length),
    [images.length],
  );
  const showNextImage = useCallback(
    () => setImageIndex((index) => (index + 1) % images.length),
    [images.length],
  );
  const openLightbox = useCallback(() => {
    if (images.length === 0) {
      return;
    }

    setImageIndex(0);
    setIsLightboxOpen(true);
  }, [images.length]);
  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);

  const image = images[imageIndex];
  const label = messages.projectContent.openGallery(project.title);
  const imageAlt = image && image.alt === 'Image'
    ? messages.content.imageGallery.image(imageIndex + 1)
    : image?.alt ?? '';

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="project-resource-action project-resource-action--gallery"
        data-project-action="gallery"
        aria-label={label}
        title={label}
        aria-haspopup="dialog"
        disabled={images.length === 0}
        onClick={openLightbox}
      >
        <Images aria-hidden="true" />
      </button>
      {isLightboxOpen && image ? (
        <ImageLightbox
          images={images}
          imageIndex={imageIndex}
          imageAlt={imageAlt}
          copy={messages.content.imageGallery}
          triggerRef={triggerRef}
          onPrevious={showPreviousImage}
          onNext={showNextImage}
          onClose={closeLightbox}
        />
      ) : null}
    </>
  );
}
