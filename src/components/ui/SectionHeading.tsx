type SectionHeadingProps = {
  readonly index: string;
  readonly title: string;
  readonly text?: string;
};

export function SectionHeading({ index, title, text }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <span>{index}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </header>
  );
}
