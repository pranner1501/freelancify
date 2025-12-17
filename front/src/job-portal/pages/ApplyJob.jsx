import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { uploadResumeToCloudinary } from '../../utils/uploadResume.js';

function ApplyJob() {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const API_BASE =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

    async function handleSubmit(e) {
        e.preventDefault();

        if (!resumeFile) {
            setError('Please upload your resume (PDF).');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            /* 1️⃣ Upload PDF directly to Cloudinary */
            const { url: resumeUrl } =
                await uploadResumeToCloudinary(resumeFile);

            setUploading(false);
            setSubmitting(true);

            /* 2️⃣ Send only URL + cover letter to backend */
            const res = await fetch(
                `${API_BASE}/api/jobs/${jobId}/apply`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        jobId,
                        coverLetter,
                        resumeUrl,
                    }),
                }
            );


            let data = {};
            try {
                data = await res.json();
            } catch {
                // response had no JSON (404 HTML, etc.)
            }

            if (!res.ok) {
                throw new Error(data.message || 'Failed to apply');
            }

            navigate('/jobs-portal/applications');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Application failed.');
            setUploading(false);
            setSubmitting(false);
        }
    }

    /* ───────── Guards ───────── */

    if (!user) {
        return (
            <section className="page">
                <h1>Apply for job</h1>
                <p>You must be logged in to apply.</p>
                <Link to="/login" className="btn btn-primary">
                    Log in
                </Link>
            </section>
        );
    }

    if (user.role === 'client') {
        return (
            <section className="page">
                <h1>Apply for job</h1>
                <p>Employer accounts cannot apply for jobs.</p>
                <Link to="/jobs-portal" className="btn btn-primary">
                    Browse jobs
                </Link>
            </section>
        );
    }

    /* ───────── Main Render ───────── */

    return (
        <section className="page">
            <div className="form-main">
                <header className="page-header">
                    <h1>Apply for this job</h1>
                    <p>
                        Upload your resume and submit a cover letter.
                    </p>
                </header>

                <form className="form-card" onSubmit={handleSubmit}>
                    <label className="form-field">
                        <span>Cover letter</span>
                        <textarea
                            rows="6"
                            required
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Explain why you are a good fit for this role..."
                        />
                    </label>

                    <label className="form-field">
                        <span>Resume (PDF only)</span>
                        <input
                            type="file"
                            accept="application/pdf"
                            required
                            onChange={(e) => setResumeFile(e.target.files[0])}
                        />
                    </label>

                    {uploading && (
                        <p style={{ fontSize: '0.85rem' }}>
                            Uploading resume…
                        </p>
                    )}

                    {error && (
                        <p style={{ color: 'red', fontSize: '0.9rem' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={uploading || submitting}
                    >
                        {uploading
                            ? 'Uploading resume…'
                            : submitting
                                ? 'Submitting application…'
                                : 'Submit application'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default ApplyJob;
