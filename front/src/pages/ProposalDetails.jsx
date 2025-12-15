// src/pages/ProposalDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProposal, awardProposal, startProposalThread } from '../api/proposals.js';
import { useAuth } from '../context/AuthContext.jsx';

function ProposalDetails() {
    const { proposalId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await getProposal(proposalId, token);
                setProposal(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load proposal.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [proposalId, token]);

    async function handleAward() {
        if (!window.confirm('Are you sure you want to award this project to this freelancer?')) return;
        setActionLoading(true);
        setError(null);
        try {
            const res = await awardProposal(proposalId, token);
            // res contains threadId — go to messages for further convo
            navigate(`/messages/${res.threadId}`);
        } catch (err) {
            console.error(err);
            setError('Failed to award proposal.');
        } finally {
            setActionLoading(false);
        }
    }

    async function handleStartChat() {
        setActionLoading(true);
        setError(null);
        try {
            const res = await startProposalThread(proposalId, token);
            navigate(`/messages/${res.threadId}`);
        } catch (err) {
            console.error(err);
            setError('Failed to start chat.');
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return (
            <section className="page">
                <p>Loading proposal...</p>
            </section>
        );
    }

    if (error || !proposal) {
        return (
            <section className="page">
                <h1>Proposal not found</h1>
                <p>{error || 'This proposal may have been removed.'}</p>
                <Link to="/projects" className="btn btn-primary">Back to projects</Link>
            </section>
        );
    }

    const projectStatus = proposal.project?.status || 'open';
    const alreadyAwarded = proposal.status === 'accepted' || projectStatus !== 'open';
    // Note: proposal.project.clientId may not be present in response. Backend only allowed owner to view, so UI will rely on role + available data.

    return (
        <section className="page">
            <header className="page-header">
                <h1>Proposal by {proposal.freelancer.name}</h1>
                <p className="project-details-meta">
                    {proposal.project.title} · {proposal.project.budget}
                </p>
            </header>

            <div className="details-layout">
                <div className="details-main">
                    <div className="details-card">
                        <h2>Cover letter</h2>
                        <p className="details-text">{proposal.coverLetter}</p>
                    </div>

                    <div className="details-card">
                        <h2>Proposal details</h2>
                        <p><strong>Rate:</strong> {proposal.rateType === 'hourly' ? `$${proposal.rateAmount}/hr` : `$${proposal.rateAmount}`}</p>
                        <p><strong>Availability:</strong> {proposal.availability}</p>
                        <p><strong>Status:</strong> {proposal.status}</p>
                        <p><strong>Submitted:</strong> {new Date(proposal.createdAt).toLocaleString()}</p>
                    </div>
                </div>

                <aside className="details-sidebar">
                    <div className="sidebar-card">
                        <h3>Freelancer</h3>
                        <p>{proposal.freelancer.name}</p>
                        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>View full profile to see more details.</p>
                        {/* If we had freelancer user id we could link to profile; proposal.freelancer.id may be a user id */}
                        {proposal.freelancer.id && (
                            <Link to={`/freelancers/${proposal.freelancer.id}`} className="btn btn-ghost-sm">
                                View profile
                            </Link>
                        )}
                    </div>

                    <div className="sidebar-card">
                        <h3>Actions</h3>

                        <button
                            type="button"
                            className="btn btn-primary btn-full"
                            onClick={handleAward}
                            disabled={actionLoading || alreadyAwarded}
                            title={alreadyAwarded ? 'Project already awarded or not open' : ''}
                        >
                            {actionLoading ? 'Processing...' : alreadyAwarded ? 'Project already awarded' : (user.role === 'client'? 'Award project' : 'Accept proposal')}
                        </button>

                        <button
                            type="button"
                            className="btn btn-ghost btn-full"
                            onClick={handleStartChat}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Processing...' : 'Start chat'}
                        </button>

                        {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
                    </div>

                    <div className="sidebar-backlink">
                        <Link to={user.role === 'client'?`/projects/${proposal.project.id}/manage`:'/projects'} className="btn btn-ghost btn-full">
                            ← Back to proposals
                        </Link>
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default ProposalDetails;
