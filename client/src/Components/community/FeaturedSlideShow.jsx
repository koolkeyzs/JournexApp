import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const FeaturedSlideshow = ({ entries }) => {
  const [index, setIndex] = useState(0);

  const featured = [...(entries || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featured.length]);

  const goNext = () =>
    setIndex((prev) => (prev + 1) % featured.length);

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + featured.length) % featured.length);

  if (featured.length === 0) return null;

  const current = featured[index];
  const thumbnail = current.images?.[0]?.url;

  return (
    <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={current.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <BookOpen
                size={48}
                className="text-primary"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <Link
            to={`/entries/${current._id}`}
            className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white"
          >
            <span className="text-xs uppercase tracking-wide text-primary-content font-medium">
              Featured Reflection
            </span>

            <h2 className="text-xl sm:text-2xl font-bold mt-1 truncate">
              {current.title}
            </h2>

            <p className="text-sm text-white/80 mt-1">
              by {current.author?.username || "Unknown"}
            </p>
          </Link>
        </motion.div>
      </AnimatePresence>

      {featured.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-base-100/20 hover:bg-base-100/40 backdrop-blur-sm text-white p-2 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-base-100/20 hover:bg-base-100/40 backdrop-blur-sm text-white p-2 rounded-full transition"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {featured.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-base-100/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedSlideshow;