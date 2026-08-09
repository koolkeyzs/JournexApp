import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  BookOpen,
  Calendar,
  Flag,
} from "lucide-react";
import api from "../../api";

import toast from "react-hot-toast";

const CommunityPostCard = ({ entry, currentUser }) => {
  const [liked, setLiked] = useState(
    currentUser ? entry.likes?.includes(currentUser._id) : false
  );
  const [likeCount, setLikeCount] = useState(entry.likes?.length || 0);
const [showReportModal, setShowReportModal] = useState(false);
const [reason, setReason] = useState("");
const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { _id, title, content, images, author, createdAt } = entry;
  const thumbnail = images?.[0]?.url;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const stripHtml = (html) => html.replace(/<[^>]*>/g, "");
  const plainContent = stripHtml(content);
  const snippet =
    plainContent.length > 100
      ? plainContent.slice(0, 100) + "..."
      : plainContent;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.error("You must be logged in to like!");
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.post(`/entries/${_id}/like`);
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      toast.error("Failed to like entry");
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

    const { data } = await api.post(`/entries/${_id}/report`, {
      reason,
    });

    toast.success(data.message);

    setShowReportModal(false);
    setReason("");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to submit report."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden mb-5">
      {/* Author header */}
      <Link
        to={`/users/${author?._id}`}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-3 p-4 hover:bg-base-200 transition w-fit"
      >
        <div className="avatar placeholder">
    <div className="bg-primary/20 text-primary rounded-full w-9">
        {author?.profilePic?.url ? (
            <img src={author.profilePic.url} className="rounded-full w-9 h-9 object-cover" />
        ) : (
            <span className="text-sm font-bold">
                {author?.username?.charAt(0).toUpperCase()}
            </span>
        )}
    </div>
</div>

        <div className="min-w-0">
          <p className="font-semibold text-base-content text-sm truncate hover:underline">
            {author?.username || "Unknown"}
          </p>

          <div className="flex items-center gap-1 text-xs text-base-content/60">
            <Calendar size={11} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>

      {/* Card body */}
      <Link to={`/entries/${_id}`} className="block">
        <div className="px-4 pb-3">
          <h3 className="font-semibold text-base-content mb-1">
            {title}
          </h3>

          <p className="text-sm text-base-content/80 leading-relaxed">
            {snippet}
          </p>
        </div>

        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-primary/10 flex items-center justify-center">
            <BookOpen className="text-primary" size={32} />
          </div>
        )}
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-5 px-4 py-3 border-t border-base-300 mt-1">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-sm text-base-content/70 hover:text-red-500 transition"
        >
          <Heart
            size={17}
            className={
              liked
                ? "text-red-500 fill-red-500"
                : "text-base-content/40"
            }
          />
          {likeCount}
        </button>

        <span className="flex items-center gap-1.5 text-sm text-base-content/70">
          <MessageCircle size={17} />
          {entry.comment?.length || 0}
        </span>


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

      {showReportModal && (
  <div className="modal modal-open">
    <div className="modal-box">
      <h3 className="font-bold text-lg">
        Report Entry
      </h3>

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
    </div>
  );
};

export default CommunityPostCard;