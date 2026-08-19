// Keys are canonical project slugs from the localized project content. Values
// are the physical logo directories; `ohub` keeps the existing supplied asset
// connected to the `orderhub-pos-wms` project without renaming that asset.
export const projectLogoRegistry = {
  'bank-statement-converter': 'bank-statement-converter',
  kukla2d: 'kukla2d',
  taxhelper: 'taxhelper',
  'repoatlas': 'repoatlas',
  'orderhub-pos-wms': 'ohub',
  'gpt_img_2-spritesheet-processor': 'gpt_img_2-spritesheet-processor',
} as const satisfies Readonly<Record<string, string>>;

type ProjectLogoSlug = keyof typeof projectLogoRegistry;

const logoModules = import.meta.glob<string>(
  '/img/logos/**/*.{apng,avif,bmp,gif,heic,heif,ico,jpeg,jpg,jxl,png,svg,tif,tiff,webp}',
  {
    eager: true,
    import: 'default',
    query: '?url',
  },
);

const imageExtensionPattern = /\.(?:apng|avif|bmp|gif|heic|heif|ico|jpe?g|jxl|png|svg|tiff?|webp)$/i;

function getLogoFilename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

export function getProjectLogo(slug: string): string | null {
  if (!Object.hasOwn(projectLogoRegistry, slug)) {
    return null;
  }

  const directory = projectLogoRegistry[slug as ProjectLogoSlug];
  const directoryPrefix = `/img/logos/${directory}/`;
  const logo = Object.entries(logoModules)
    .filter(([path, src]) => path.startsWith(directoryPrefix) && imageExtensionPattern.test(path) && typeof src === 'string')
    .sort(([left], [right]) =>
      getLogoFilename(left).localeCompare(getLogoFilename(right), undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    )
    .map(([, src]) => src)
    .at(0);

  return logo ?? null;
}
