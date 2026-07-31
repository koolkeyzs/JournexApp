import { Link } from "react-router-dom";
import { Calendar, MoreVertical, BookOpen } from "lucide-react";


const RecentEntryCard = ({  entry }) => {
     if (!entry) return null  
  const { _id, title, content, images, isPublic, createdAt } = entry;
  const thumbnail = images?.[0]?.url;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  



  // strip HTML tags for the snippet
const stripHtml = (html) => html.replace(/<[^>]*>/g, '')
const plainContent = stripHtml(content)
const snippet = plainContent.length > 100 ? plainContent.slice(0, 100) + "..." : plainContent
  

  
  

  return (
    <Link
      to={`/entries/${_id}`}
      className="flex gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition"
    >
      {/* Thumbnail */}
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          className="w-20 h-20 rounded-lg object-cover shrink-0 bg-gray-100"
        />
      ) : (
        <div className="w-20 h-20 rounded-lg shrink-0 bg-purple-50 flex items-center justify-center">
          <BookOpen className="text-purple-300" size={24} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800">{title}</h3>

          <div className="flex items-center gap-2 shrink-0">
            {!isPublic && (
              <span className="text-xs font-medium bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full">
                Private
              </span>
            )}
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 mb-2">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{snippet}</p>
      </div>
    </Link>
  );
};

export default RecentEntryCard;