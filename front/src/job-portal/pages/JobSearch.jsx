import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard.jsx';
import JobFilters from '../components/JobFilters.jsx';
import { apiGet } from '../../api/client.js';

export default function JobSearch() {
    const [filters, setFilters] = useState({
        q: '',
        location: '',
        type: '',
    });

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    async function search() {
        setLoading(true);
        const params = new URLSearchParams(filters).toString();
        const data = await apiGet(`/jobs/search?${params}`);
        setJobs(data.jobs || []);
        setLoading(false);
    }

    useEffect(() => {
        search();
    }, []);

    return (
        <section>
            <h1>Search Jobs</h1>

            <div className="projects-layout">
                <JobFilters
                    filters={filters}
                    setFilters={setFilters}
                    onSearch={search}
                />

                <div className="jobs-list">
                    {loading && <p>Loading jobs…</p>}

                    {!loading && jobs.length === 0 && (
                        <p>No jobs found.</p>
                    )}

                    {jobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </div>
        </section>
    );
}
