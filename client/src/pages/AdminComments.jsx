import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import AdminNavbar from "../Components/admin/AdminNav";
import AdminSidebar from "../Components/admin/AdminSidebar";
import PageTransition from "../Components/PageTransition";
import LoadingScreen from "../Components/LoadingScreen";
import { Search, Trash2, MessageCircle, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

const COMMENTS_PER_PAGE = 10;

const CommentText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 100;
  const shown = expanded || !isLong ? text : text.slice(0, 100) + "...";

  return (
    <div>
      <p className="text-base-content/80">{shown}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-primary hover:underline mt-1"
        >
          {expanded ? (
            <>Show less <ChevronUp size={12} /></>
          ) : (
            <>Show more <ChevronDown size={12} /></>
          )}
        </button>
      )}
    </div>
  );
};

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmComment, setConfirmComment] = useState(null); // { commentId, entryId }
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments(value = "") {
    try {
      const { data } = await api.get(`/admin/comments?search=${value}`);
      setComments(data.comments);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment() {
    if (!confirmComment) return;
    setDeleting(true);
    try {
      await api.delete(`/entries/${confirmComment.entryId}/comments/${confirmComment.commentId}`);
      toast.success("Comment deleted");
      setConfirmComment(null);
      loadComments(search);
    } catch (err) {
      console.log('DELETE ERROR:', err.response?.data);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const paginatedComments = comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

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
              Comments ({comments.length})
            </h1>
            <p className="text-sm text-base-content/60 mb-6">
              Moderate comments across all entries.
            </p>

            <div className="relative max-w-sm mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                className="input input-bordered bg-base-100 w-full pl-9 focus:border-primary"
                placeholder="Search comments..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  loadComments(e.target.value);
                }}
              />
            </div>

            {loading ? (
              <LoadingScreen />
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MessageCircle className="text-primary/30 mb-3" size={48} />
                <p className="text-base-content/60">No comments found.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto bg-base-100 rounded-2xl">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="w-1/2">Comment</th>
                        <th>Entry</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedComments.map((comment) => (
                        <tr key={comment._id}>
                          <td className="align-top py-3">
                            <CommentText text={comment.text} />
                          </td>
                          <td className="text-base-content/70">
                            {comment.entry?.title || (
                              <span className="text-base-content/30 italic">Unknown</span>
                            )}
                          </td>
                          <td className="text-base-content/70">{comment.author?.username}</td>
                          <td className="text-base-content/60">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="btn btn-error btn-outline btn-sm gap-1 disabled:opacity-30"
                              disabled={!comment.entry?._id}
                              onClick={() => setConfirmComment({ commentId: comment._id, entryId: comment.entry?._id })}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {paginatedComments.map((comment) => (
                    <div key={comment._id} className="bg-base-100 border border-base-300 rounded-xl p-4">
                      <CommentText text={comment.text} />

                      <p className="text-xs text-base-content/40 mt-2">
                        On: {comment.entry?.title || "Unknown entry"}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
                        <p className="text-xs text-base-content/50">
                          {comment.author?.username} · {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                        <button
                          className="btn btn-error btn-outline btn-sm gap-1 disabled:opacity-30"
                          disabled={!comment.entry?._id}
                          onClick={() => setConfirmComment({ commentId: comment._id, entryId: comment.entry?._id })}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
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
      {confirmComment && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => !deleting && setConfirmComment(null)}
        >
          <div
            className="bg-base-100 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-base-content">Delete comment?</h3>
              <button onClick={() => setConfirmComment(null)} disabled={deleting} className="text-base-content/40 hover:text-base-content">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-base-content/60 mb-6">
              This action can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmComment(null)}
                disabled={deleting}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={deleteComment}
                disabled={deleting}
                className="btn btn-error flex-1"
              >
                {deleting ? <span className="loading loading-spinner loading-sm"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}