import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import NotificationBell from "./NotificationBell";

const TopBar = ({ currentUser }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }
      try {
        const { data } = await api.get(`/entries/search?q=${query}`);
        setResults(data.results);
      } catch (err) {
        console.log(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      <header className="bg-base-100 border-b border-base-300 pl-16 pr-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        {/* Left */}
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-base-content/40 mb-0.5">
            {getGreeting()}
          </p>
          <h1
            className="text-lg sm:text-2xl text-primary truncate"
            style={{ fontFamily: "var(--font-serif-elegant)" }}
          >
            {currentUser?.username}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="relative hidden sm:flex items-center gap-2 bg-base-200 rounded-full px-4 py-2">
            <Search size={16} className="text-base-content/50 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-40 lg:w-56 text-base-content placeholder:text-base-content/50"
            />

            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 w-80 bg-base-100 rounded-2xl shadow-xl border border-base-300 max-h-80 overflow-y-auto z-50"
                >
                  {results.map((result) => (
                    <Link
                      key={result._id}
                      to={`/entries/${result._id}`}
                      className="flex flex-col gap-0.5 p-3 hover:bg-base-200 border-b border-base-300 last:border-0 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <p className="text-sm font-semibold text-base-content truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {result.isPublic ? `by ${result.author?.username}` : "Private entry"}
                      </p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden btn btn-ghost btn-sm btn-circle"
          >
            <Search size={18} />
          </button>

          <ThemeToggle />
          <NotificationBell currentUser={currentUser} />
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sm:hidden fixed inset-0 bg-base-100 z-50 flex flex-col"
          >
            <div className="flex items-center gap-2 p-3 border-b border-base-300">
              <div className="flex-1 flex items-center gap-2 bg-base-200 rounded-full px-4 py-2.5">
                <Search size={16} className="text-base-content/50 shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search entries..."
                  className="bg-transparent outline-none text-sm w-full text-base-content placeholder:text-base-content/50"
                />
              </div>
              <button onClick={closeSearch} className="btn btn-ghost btn-sm btn-circle">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {results.length > 0 ? (
                results.map((result) => (
                  <Link
                    key={result._id}
                    to={`/entries/${result._id}`}
                    onClick={closeSearch}
                    className="flex flex-col gap-0.5 p-4 hover:bg-base-200 border-b border-base-300 transition-colors"
                  >
                    <p className="text-sm font-semibold text-base-content truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {result.isPublic ? `by ${result.author?.username}` : "Private entry"}
                    </p>
                  </Link>
                ))
              ) : query.trim() !== "" ? (
                <p className="text-center text-sm text-base-content/50 py-10">No results found.</p>
              ) : (
                <p className="text-center text-sm text-base-content/40 py-10">Start typing to search entries.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;



