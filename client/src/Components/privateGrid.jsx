import { Link } from "react-router-dom";
import { Calendar, MoreVertical, BookOpen } from "lucide-react";

const GridEntryCard = ({ entry }) => {
  const { _id, title, content, images, isPublic, createdAt } = entry;
  const thumbnail = images?.[0]?.url;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
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
      className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* Image on top, full width */}
      {thumbnail ? (
        <img src={thumbnail} alt={title} className="w-full h-40 object-cover bg-gray-100" />
      ) : (
        <div className="w-full h-40 bg-purple-50 flex items-center justify-center">
          <BookOpen className="text-purple-300" size={32} />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 truncate">{title}</h3>
          <button
            className="text-gray-400 hover:text-gray-600 shrink-0"
            onClick={(e) => e.preventDefault()}
          >
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar size={12} />
          <span>{formattedDate}</span>
          {!isPublic && (
            <span className="ml-auto text-xs font-medium bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
              Private
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">{snippet}</p>
      </div>
    </Link>
  );
};

export default GridEntryCard;