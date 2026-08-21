import { Link } from 'react-router';

import { InlineCopy } from './InlineCopy';
import type { CallToAction, StatementContent } from '../../content/types';
import type { SiteContent } from '../../content/siteContent';
import { getLocalizedPath } from '../../routing/locale';

export function Statement({ content }: { readonly content: StatementContent }) {
  return (
    <section className="statement">
      <div className="statement-kicker"><i className="statement-kicker__dot" /> <InlineCopy copy={content.kicker} /></div>
      <h2><InlineCopy copy={content.title} /></h2>
      <p><InlineCopy copy={content.text} /></p>
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
      <div className="footer-cta__box">
        <div><small><InlineCopy copy={content.eyebrow} /></small><h2><InlineCopy copy={content.title} /></h2></div>
        <Link className="footer-cta__link" to={getLocalizedPath(site.locale, `/${content.target}`)}><InlineCopy copy={content.label} /></Link>
      </div>
    </section>
  );
}
