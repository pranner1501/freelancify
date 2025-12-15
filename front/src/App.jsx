import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

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

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<BrowseProjects />} />
          <Route path="/projects/new" element={<PostProject />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/projects/:projectId/apply" element={<ApplyToProject />} />
          <Route path="/projects/:projectId/manage" element={<ProjectProposals />} />
          <Route path="/projects/:projectId/proposals/:proposalId" element={<ProposalDetails />} />
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
