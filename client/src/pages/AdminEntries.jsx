import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AdminNavbar from "../Components/admin/AdminNav";
import AdminSidebar from "../Components/admin/AdminSidebar";
import PageTransition from "../Components/PageTransition";
import LoadingScreen from "../Components/LoadingScreen";
import {
  Search,
  Eye,
  Trash2,
  Globe,
  Lock,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ENTRIES_PER_PAGE = 10;

export default function AdminEntries() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries(value = "") {
    try {
      const { data } = await api.get(`/admin/entries?search=${value}`);
      setEntries(data.entries);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  }

  async function deleteEntry(id) {
    try {
      await api.delete(`/entries/${id}`);
      toast.success("Entry deleted");
      setConfirmId(null);
      loadEntries(search);
    } catch {
      toast.error("Delete failed");
    }
  }

  const totalPages = Math.ceil(entries.length / ENTRIES_PER_PAGE);
  const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
  const paginatedEntries = entries.slice(
    startIndex,
    startIndex + ENTRIES_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <PageTransition>
      <div className="drawer lg:drawer-open bg-base-200">
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col">
          <AdminNavbar />

          <main className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Entries ({entries.length})
            </h1>
            <p className="text-sm text-base-content/60 mb-6">
              Browse and moderate all journal entries.
            </p>

            <div className="relative max-w-sm mb-6">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
              />
              <input
                type="text"
                placeholder="Search title..."
                className="input input-bordered bg-base-100 w-full pl-9 focus:border-primary"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  loadEntries(e.target.value);
                }}
              />
            </div>

            {loading ? (
              <LoadingScreen />
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="text-primary/30 mb-3" size={48} />
                <p className="text-base-content/60">No entries found.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto bg-base-100 rounded-2xl">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Visibility</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedEntries.map((entry) => (
                        <tr key={entry._id}>
                          <td className="font-medium text-base-content">
                            {entry.isPublic ? entry.title : "Private entry"}
                          </td>
                          <td className="text-base-content/70">
                            {entry.author?.username}
                          </td>
                          <td>
                            <span
                              className={`badge badge-sm gap-1 ${entry.isPublic ? "bg-primary/20 text-primary" : "badge-ghost"}`}
                            >
                              {entry.isPublic ? (
                                <Globe size={11} />
                              ) : (
                                <Lock size={11} />
                              )}
                              {entry.isPublic ? "Public" : "Private"}
                            </span>
                          </td>
                          <td className="text-base-content/60">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {entry.isPublic ? (
                                <Link
                                  to={`/entries/${entry._id}`}
                                  className="btn btn-outline btn-primary btn-sm gap-1"
                                >
                                  <Eye size={14} />
                                  View
                                </Link>
                              ) : (
                                <span className="text-xs text-base-content/50">
                                  Restricted
                                </span>
                              )}
                              {entry.isPublic && (
                                <button
                                  className="btn btn-error btn-outline btn-sm gap-1"
                                  onClick={() => setConfirmId(entry._id)}
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {paginatedEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="bg-base-100 border border-base-300 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-base-content leading-snug">
                          {entry.isPublic ? entry.title : "Private entry"}
                        </h3>
                        <span
                          className={`badge badge-sm gap-1 shrink-0 ${entry.isPublic ? "bg-primary/20 text-primary" : "badge-ghost"}`}
                        >
                          {entry.isPublic ? (
                            <Globe size={11} />
                          ) : (
                            <Lock size={11} />
                          )}
                          {entry.isPublic ? "Public" : "Private"}
                        </span>
                      </div>

                      <p className="text-xs text-base-content/60 mb-3">
                        by {entry.author?.username} ·{" "}
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex gap-2">
                        {entry.isPublic ? (
                          <>
                            <Link
                              to={`/entries/${entry._id}`}
                              className="btn btn-outline btn-primary btn-sm flex-1 gap-1"
                            >
                              <Eye size={14} />
                              View
                            </Link>
                            <button
                              className="btn btn-error btn-outline btn-sm flex-1 gap-1"
                              onClick={() => setConfirmId(entry._id)}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-base-content/50">
                            Restricted
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn btn-sm btn-ghost disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span className="text-sm text-base-content/70">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn btn-sm btn-ghost disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        <AdminSidebar />
      </div>

      {/* Delete confirmation modal */}
      {confirmId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmId(null)}
        >
          <div
            className="bg-base-100 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-base-content">
                Delete entry?
              </h3>
              <button
                onClick={() => setConfirmId(null)}
                className="text-base-content/40 hover:text-base-content"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-base-content/60 mb-6">
              This action can't be undone. The entry and its comments will be
              permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteEntry(confirmId)}
                className="btn btn-error flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
