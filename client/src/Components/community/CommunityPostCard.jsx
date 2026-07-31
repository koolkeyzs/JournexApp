import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, BookOpen, Calendar } from "lucide-react";
import api from "../../api";
import toast from "react-hot-toast";

const CommunityPostCard = ({ entry, currentUser }) => {
  const [liked, setLiked] = useState(
    currentUser ? entry.likes?.includes(currentUser._id) : false
  )
  const [likeCount, setLikeCount] = useState(entry.likes?.length || 0)
  const navigate = useNavigate()
  
  const { _id, title, content, images, author, createdAt } = entry;
  const thumbnail = images?.[0]?.url;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const stripHtml = (html) => html.replace(/<[^>]*>/g, '')
  const plainContent = stripHtml(content)
  const snippet = plainContent.length > 100 ? plainContent.slice(0, 100) + "..." : plainContent
  

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if(!currentUser) {
      toast.error('You must be logged in to like!')
      navigate('/login')
      return
    }

    try {
      const { data } = await api.post(`/entries/${_id}/like`)
      setLiked(data.liked)
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1)
    } catch(err) {
      toast.error('Failed to like entry')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden mb-5">

      {/* Author header — separate link, goes to their profile */}
      <Link
        to={`/users/${author?._id}`}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition w-fit"
      >
        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
          {author?.username?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate hover:underline">{author?.username || "Unknown"}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={11} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>

      {/* Card body — separate link, goes to the entry */}
      <Link to={`/entries/${_id}`} className="block">
        {/* Title + snippet */}
        <div className="px-4 pb-3">
          <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{snippet}</p>
        </div>

        {/* Image */}
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-40 bg-purple-50 flex items-center justify-center">
            <BookOpen className="text-purple-200" size={32} />
          </div>
        )}
      </Link>

      {/* Like / comment actions — not inside either link */}
      <div className="flex items-center gap-5 px-4 py-3 border-t border-gray-50 mt-1">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition"
        >
          <Heart 
            size={17} 
            className={liked ? "text-red-500 fill-red-500" : "text-gray-300"} 
          />
          {likeCount}
        </button>

        <span className="flex items-center gap-1.5 text-sm text-gray-500">
          <MessageCircle size={17} />
          {entry.comment?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default CommunityPostCard;