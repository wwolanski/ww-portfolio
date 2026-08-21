import { renderInlineMarkdown } from './inlineMarkdown';

type InlineCopyProps = {
  readonly copy: string;
};

export function InlineCopy({ copy }: InlineCopyProps) {
  return <>{renderInlineMarkdown(copy)}</>;
}
