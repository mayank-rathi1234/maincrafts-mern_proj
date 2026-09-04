import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactsApi } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

const PER_PAGE_OPTIONS = [6, 12, 24, 48];

function initials(name) {
  return name?.charAt(0).toUpperCase() || '?';
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async (targetPage = page, targetLimit = limit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await contactsApi.list({ page: targetPage, limit: targetLimit });
      setSubmissions(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the page or page size changes
  useEffect(() => {
    load(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleDelete = async (id, name) => {
    setBusyId(id);
    try {
      await contactsApi.remove(id);
      // If this was the last item on a page beyond page 1, step back a page;
      // otherwise just reload the current page so the list stays accurate.
      const isLastItemOnPage = submissions.length === 1 && page > 1;
      const nextPage = isLastItemOnPage ? page - 1 : page;
      setPage(nextPage);
      await load(nextPage, limit);
    } catch (err) {
      alert(`Could not delete submission from ${name}: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Delete all saved submissions? This cannot be undone.')) return;
    try {
      await contactsApi.clearAll();
      setPage(1);
      await load(1, limit);
    } catch (err) {
      alert(`Could not clear submissions: ${err.message}`);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // changing page size always resets to page 1
  };

  const totalItems = pagination?.totalItems ?? submissions.length;

  return (
    <main id="main-content">
      <section className="page-header" aria-label="Submissions page introduction">
        <div className="blob blob-1" aria-hidden="true"></div>
        <div className="blob blob-2" aria-hidden="true"></div>
        <span className="crumb"><i className="fa-solid fa-inbox" aria-hidden="true"></i> Saved to the database</span>
        <h1>Your <span>submissions</span></h1>
        <p>Every message sent through the contact form is saved to MongoDB via our Express API.</p>
      </section>

      <section className="submissions-page" aria-labelledby="submissions-title">
        <div className="submissions-inner">
          <h2 className="section-title" id="submissions-title" style={{ position: 'absolute', left: '-9999px' }}>All submissions</h2>

          <div className="submissions-toolbar">
            <p className="submissions-count"><strong id="submissions-count">{totalItems}</strong> submission(s) saved in the database</p>
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
              {totalItems > 0 && (
                <select
                  className="per-page-select"
                  value={limit}
                  onChange={handleLimitChange}
                  aria-label="Submissions per page"
                >
                  {PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} per page</option>
                  ))}
                </select>
              )}
              {totalItems > 0 && (
                <button type="button" className="btn-danger" onClick={handleClearAll}>
                  <i className="fa-solid fa-trash-can" aria-hidden="true"></i> Clear all
                </button>
              )}
            </div>
          </div>

          {loading && <p>Loading submissions…</p>}
          {error && <p className="status-error">✗ Could not load submissions: {error}</p>}

          {!loading && !error && submissions.length === 0 && (
            <div className="submissions-empty" id="submissions-empty">
              <i className="fa-regular fa-comment-dots" aria-hidden="true"></i>
              <h3>No submissions yet</h3>
              <p>Once someone fills out the contact form, their message will show up here.</p>
              <Link to="/contact" className="btn-primary" style={{ display: 'inline-flex' }}>
                <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>&nbsp; Go to Contact Form
              </Link>
            </div>
          )}

          {!loading && !error && submissions.length > 0 && (
            <>
              <ul className="submissions-grid" id="submissions-list" aria-label="Saved contact form submissions">
                {submissions.map((s) => (
                  <li className="submission-card" key={s._id}>
                    <div className="submission-head">
                      <div className="submission-avatar" aria-hidden="true">{initials(s.name)}</div>
                      <div>
                        <h4>{s.name}</h4>
                        <a href={`mailto:${s.email}`}>{s.email}</a>
                      </div>
                      <button
                        type="button"
                        className="submission-delete"
                        title="Delete this submission"
                        aria-label={`Delete submission from ${s.name}`}
                        disabled={busyId === s._id}
                        onClick={() => handleDelete(s._id, s.name)}
                      >
                        <i className="fa-solid fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                    <p className="submission-message">{s.message}</p>
                    {s.date && <span className="submission-date">{formatDate(s.date)}</span>}
                  </li>
                ))}
              </ul>

              {pagination && (
                <>
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    hasPrevPage={pagination.hasPrevPage}
                    hasNextPage={pagination.hasNextPage}
                    onPageChange={setPage}
                  />
                  <p className="pagination-info">
                    Page {pagination.page} of {pagination.totalPages} — {totalItems} total submission(s)
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
