import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import BrowseJobs from './pages/BrowseJobs.jsx';
import BrowseFreelancers from './pages/BrowseFreelancers.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import JobDetails from './pages/JobDetails.jsx';
import FreelancerProfile from './pages/FreelancerProfile.jsx';
import Messages from './pages/Messages.jsx';
import ApplyToJob from './pages/ApplyToJob.jsx';
import PostJob from './pages/PostJob.jsx';
import FreelancerProfileSetup from './pages/FreelancerProfileSetup.jsx';
import JobProposals from './pages/JobProposals.jsx';
import ProposalDetails from './pages/ProposalDetails.jsx';

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/new" element={<PostJob />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/jobs/:jobId/apply" element={<ApplyToJob />} />
          <Route path="/jobs/:jobId/manage" element={<JobProposals />} />
          <Route path="/jobs/:jobId/proposals/:proposalId" element={<ProposalDetails />} />
          <Route path="/freelancers" element={<BrowseFreelancers />} />
          <Route
            path="/freelancers/:freelancerId"
            element={<FreelancerProfile />}
          />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:threadId" element={<Messages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/freelancer/setup" element={<FreelancerProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
