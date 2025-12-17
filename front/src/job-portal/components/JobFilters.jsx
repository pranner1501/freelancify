export default function JobFilters({ filters, setFilters, onSearch }) {
    function update(key, value) {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  
    return (
      <aside className="filter-panel">
        <h2>Filters</h2>
  
        <div className="filter-group">
          <label>Keyword</label>
          <input
            type="text"
            value={filters.q}
            onChange={(e) => update('q', e.target.value)}
          />
        </div>
  
        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </div>
  
        <div className="filter-group">
          <label>Job Type</label>
          <select
            value={filters.type}
            onChange={(e) => update('type', e.target.value)}
          >
            <option value="">Any</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
          </select>
        </div>
  
        <button className="btn btn-primary btn-full" onClick={onSearch}>
          Search
        </button>
      </aside>
    );
  }
  