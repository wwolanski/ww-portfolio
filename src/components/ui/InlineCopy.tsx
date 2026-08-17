import type { CopyBlock } from '../../content/types';

type InlineCopyProps = {
  readonly copy: CopyBlock;
};

export function InlineCopy({ copy }: InlineCopyProps) {
  return (
    <>
      {copy.before}
      {copy.emphasis && <strong>{copy.emphasis}</strong>}
      {copy.after}
    </>
  );
}
