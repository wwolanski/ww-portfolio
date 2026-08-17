import { Link } from 'react-router';

import type { CallToAction, StatementContent } from '../../content/types';
import type { SiteContent } from '../../content/siteContent';
import { getLocalizedPath } from '../../routing/locale';

export function Statement({ content }: { readonly content: StatementContent }) {
  return (
    <section className="statement">
      <div className="statement-kicker"><i className="dot" /> {content.kicker}</div>
      <h2>{content.title}</h2>
      <p>{content.text}</p>
    </section>
  );
}

type FooterCtaProps = {
  readonly site: SiteContent;
  readonly content: CallToAction;
};

export function FooterCta({ site, content }: FooterCtaProps) {
  return (
    <section className="footer-cta">
      <div className="box">
        <div><small>{content.eyebrow}</small><h2>{content.title}</h2></div>
        <Link className="cta" to={getLocalizedPath(site.locale, `/${content.target}`)}>{content.label}</Link>
      </div>
    </section>
  );
}
