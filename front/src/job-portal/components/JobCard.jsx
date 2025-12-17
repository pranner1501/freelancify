import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <article className="project-card">
      <h3>{job.title}</h3>

      <p className="job-meta">
        {job.organisation} · {job.location}
      </p>

      <p className="job-meta">
        {job.type} · {job.level}
      </p>

      <p className="job-meta">
        Salary: ₹{job.salary}
      </p>

      <Link
        to={`/jobs-portal/jobs/${job.id}`}
        className="btn btn-ghost-sm"
      >
        View details
      </Link>
    </article>
  );
}
