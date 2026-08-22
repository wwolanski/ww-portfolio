import { Navigate, Route, Routes, useParams } from 'react-router';

import { DetailPageRoute } from '../components/layout/DetailPageLayout';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { getSiteContent } from '../content/siteContent';
import { AboutPageContent } from '../pages/about/AboutPage';
import { BlogPageContent } from '../pages/blog/BlogPage';
import { HomePage } from '../pages/home/HomePage';
import { ProjectsPageContent } from '../pages/projects/ProjectsPage';
import { SkillsPageContent } from '../pages/skills/SkillsPage';
import { defaultLocale, isLocale } from '../routing/locale';

function LocalizedRoutes() {
  const { locale: localeParam } = useParams<{ locale: string }>();

  if (!isLocale(localeParam)) {
    return <Navigate to={`/${defaultLocale}`} replace />;
  }

  const site = getSiteContent(localeParam);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {site.messages.common.skipToContent}
      </a>
      <Routes>
        <Route index element={<HomePage site={site} />} />
        <Route element={<DetailPageRoute site={site} />}>
          <Route path="about" element={<AboutPageContent site={site} />} />
          <Route path="projects" element={<ProjectsPageContent site={site} />} />
          <Route path="skills" element={<SkillsPageContent site={site} />} />
          <Route path="blog" element={<BlogPageContent site={site} />} />
        </Route>
        <Route path="*" element={<Navigate to={`/${localeParam}`} replace />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to={`/${defaultLocale}`} replace />} />
        <Route path="/:locale/*" element={<LocalizedRoutes />} />
        <Route path="*" element={<Navigate to={`/${defaultLocale}`} replace />} />
      </Routes>
    </>
  );
}
