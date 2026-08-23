import type { ContentAssetScope } from './loader';

export type ContentImage = {
  readonly src: string;
  readonly filename: string;
  readonly alt: string;
};

const imageModules = import.meta.glob<string>('/src/content/locales/*/*/*/images/*', {
  eager: true,
  import: 'default',
  query: '?url',
});

const imageExtensionPattern = /\.(?:apng|avif|bmp|gif|heic|heif|ico|jpe?g|jxl|png|svg|tiff?|webp)$/i;

function getImageFilename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

function getImageAlt(filename: string): string {
  const withoutExtension = filename.replace(/\.[^.]+$/, '');

  return withoutExtension.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Image';
}

function getImageDirectory(scope: ContentAssetScope): string {
  const contentDirectory = scope.type === 'project' ? 'projects' : 'blog';

  return `/src/content/locales/${scope.locale}/${contentDirectory}/${scope.slug}/images/`;
}

export function getContentImages(scope: ContentAssetScope): readonly ContentImage[] {
  const directory = getImageDirectory(scope);

  return Object.entries(imageModules)
    .filter(
      ([path, src]) =>
        path.startsWith(directory) && imageExtensionPattern.test(path) && typeof src === 'string',
    )
    .sort(([left], [right]) =>
      getImageFilename(left).localeCompare(getImageFilename(right), undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    )
    .map(([path, src]) => {
      const filename = getImageFilename(path);

      return {
        src,
        filename,
        alt: getImageAlt(filename),
      };
    });
}

export function getContentImage(
  scope: ContentAssetScope,
  filename: string,
): ContentImage | undefined {
  return getContentImages(scope).find((image) => image.filename === filename);
}
