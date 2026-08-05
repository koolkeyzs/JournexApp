import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import api from "../../api";
import toast from "react-hot-toast";

const TrendingCommunity = ({ communityEntries, currentUser }) => {
  const sorted = [...(communityEntries || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const topEntries = sorted.slice(0, 3);

  return (
    <div className="w-full bg-base-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base-content">
          Trending Community Reflections
        </h3>

        <Link
          to="/dashboard/community"
          className="text-primary text-sm font-medium hover:underline"
        >
          View all
        </Link>
      </div>

      {topEntries.length > 0 ? (
        topEntries.map((entry) => (
          <TrendingCard
            key={entry._id}
            entry={entry}
            currentUser={currentUser}
          />
        ))
      ) : (
        <p className="text-sm text-base-content/60">
          No community reflections yet.
        </p>
      )}
    </div>
  );
};

const TrendingCard = ({ entry, currentUser }) => {
  const [liked, setLiked] = useState(
    currentUser ? entry.likes?.includes(currentUser._id) : false
  );

  const [likeCount, setLikeCount] = useState(entry.likes?.length || 0);

  const thumbnail = entry.images?.[0]?.url;
  const navigate = useNavigate();

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.error("You must be logged in to like!");
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.post(`/entries/${entry._id}/like`);
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      toast.error("Failed to like entry");
    }
  };

  return (
    <Link
      to={`/entries/${entry._id}`}
      className="flex gap-3 py-3 border-b border-base-300 last:border-0 hover:bg-base-200 rounded-lg px-1 -mx-1 transition"
    >
      {thumbnail && (
        <img
          src={thumbnail}
          alt={entry.title}
          className="w-14 h-14 rounded-lg object-cover shrink-0 bg-base-200"
        />
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-base-content truncate">
          {entry.title}
        </h4>

        <p className="text-xs text-base-content/60 mb-1">
          by {entry.author?.username || "Unknown"}
        </p>

        <div className="flex items-center gap-3 text-xs text-base-content/60">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-red-500 transition"
          >
            <Heart
              size={14}
              className={
                liked
                  ? "fill-red-500 text-red-500"
                  : "text-base-content/40"
              }
            />
            {likeCount}
          </button>

          <span className="flex items-center gap-1">
            <MessageCircle size={13} />
            {entry.comment?.length || 0}
          </span>

          <Bookmark
            size={13}
            className="ml-auto text-base-content/40"
          />
        </div>
      </div>
    </Link>
  );
};

export default TrendingCommunity;