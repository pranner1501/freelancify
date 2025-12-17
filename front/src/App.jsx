import React from 'react';
import { Routes, Route } from 'react-router-dom';

/* layouts */
import FreelancifyLayout from './layouts/FreelancifyLayout.jsx';
import JobPortalLayout from './layouts/JobPortalLayout.jsx';

/* freelancify pages */
import Home from './pages/Home.jsx';
import BrowseProjects from './pages/BrowseProjects.jsx';
import BrowseFreelancers from './pages/BrowseFreelancers.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import FreelancerProfile from './pages/FreelancerProfile.jsx';
import Messages from './pages/Messages.jsx';
import ApplyToProject from './pages/ApplyToProject.jsx';
import PostProject from './pages/PostProject.jsx';
import FreelancerProfileSetup from './pages/FreelancerProfileSetup.jsx';
import ProjectProposals from './pages/ProjectProposals.jsx';
import ProposalDetails from './pages/ProposalDetails.jsx';

/* job portal pages */
import JobSearch from './job-portal/pages/JobSearch.jsx';
import JobDetails from './job-portal/pages/JobDetails.jsx';
import ApplyJob from './job-portal/pages/ApplyJob.jsx';
import MyApplications from './job-portal/pages/MyApplications.jsx';
import PostJob from './job-portal/pages/PostJob.jsx';
import PostedJobs from './job-portal/pages/PostedJobs.jsx';
import JobApplicants from './job-portal/pages/JobApplicants.jsx';
import JobDashboard from './job-portal/pages/JobDashboard.jsx';

function App() {
  return (
    <Routes>

      {/* 🔵 FREELANCIFY MARKETPLACE */}
      <Route element={<FreelancifyLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/projects" element={<BrowseProjects />} />
        <Route path="/projects/new" element={<PostProject />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/projects/:projectId/apply" element={<ApplyToProject />} />
        <Route path="/projects/:projectId/manage" element={<ProjectProposals />} />
        <Route
          path="/projects/:projectId/proposals/:proposalId"
          element={<ProposalDetails />}
        />

        <Route path="/freelancers" element={<BrowseFreelancers />} />
        <Route
          path="/freelancers/:freelancerId"
          element={<FreelancerProfile />}
        />

        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:threadId" element={<Messages />} />

        <Route path="/freelancer/setup" element={<FreelancerProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* 🟢 JOB PORTAL */}
      <Route path="/jobs-portal" element={<JobPortalLayout />}>
        <Route index element={<JobDashboard/>} />
        <Route path="search" element={<JobSearch />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="jobs/:id/apply" element={<ApplyJob />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="post" element={<PostJob />} />
        <Route path="posted" element={<PostedJobs />} />
        <Route path="employer/jobs/:jobId"  element={<JobApplicants />}/>
        <Route path='dashboard'  element={<JobDashboard/>}></Route>
        {/* <Route path="messages" element={<Messages />} /> */}
      </Route>

      {/* 🔐 AUTH (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ❌ NOT FOUND */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;
