import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import PageTransition from "../Components/PageTransition";
import TopBar from "../Components/Dashboard/navbar";
import {
  ArrowLeft,
  BookOpen,
  Trash2,
  Globe,
  Lock,
  SquarePen,
  Heart,
  X,
  Flag,
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
  const [deletingImage, setDeletingImage] = useState(null);
  const [deletingEntry, setDeletingEntry] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingCommentId, setSavingCommentId] = useState(null);
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

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/entries/${id}/like`);
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      toast.error("Failed to like entry");
    }
  };

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

  const handleComment = async (e) => {
    e.preventDefault();
    if (postingComment) return;

    try {
      setPostingComment(true);
      await api.post(`/entries/${id}/comments`, {
        comment: { text: comment },
      });

      toast.success("Comment added!");
      setComment("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (deletingCommentId) return;

    try {
      setDeletingCommentId(commentId);
      await api.delete(`/entries/${id}/comments/${commentId}`);
      toast.success("Comment deleted!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleEditComment = async (commentId) => {
    if (savingCommentId) return;

    try {
      setSavingCommentId(commentId);
      await api.put(`/entries/${id}/comments/${commentId}`, {
        comment: { text: editText },
      });

      toast.success("Comment updated!");
      setEditingCommentId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    } finally {
      setSavingCommentId(null);
    }
  };

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

  if (!entry)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen />
      </div>
    );

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

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 pb-28"
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

      <div className="max-w-3xl mx-auto p-6">
        <Link
          to="/dashboard/community"
          className="inline-flex items-center gap-2 text-base-content/60 hover:text-primary text-sm mb-4 transition"
        >
          {/* <ArrowLeft size={16} />
          Back to Feed */}
        </Link>

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
              <a href="#photo"> View all photos ({entry.images.length})</a>
            </span>
          )}
        </div>
        {/* Meta row */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-6">
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

        {/* Title */}
        <h1 className="text-3xl font-bold text-base-content mb-5">
          {entry.title}
        </h1>

        {/* Verse card */}
        {entry.verse && (
          <div className="bg-primary/10 rounded-2xl p-5 mb-6 flex gap-3">
            <BookOpen className="text-primary shrink-0 mt-0.5" size={20} />

            <p className="text-primary italic leading-relaxed">{entry.verse}</p>
          </div>
        )}

        {/* Body content */}
        <div
          className="prose prose-sm dark:prose-invert max-w-none text-base-content leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />

        {/* Tags */}
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
        {/* Like button */}
        {entry.isPublic && (
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
              ${
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

        {/* Photo grid */}
        {entry.images?.length >= 1 && (
          <div
            id="photo"
            className="grid grid-cols-4 sm:grid-cols-4 gap-3 mb-6"
          >
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
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <X size={12} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Author */}
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

        {/* Owner actions */}

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
              onClick={handleDelete}
              disabled={deletingEntry}
              className="flex items-center gap-1.5 bg-error/10 text-error text-sm font-medium px-4 py-2 rounded-lg hover:bg-error/20 active:scale-95 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {deletingEntry ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2 size={15} />
              )}
              {deletingEntry ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Comments — only if public */}
        {entry.isPublic && (
          <div className="border-t border-base-300 pt-6">
            <h3 className="text-lg font-semibold text-base-content mb-4">
              Comments ({entry.comment?.length || 0})
            </h3>

            {currentUser && (
              <form onSubmit={handleComment} className="flex gap-2 mb-6">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
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
                  ) : (
                    "Post"
                  )}
                </button>
              </form>
            )}

            <div className="flex flex-col gap-4">
              {entry.comment?.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {c.author?.username?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <span className="font-semibold text-primary">
                      {c.author?.username}
                    </span>

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
                          className="bg-primary text-primary-content text-xs px-3 py-1 rounded-lg hover:bg-primary/90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                          {savingCommentId === c._id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            "Save"
                          )}
                        </button>

                        <button
                          onClick={() => setEditingCommentId(null)}
                          disabled={savingCommentId === c._id}
                          className="bg-base-200 text-base-content text-xs px-3 py-1 rounded-lg hover:bg-base-300 transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-base-content/80 text-sm">{c.text}</p>
                    )}
                  </div>

                  {currentUser &&
                    (c.author?._id?.toString() ===
                      currentUser._id?.toString() ||
                      currentUser.role === "admin") && (
                      <div className="flex items-center gap-5 ml-auto">
                        {c.author?._id?.toString() ===
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

                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          disabled={deletingCommentId === c._id}
                          className="text-error hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingCommentId === c._id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
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
        <BottomNav />
      </div>
    </PageTransition>
  );
}
