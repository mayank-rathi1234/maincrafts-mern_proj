/**
 * Simple Prev / page-number / Next pagination control.
 * Purely presentational — the parent owns the current page state
 * and re-fetches data when `onPageChange` fires.
 */
export default function Pagination({ page, totalPages, hasPrevPage, hasNextPage, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build a compact page list: always show first, last, current, and
  // a couple of neighbors, collapsing long runs into "…".
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span className="pagination-ellipsis" key={`ellipsis-${i}`} aria-hidden="true">…</span>
        ) : (
          <button
            type="button"
            key={p}
            className={`pagination-btn${p === page ? ' active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
    </nav>
  );
}
