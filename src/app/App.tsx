import { Navigate, Route, Routes, useLocation } from 'react-router';

import { ScrollToTop } from '../components/layout/ScrollToTop';
import { AboutPage } from '../pages/about/AboutPage';
import { BlogPage } from '../pages/blog/BlogPage';
import { HomePage } from '../pages/home/HomePage';
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { SkillsPage } from '../pages/skills/SkillsPage';

export function App() {
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <ScrollToTop />
      <div key={location.pathname} className="route-enter">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
