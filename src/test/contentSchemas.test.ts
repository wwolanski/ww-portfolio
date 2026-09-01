import { describe, expect, it } from 'vitest';

import {
  localeContentSchemas,
  type ContentSchema,
} from '../content/contentSchemas';
import enAbout from '../content/locales/en/about.json';
import enBlog from '../content/locales/en/blog.json';
import enHome from '../content/locales/en/home.json';
import enProjects from '../content/locales/en/projects.json';
import enSkills from '../content/locales/en/skills.json';
import enUi from '../content/locales/en/ui.json';
import plAbout from '../content/locales/pl/about.json';
import plBlog from '../content/locales/pl/blog.json';
import plHome from '../content/locales/pl/home.json';
import plProjects from '../content/locales/pl/projects.json';
import plSkills from '../content/locales/pl/skills.json';
import plUi from '../content/locales/pl/ui.json';

const localizedContent = {
  en: { about: enAbout, blog: enBlog, home: enHome, projects: enProjects, skills: enSkills, ui: enUi },
  pl: { about: plAbout, blog: plBlog, home: plHome, projects: plProjects, skills: plSkills, ui: plUi },
} as const;

describe.each(Object.entries(localizedContent))('%s locale content', (_locale, content) => {
  it.each(Object.entries(localeContentSchemas))('matches the exact %s schema', (page, schema) => {
    const errors = validateContent(content[page as keyof typeof content], schema);

    expect(errors, errors.join('\n')).toEqual([]);
  });

});

function validateContent(value: unknown, schema: ContentSchema, path = '$'): string[] {
  if (schema.type === 'string') {
    if (typeof value !== 'string') {
      return [`${path}: expected string`];
    }

    const errors: string[] = [];

    if (schema.values && !schema.values.includes(value)) {
      errors.push(`${path}: expected one of ${schema.values.join(', ')}`);
    }

    if (schema.format === 'url' && !isUrl(value)) {
      errors.push(`${path}: expected an absolute URL`);
    }

    if (value !== '') {
      for (const placeholder of schema.placeholders ?? []) {
        if (!value.includes(`{${placeholder}}`)) {
          errors.push(`${path}: expected {${placeholder}} placeholder`);
        }
      }
    }

    return errors;
  }

  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      return [`${path}: expected array`];
    }

    const errors = value.flatMap((item, index) => validateContent(item, schema.items, `${path}[${index}]`));

    if (schema.sequentialIndexes) {
      value.forEach((item, index) => {
        const expectedIndex = String(index + 1).padStart(2, '0');

        if (!isRecord(item) || item.index !== expectedIndex) {
          errors.push(`${path}[${index}].index: expected ${expectedIndex}`);
        }
      });
    }

    for (const key of schema.uniqueBy ?? []) {
      const seen = new Set<unknown>();

      value.forEach((item, index) => {
        const fieldValue = isRecord(item) ? item[key] : undefined;

        if (seen.has(fieldValue)) {
          errors.push(`${path}[${index}].${key}: expected a unique value`);
        }

        seen.add(fieldValue);
      });
    }

    return errors;
  }

  if (!isRecord(value)) {
    return [`${path}: expected object`];
  }

  const errors: string[] = [];
  const expectedKeys = Object.keys(schema.properties);
  const optionalKeys = new Set(schema.optional ?? []);

  for (const key of expectedKeys) {
    if (!(key in value)) {
      if (!optionalKeys.has(key)) {
        errors.push(`${path}.${key}: missing required field`);
      }
      continue;
    }

    errors.push(...validateContent(value[key], schema.properties[key]!, `${path}.${key}`));
  }

  for (const key of Object.keys(value)) {
    if (!(key in schema.properties)) {
      errors.push(`${path}.${key}: unexpected field`);
    }
  }

  for (const [leftKey, rightKey] of schema.equalLength ?? []) {
    const left = value[leftKey];
    const right = value[rightKey];

    if (Array.isArray(left) && Array.isArray(right) && left.length !== right.length) {
      errors.push(`${path}.${leftKey}: expected the same number of items as ${rightKey}`);
    }
  }

  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isUrl(value: string): boolean {
  try {
    return Boolean(new URL(value).protocol);
  } catch {
    return false;
  }
}
