import { useEffect, useState } from 'react';
import { tasksApi } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

const PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [taskInput, setTaskInput] = useState('');
  const [search, setSearch] = useState('');           // what's typed, shown immediately
  const [debouncedSearch, setDebouncedSearch] = useState(''); // what's actually sent to the API
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const [busyId, setBusyId] = useState(null);
  const [adding, setAdding] = useState(false);

  // Debounce the search box so we're not firing a request on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // any new search starts back at page 1
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Search/filter/pagination now happen server-side, matching /api/tasks
  const load = async (opts = {}) => {
    const params = {
      page: opts.page ?? page,
      limit: opts.limit ?? limit,
      search: opts.search ?? debouncedSearch,
      status: opts.status ?? filter,
    };
    setLoading(true);
    setError(null);
    try {
      const res = await tasksApi.list(params);
      setTasks(res.data);
      setStats(res.stats);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, filter]);

  const handleAddTask = async () => {
    const value = taskInput.trim();
    if (!value) {
      alert('Task cannot be empty!');
      return;
    }
    setAdding(true);
    try {
      await tasksApi.create({ name: value });
      setTaskInput('');
      // A new task belongs at the top of an unfiltered, first-page view —
      // jump there so the user actually sees what they just added.
      if (page !== 1 || filter !== 'all' || debouncedSearch) {
        setPage(1);
        setFilter('all');
        setSearch('');
        setDebouncedSearch('');
      } else {
        await load({ page: 1 });
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id) => {
    setBusyId(id);
    try {
      await tasksApi.toggle(id);
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await tasksApi.remove(id);
      if (editingId === id) setEditingId(null);
      // If that was the last task on a page beyond page 1, step back a page
      const isLastItemOnPage = tasks.length === 1 && page > 1;
      const nextPage = isLastItemOnPage ? page - 1 : page;
      setPage(nextPage);
      await load({ page: nextPage });
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditValue(task.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async (id) => {
    const value = editValue.trim();
    if (!value) {
      alert('Task cannot be empty!');
      return;
    }
    setBusyId(id);
    try {
      await tasksApi.update(id, { name: value });
      setEditingId(null);
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleClearCompleted = async () => {
    if (!stats.completed) return;
    if (!confirm('Remove all completed tasks?')) return;
    try {
      await tasksApi.clearCompleted();
      setPage(1);
      await load({ page: 1 });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <main id="main-content">
      <section className="page-header" aria-label="Task Manager Dashboard introduction">
        <div className="blob blob-1" aria-hidden="true"></div>
        <div className="blob blob-3" aria-hidden="true"></div>
        <span className="crumb"><i className="fa-solid fa-list-check" aria-hidden="true"></i> Full-Stack CRUD Demo</span>
        <h1>Task Manager <span>Dashboard</span></h1>
        <p>Add, edit, complete, search, and filter tasks — everything is saved to MongoDB via our Express API, so your list is there on any device.</p>
      </section>

      <section className="dashboard-page" aria-labelledby="dashboard-title">
        <div className="dashboard-inner">
          <h2 className="section-title" id="dashboard-title" style={{ position: 'absolute', left: '-9999px' }}>Task manager</h2>

          <div className="dashboard-panel">

            <div className="task-stats" role="list" aria-label="Task counts">
              <div className="task-stat" role="listitem"><strong id="task-count-total">{stats.total}</strong><span>Total</span></div>
              <div className="task-stat" role="listitem"><strong id="task-count-pending">{stats.pending}</strong><span>Pending</span></div>
              <div className="task-stat" role="listitem"><strong id="task-count-done">{stats.completed}</strong><span>Completed</span></div>
            </div>

            <div className="task-add-row">
              <input
                type="text"
                id="taskInput"
                placeholder='Enter a task, e.g. "Finish assignment"'
                aria-label="New task name"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTask(); } }}
                disabled={adding}
              />
              <button type="button" id="addTaskBtn" onClick={handleAddTask} disabled={adding}>
                <i className="fa-solid fa-plus" aria-hidden="true"></i>&nbsp; {adding ? 'Adding…' : 'Add Task'}
              </button>
            </div>

            <div className="task-controls-row">
              <div className="search-wrap">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <input
                  type="text"
                  id="searchBox"
                  placeholder="Search tasks…"
                  aria-label="Search tasks"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                id="filterSelect"
                aria-label="Filter tasks by status"
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              >
                <option value="all">All tasks</option>
                <option value="pending">Pending only</option>
                <option value="completed">Completed only</option>
              </select>
              <select
                className="per-page-select"
                value={limit}
                onChange={handleLimitChange}
                aria-label="Tasks per page"
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} per page</option>
                ))}
              </select>
            </div>

            {loading && <p className="task-empty">Loading tasks…</p>}
            {error && <p className="task-empty status-error">✗ Could not load tasks: {error}</p>}

            {!loading && !error && tasks.length === 0 && (
              <p className="task-empty" id="task-empty">
                {stats.total === 0 ? 'No tasks yet — add your first one above.' : 'No tasks match your search or filter.'}
              </p>
            )}

            {!loading && !error && tasks.length > 0 && (
              <>
                <ul className="task-list" id="taskList" aria-label="Task list">
                  {tasks.map((t) => (
                    <li className={`task-item${t.completed ? ' completed' : ''}`} key={t._id}>
                      {editingId === t._id ? (
                        <>
                          <input
                            type="text"
                            className="task-edit-input"
                            value={editValue}
                            aria-label="Edit task name"
                            autoFocus
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') { e.preventDefault(); saveEdit(t._id); }
                              if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
                            }}
                          />
                          <div className="task-actions">
                            <button type="button" className="task-btn task-btn-save" title="Save" onClick={() => saveEdit(t._id)} disabled={busyId === t._id}>
                              <i className="fa-solid fa-check" aria-hidden="true"></i>
                            </button>
                            <button type="button" className="task-btn task-btn-cancel" title="Cancel" onClick={cancelEdit}>
                              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <label className="task-checkbox">
                            <input
                              type="checkbox"
                              checked={t.completed}
                              disabled={busyId === t._id}
                              aria-label={`Mark '${t.name}' as ${t.completed ? 'pending' : 'completed'}`}
                              onChange={() => handleToggle(t._id)}
                            />
                            <span className="task-checkmark" aria-hidden="true"></span>
                          </label>
                          <span className="task-text">{t.name}</span>
                          <div className="task-actions">
                            <button type="button" className="task-btn" title="Edit task" onClick={() => startEdit(t)} disabled={busyId === t._id}>
                              <i className="fa-solid fa-pen" aria-hidden="true"></i>
                            </button>
                            <button type="button" className="task-btn task-btn-delete" title="Delete task" onClick={() => handleDelete(t._id)} disabled={busyId === t._id}>
                              <i className="fa-solid fa-trash" aria-hidden="true"></i>
                            </button>
                          </div>
                        </>
                      )}
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
                      Page {pagination.page} of {pagination.totalPages} — {pagination.totalItems} matching task(s)
                    </p>
                  </>
                )}
              </>
            )}

            <div className="task-footer-row">
              <span className="hint">Tip: press Enter to add a task, or edit inline with the pencil icon.</span>
              <button type="button" className="btn-danger" id="clearCompletedBtn" onClick={handleClearCompleted}>
                <i className="fa-solid fa-broom" aria-hidden="true"></i> Clear completed
              </button>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
