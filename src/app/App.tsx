import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';

import { ScrollToTop } from '../components/layout/ScrollToTop';
import { getSiteContent } from '../content/siteContent';
import { AboutPage } from '../pages/about/AboutPage';
import { BlogPage } from '../pages/blog/BlogPage';
import { HomePage } from '../pages/home/HomePage';
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { SkillsPage } from '../pages/skills/SkillsPage';
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
        <Route path="about" element={<AboutPage site={site} />} />
        <Route path="projects" element={<ProjectsPage site={site} />} />
        <Route path="skills" element={<SkillsPage site={site} />} />
        <Route path="blog" element={<BlogPage site={site} />} />
        <Route path="*" element={<Navigate to={`/${localeParam}`} replace />} />
      </Routes>
    </>
  );
}

export function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <div key={location.pathname} className="route-enter">
        <Routes>
          <Route path="/" element={<Navigate to={`/${defaultLocale}`} replace />} />
          <Route path="/:locale/*" element={<LocalizedRoutes />} />
          <Route path="*" element={<Navigate to={`/${defaultLocale}`} replace />} />
        </Routes>
      </div>
    </>
  );
}
