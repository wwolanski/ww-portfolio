import type { Locale } from '../routing/locale';
import { getNavigationItems, type NavigationItem } from './navigation';
import { messages, type Messages } from './messages';
import { portfolioContent, type PortfolioContent } from './portfolio';

export type SiteContent = {
  readonly locale: Locale;
  readonly messages: Messages;
  readonly navigation: readonly NavigationItem[];
  readonly portfolio: PortfolioContent;
};

export function getSiteContent(locale: Locale): SiteContent {
  const localizedMessages = messages[locale];

  return {
    locale,
    messages: localizedMessages,
    navigation: getNavigationItems(localizedMessages, locale),
    portfolio: portfolioContent[locale],
  };
}
