import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import PageTransition from "../Components/PageTransition";
import TopBar from "../Components/Dashboard/navbar";
import {
  BookOpen,
  Trash2,
  Globe,
  Lock,
  SquarePen,
  Heart,
  X,
  Flag,
  ArrowLeft,
} from "lucide-react";
import SideBar from "../Components/Dashboard/sidebar";
import LoadingScreen from "../Components/LoadingScreen";
import BottomNav from "../Components/BotttomNav";

const moodEmojis = {
  Joyful: "😊",
  Grateful: "🙏",
  Peaceful: "☮️",
  Hopeful: "🌟",
  Blessed: "✨",
  Excited: "🎉",
  Content: "😌",
  Reflective: "🤔",
  Sad: "😢",
  Anxious: "😰",
  Overwhelmed: "😫",
  Angry: "😠",
  Confused: "😕",
  Tired: "😴",
  Lonely: "😔",
  Hurt: "💔",
  Disappointed: "😞",
  Fearful: "😨",
  Doubtful: "🤷",
  Broken: "💔",
};

export default function ShowPage() {
  const [entry, setEntry] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingCommentId, setSavingCommentId] = useState(null);

  const [deletingImage, setDeletingImage] = useState(null);
  const [deletingEntry, setDeletingEntry] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Main comment page -> selected comment for Replies view
  const [selectedComment, setSelectedComment] = useState(null);

  // Main comment form reply target
  const [replyingTo, setReplyingTo] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const { data } = await api.get(`/entries/${id}`);

      setEntry(data.entries);
      setCurrentUser(data.currentUser);
    } catch (err) {
      console.log(err);
      toast.error("Entry not found!");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (entry && currentUser) {
      setLiked(entry.likes.includes(currentUser._id));
      setLikeCount(entry.likes.length);
    }
  }, [entry, currentUser]);

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
        fetchData();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
}, [id]);

  // =========================
  // LIKE
  // =========================

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/entries/${id}/like`);

      setLiked(data.liked);

      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      toast.error("Failed to like entry");
    }
  };

  // =========================
  // DELETE ENTRY
  // =========================

  const handleDelete = async () => {
    if (deletingEntry) return;

    try {
      setDeletingEntry(true);

      await api.delete(`/entries/${id}`);

      toast.success("Entry deleted!");

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete entry");
    } finally {
      setDeletingEntry(false);
    }
  };

  // =========================
  // COMMENT
  // =========================

  const handleComment = async (e) => {
    e.preventDefault();

    if (postingComment) return;

    if (!comment.trim()) {
      toast.error("Please write something first.");
      return;
    }

    try {
      setPostingComment(true);

      await api.post(`/entries/${id}/comments`, {
        comment: {
          text: comment,
          parentComment: replyingTo?._id || null,
        },
      });

      toast.success(replyingTo ? "Reply added!" : "Comment added!");

      setComment("");
      setReplyingTo(null);

      await fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (replyingTo ? "Failed to add reply" : "Failed to add comment"),
      );
    } finally {
      setPostingComment(false);
    }
  };

  // =========================
  // DELETE COMMENT
  // =========================

  const handleDeleteComment = async (commentId) => {
    if (deletingCommentId) return;

    try {
      setDeletingCommentId(commentId);

      await api.delete(`/entries/${id}/comments/${commentId}`);

      toast.success("Comment deleted!");

      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  // =========================
  // EDIT COMMENT
  // =========================

  const handleEditComment = async (commentId) => {
    if (savingCommentId) return;

    if (!editText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      setSavingCommentId(commentId);

      await api.put(`/entries/${id}/comments/${commentId}`, {
        comment: {
          text: editText,
        },
      });

      toast.success("Comment updated!");

      setEditingCommentId(null);
      setEditText("");

      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    } finally {
      setSavingCommentId(null);
    }
  };

  // =========================
  // REPORT
  // =========================

  const handleReport = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.error("You must be logged in!");
      navigate("/login");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(`/entries/${entry._id}/report`, {
        reason,
      });

      toast.success(data.message);

      setShowReportModal(false);
      setReason("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE IMAGE
  // =========================

  const handleDeleteImage = async (filename) => {
    try {
      setDeletingImage(filename);

      await api.delete(`/entries/${id}/images/${encodeURIComponent(filename)}`);

      toast.success("Image deleted!");

      setEntry((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.filename !== filename),
      }));
    } catch (err) {
      toast.error("Failed to delete image");
    } finally {
      setDeletingImage(null);
    }
  };

  // =========================
  // COMMENTS DATA
  // =========================

  const comments = entry?.comment || [];

  const mainComments = comments.filter((comment) => !comment.parentComment);

  // Map parent -> direct children
  const repliesByParent = comments.reduce((groups, comment) => {
    if (comment.parentComment) {
      const parentId = comment.parentComment?._id || comment.parentComment;

      if (!groups[parentId]) {
        groups[parentId] = [];
      }

      groups[parentId].push(comment);
    }

    return groups;
  }, {});

  // Get every reply in a conversation thread
  const getThreadReplies = (mainCommentId) => {
    const result = [];

    const queue = [...(repliesByParent[mainCommentId] || [])];

    while (queue.length > 0) {
      const reply = queue.shift();

      result.push(reply);

      const children = repliesByParent[reply._id] || [];

      queue.push(...children);
    }

    return result;
  };

  // =========================
  // REPLIES VIEW
  // =========================

  const openReplies = (comment) => {
    setSelectedComment(comment);
  };

  const closeReplies = () => {
    setSelectedComment(null);
  };

  // Used by RepliesView
  const handleReplyFromRepliesView = async (targetComment, text) => {
    try {
      await api.post(`/entries/${id}/comments`, {
        comment: {
          text,
          parentComment: targetComment._id,
        },
      });

      toast.success("Reply added!");

      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add reply");

      throw err;
    }
  };

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  const formattedDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const readTime = Math.max(
    1,
    Math.ceil(entry.content.split(" ").length / 200),
  );

  const isOwner =
    currentUser &&
    entry.author &&
    entry.author._id?.toString() === currentUser._id?.toString();

  const isAdmin = currentUser?.role === "admin";

  return (
    <PageTransition>
      <SideBar currentUser={currentUser} />

      <TopBar />

      {/* =========================
          IMAGE MODAL
      ========================= */}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-base-100/20 text-base-100 rounded-full p-1 hover:bg-base-100/40 z-10"
            >
              <X size={20} />
            </button>

            <img
              src={selectedImage}
              className="w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* =========================
          MAIN PAGE
      ========================= */}

      <div className="max-w-3xl mx-auto p-6 pb-24">
        {/* HERO IMAGE */}

        <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-primary/10 mb-6">
          {entry.images?.[0]?.url ? (
            <img
              src={entry.images[0].url}
              alt={entry.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedImage(entry.images[0].url)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="text-primary/30" size={48} />
            </div>
          )}

          <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-base-100/90 backdrop-blur-sm text-base-content text-xs font-medium px-3 py-1.5 rounded-full">
            {entry.isPublic ? <Globe size={13} /> : <Lock size={13} />}

            {entry.isPublic ? "Public" : "Private"}
          </span>

          {entry.images?.length > 1 && (
            <span className="absolute bottom-4 right-4 bg-base-100/90 backdrop-blur-sm text-base-content text-xs font-medium px-3 py-1.5 rounded-full">
              <a href="#photo">View all photos ({entry.images.length})</a>
            </span>
          )}
        </div>

        {/* =========================
            META
        ========================= */}

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="border border-base-300 rounded-xl p-3">
            <p className="text-xs font-semibold text-base-content/60 mb-1">
              Mood
            </p>

            {entry.mood ? (
              <p className="text-sm text-base-content">
                {moodEmojis[entry.mood]} {entry.mood}
              </p>
            ) : (
              <p className="text-sm text-base-content/40">Not set</p>
            )}
          </div>

          <div className="border border-base-300 rounded-xl p-3">
            <p className="text-xs font-semibold text-base-content/60 mb-1">
              Tags
            </p>

            {entry.tags?.length > 0 ? (
              <div className="flex gap-1 flex-wrap">
                {entry.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}

                {entry.tags.length > 3 && (
                  <span className="text-xs text-base-content/50">
                    +{entry.tags.length - 3} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-base-content/40">None</p>
            )}
          </div>

          <div className="border border-base-300 rounded-xl p-3">
            <p className="text-xs font-semibold text-base-content/60 mb-1">
              Visibility
            </p>

            <div className="flex items-center gap-1.5 text-sm text-base-content">
              {entry.isPublic ? (
                <Globe size={14} className="text-primary" />
              ) : (
                <Lock size={14} className="text-primary" />
              )}

              {entry.isPublic ? "Public" : "Private"}
            </div>
          </div>
        </div>

        {/* TITLE */}

        <h1 className="text-3xl font-bold text-base-content mb-5">
          {entry.title}
        </h1>

        {/* VERSE */}

        {entry.verse && (
          <div className="bg-primary/10 rounded-2xl p-5 mb-6 flex gap-3">
            <BookOpen className="text-primary shrink-0 mt-0.5" size={20} />

            <p className="text-primary italic leading-relaxed">{entry.verse}</p>
          </div>
        )}

        {/* BODY */}

        <div
          className="prose prose-sm dark:prose-invert max-w-none text-base-content leading-relaxed mb-6"
          dangerouslySetInnerHTML={{
            __html: entry.content,
          }}
        />

        {/* TAGS */}

        {entry.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {entry.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* LIKE */}

        {entry.isPublic && (
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                liked
                  ? "bg-error/10 text-error hover:bg-error/20"
                  : "bg-base-200 text-base-content/70 hover:bg-base-300"
              }`}
            >
              <Heart
                size={16}
                className={liked ? "fill-error text-error" : ""}
              />
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowReportModal(true);
              }}
              className="flex items-center gap-1.5 text-sm text-base-content/70 hover:text-red-500 transition"
            >
              <Flag size={17} />
              Report
            </button>
          </div>
        )}

        {/* PHOTOS */}

        {entry.images?.length >= 1 && (
          <div id="photo" className="grid grid-cols-4 gap-3 mb-6">
            {entry.images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.url}
                  className="w-full h-28 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedImage(img.url)}
                />

                {isOwner && (
                  <button
                    onClick={() => handleDeleteImage(img.filename)}
                    disabled={deletingImage === img.filename}
                    className="absolute top-1 right-1 bg-error text-base-100 rounded-full w-5 h-5 flex items-center justify-center hover:bg-error/90 transition disabled:opacity-50"
                  >
                    {deletingImage === img.filename ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <X size={12} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AUTHOR */}

        {entry.author && (
          <p className="text-sm text-base-content/60 mb-4">
            Posted by{" "}
            <Link
              to={`/users/${entry.author._id}`}
              className="font-medium text-primary underline decoration-primary underline-offset-2 hover:decoration-primary active:opacity-60 transition-colors"
            >
              {entry.author.username}
            </Link>
          </p>
        )}

        {/* OWNER ACTIONS */}

        <div className="flex gap-3 mb-8">
          {isOwner && (
            <Link
              to={`/entries/${entry._id}/edit`}
              className="bg-primary text-primary-content text-sm font-medium px-4 py-2 rounded-lg"
            >
              Edit Entry
            </Link>
          )}

         {(isOwner || isAdmin) && (
    <button
        onClick={() => setShowDeleteModal(true)}
        className="flex items-center gap-1.5 bg-error/10 text-error text-sm font-medium px-4 py-2 rounded-lg hover:bg-error/20 active:scale-95 transition-all duration-150"
    >
        <Trash2 size={15} />
        Delete
    </button>
)}
        </div>

        {/* =========================
            COMMENTS
        ========================= */}

        {entry.isPublic && (
          <div className="border-t border-base-300 pt-6">
            <h3 className="text-lg font-semibold text-base-content mb-4">
              Comments ({mainComments.length})
            </h3>

            {/* COMMENT INPUT */}

            {currentUser && (
              <form onSubmit={handleComment} className="mb-6">
                {replyingTo && (
                  <div className="flex items-center justify-between mb-2 px-3 py-2 bg-primary/10 rounded-lg">
                    <p className="text-xs text-primary">
                      Replying to{" "}
                      <span className="font-semibold">
                        @{replyingTo.author?.username}
                      </span>
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setComment("");
                      }}
                      className="text-base-content/60 hover:text-error"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      replyingTo
                        ? `Reply to @${replyingTo.author?.username}...`
                        : "Write a comment..."
                    }
                    disabled={postingComment}
                    className="flex-1 border border-base-300 bg-base-100 text-base-content rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={postingComment}
                    className="bg-primary text-primary-content text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {postingComment ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : replyingTo ? (
                      "Reply"
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* MAIN COMMENTS */}

            <div className="flex flex-col gap-6">
              {mainComments.map((c) => {
                const replyCount = getThreadReplies(c._id).length;

                return (
                  <div key={c._id} className="flex gap-3">
                    {/* AVATAR */}

                    <div
                      className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden cursor-pointer"
                      onClick={() =>
                        c.author?.profilePic?.url &&
                        setSelectedImage(c.author.profilePic.url)
                      }
                    >
                      {c.author?.profilePic?.url ? (
                        <img
                          src={c.author.profilePic.url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        c.author?.username?.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* COMMENT CONTENT */}

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/users/${c.author?._id}`}
                        className="font-semibold text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary active:opacity-60 transition-colors"
                      >
                        {c.author?.username}
                      </Link>

                      {/* EDIT */}

                      {editingCommentId === c._id ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            disabled={savingCommentId === c._id}
                            className="flex-1 border border-primary/30 bg-base-100 text-base-content rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary disabled:opacity-60"
                          />

                          <button
                            onClick={() => handleEditComment(c._id)}
                            disabled={savingCommentId === c._id}
                            className="bg-primary text-primary-content text-xs px-3 py-1 rounded-lg"
                          >
                            {savingCommentId === c._id ? "..." : "Save"}
                          </button>

                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditText("");
                            }}
                            className="bg-base-200 text-base-content text-xs px-3 py-1 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-base-content/80 text-sm mt-1">
                          {c.text}
                        </p>
                      )}

                      {/* SHOW REPLIES */}

                      {replyCount > 0 && (
                        <button
                          type="button"
                          onClick={() => openReplies(c)}
                          className="mt-2 text-primary text-sm font-semibold hover:opacity-80 transition"
                        >
                          Show {replyCount}{" "}
                          {replyCount === 1 ? "reply" : "replies"}
                        </button>
                      )}

                      {/* MAIN COMMENT ACTIONS */}

                      <div className="flex items-center gap-4 mt-2">
                        {currentUser && (
                          <button
                            onClick={() => {
                              setReplyingTo(c);
                              setComment("");
                            }}
                            className="text-primary hover:opacity-80 transition text-sm font-medium"
                          >
                            Reply
                          </button>
                        )}

                        {/* EDIT */}

                        {currentUser &&
                          c.author?._id?.toString() ===
                            currentUser._id?.toString() &&
                          editingCommentId !== c._id && (
                            <button
                              onClick={() => {
                                setEditingCommentId(c._id);
                                setEditText(c.text);
                              }}
                              className="text-primary hover:opacity-80 transition"
                            >
                              <SquarePen size={18} />
                            </button>
                          )}

                        {/* DELETE */}

                        {currentUser &&
                          (c.author?._id?.toString() ===
                            currentUser._id?.toString() ||
                            currentUser.role === "admin") && (
                            <button
                              onClick={() => handleDeleteComment(c._id)}
                              disabled={deletingCommentId === c._id}
                              className="text-error hover:opacity-80 transition disabled:opacity-50"
                            >
                              {deletingCommentId === c._id ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================
            REPORT MODAL
        ========================= */}

        {showReportModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Report Entry</h3>

              <textarea
                className="textarea textarea-bordered w-full mt-4"
                placeholder="Why are you reporting this entry?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => {
                    setShowReportModal(false);
                    setReason("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-error"
                  disabled={loading}
                  onClick={handleReport}
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        )}




        {showDeleteModal && (
    <div className="modal modal-open">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Delete this entry?</h3>

            <p className="text-sm text-base-content/60 mt-3">
                This action can't be undone. Your entry, its images, and all comments will be permanently removed.
            </p>

            <div className="modal-action">
                <button
                    className="btn"
                    disabled={deletingEntry}
                    onClick={() => setShowDeleteModal(false)}
                >
                    Cancel
                </button>

                <button
                    className="btn btn-error"
                    disabled={deletingEntry}
                    onClick={handleDelete}
                >
                    {deletingEntry ? (
                        <span className="loading loading-spinner loading-xs" />
                    ) : (
                        "Delete Entry"
                    )}
                </button>
            </div>
        </div>
    </div>
)}
      </div>

      <BottomNav />

      {/* =========================
          REPLIES VIEW
      ========================= */}

      {selectedComment && (
        <RepliesView
          parentComment={selectedComment}
          replies={getThreadReplies(selectedComment._id)}
          currentUser={currentUser}
          onClose={closeReplies}
          onReply={handleReplyFromRepliesView}
          selectedImage={setSelectedImage}
        />
      )}
    </PageTransition>
  );
}

/* =====================================================
   REPLIES VIEW
===================================================== */

function RepliesView({
  parentComment,
  replies,
  currentUser,
  onClose,
  onReply,
  selectedImage,
}) {
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(parentComment);
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!replyText.trim() || posting) {
      return;
    }

    try {
      setPosting(true);

      await onReply(replyingTo, replyText);

      setReplyText("");
      setReplyingTo(parentComment);
    } catch (err) {
      // Error already handled
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-base-100 text-base-content flex flex-col animate-replies-in">
      {/* HEADER */}

      <div className="flex items-center gap-3 px-4 py-4 border-b border-base-300 shrink-0">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-base-200 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <h2 className="text-lg font-semibold">Replies</h2>

        <button
          onClick={onClose}
          className="ml-auto p-1.5 rounded-full hover:bg-base-200 transition"
        >
          <X size={22} />
        </button>
      </div>

      {/* CONTENT */}

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {/* PARENT COMMENT */}

        <div className="flex gap-3 mb-5">
          <ReplyAvatar comment={parentComment} selectedImage={selectedImage} />

          <div className="flex-1 min-w-0">
            <Link
              to={`/users/${parentComment.author?._id}`}
              className="font-semibold text-primary"
            >
              {parentComment.author?.username}
            </Link>

            <p className="text-sm text-base-content/80 mt-1">
              {parentComment.text}
            </p>
          </div>
        </div>

        {/* REPLIES */}

        {replies.length > 0 ? (
          <div className="ml-4 pl-4 border-l-2 border-base-300 space-y-5">
            {replies.map((reply) => (
              <div key={reply._id} className="flex gap-3">
                <ReplyAvatar
                  comment={reply}
                  selectedImage={selectedImage}
                  small
                />

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/users/${reply.author?._id}`}
                    className="font-semibold text-primary text-sm"
                  >
                    {reply.author?.username}
                  </Link>

                  <p className="text-sm text-base-content/80 mt-1">
                    {reply.text}
                  </p>

                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => setReplyingTo(reply)}
                      className="mt-2 text-primary text-xs font-medium"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-base-content/50 mt-10">
            No replies yet.
          </p>
        )}
      </div>

      {/* REPLY INPUT */}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-base-300 bg-base-100 p-3 flex gap-2"
        >
          <div className="flex-1">
            {replyingTo && (
              <p className="text-[11px] text-primary mb-1 ml-3">
                Replying to @{replyingTo.author?.username}
              </p>
            )}

            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply..."
              disabled={posting}
              className="w-full bg-base-200 border border-base-300 rounded-full px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={posting || !replyText.trim()}
            className="bg-primary text-primary-content px-4 rounded-full text-sm font-medium disabled:opacity-50"
          >
            {posting ? "..." : "Reply"}
          </button>
        </form>
      )}
    </div>
  );
}

/* =====================================================
   REPLY AVATAR
===================================================== */

function ReplyAvatar({ comment, selectedImage, small = false }) {
  const size = small ? "w-7 h-7" : "w-9 h-9";

  return (
    <div
      onClick={() => {
        if (comment.author?.profilePic?.url) {
          selectedImage(comment.author.profilePic.url);
        }
      }}
      className={`${size} rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden cursor-pointer`}
    >
      {comment.author?.profilePic?.url ? (
        <img
          src={comment.author.profilePic.url}
          className="w-full h-full object-cover"
        />
      ) : (
        comment.author?.username?.charAt(0).toUpperCase()
      )}
    </div>
  );
}
