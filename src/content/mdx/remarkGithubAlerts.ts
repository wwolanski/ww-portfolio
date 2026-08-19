import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

const alertTypes = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'] as const;

type AlertType = (typeof alertTypes)[number];

function isAlertType(value: string): value is AlertType {
  return alertTypes.includes(value as AlertType);
}

export function remarkGithubAlerts() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node) => {
      const blockquote = node;
      const firstChild = blockquote.children[0];

      if (!firstChild || firstChild.type !== 'paragraph') {
        return;
      }

      const firstInline = firstChild.children[0];

      if (!firstInline || firstInline.type !== 'text') {
        return;
      }

      const match = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:[ \t]*\r?\n|[ \t]*$)/.exec(firstInline.value);

      const alertType = match?.[1];

      if (!alertType || !isAlertType(alertType)) {
        return;
      }

      firstInline.value = firstInline.value.slice(match[0].length);

      if (!firstInline.value) {
        firstChild.children.shift();
      }

      if (firstChild.children.length === 0) {
        blockquote.children.shift();
      }

      const blockquoteWithProperties = blockquote as unknown as {
        data?: { hProperties?: Record<string, string> };
      };

      blockquoteWithProperties.data = {
        ...blockquoteWithProperties.data,
        hProperties: {
          ...blockquoteWithProperties.data?.hProperties,
          'data-alert-type': alertType.toLowerCase(),
        },
      };
    });
  };
}
