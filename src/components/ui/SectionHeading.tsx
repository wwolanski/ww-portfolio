import { InlineCopy } from './InlineCopy';

type SectionHeadingProps = {
  readonly index: string;
  readonly title: string;
  readonly text?: string;
};

export function SectionHeading({ index, title, text }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <span>{index}</span>
      <h2><InlineCopy copy={title} /></h2>
      {text && <p><InlineCopy copy={text} /></p>}
    </header>
  );
}
