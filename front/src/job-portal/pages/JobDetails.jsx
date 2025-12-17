import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function JobDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);

    useEffect(() => {
        apiGet(`/jobs/${id}`).then(setJob);
    }, [id]);

    if (!job) return <p>Loading job…</p>;

    return (
        <section>
            <h1>{job.title}</h1>

            <p className="job-meta">
                {job.organisation} · {job.location}
            </p>

            <p className="job-meta">
                {job.type} · {job.level}
            </p>

            <p className="job-meta">
                Salary: ₹{job.salary}
            </p>

            <hr />

            <p>{job.description}</p>

            <h3>Requirements</h3>
            <ul>
                {job.requirements?.technologies?.map(t => (
                    <li key={t}>{t}</li>
                ))}
            </ul>

            {user && user.role !== 'client' && (
                <Link
                    to={`/jobs-portal/jobs/${id}/apply`}
                    className="btn btn-primary"
                >
                    Apply for this job
                </Link>
            )}
        </section>
    );
}
