import { Outlet } from 'react-router-dom';
import JobNavbar from '../job-portal/components/JobNavbar.jsx';
import JobFooter from '../job-portal/components/JobFooter.jsx';

export default function JobPortalLayout() {
  return (
    <div className="app-root">
      <JobNavbar />
      <main className="app-main">
        <Outlet />
      </main>
      <JobFooter />
    </div>
  );
}
