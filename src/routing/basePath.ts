export function withBasePath(href: string | undefined, basePath: string): string | undefined {
  if (!href || basePath === '/' || !href.startsWith('/') || href.startsWith('//')) {
    return href;
  }

  const normalizedBasePath = basePath.replace(/\/+$/, '');

  if (!normalizedBasePath || href === normalizedBasePath || href.startsWith(`${normalizedBasePath}/`)) {
    return href;
  }

  return `${normalizedBasePath}${href}`;
}
