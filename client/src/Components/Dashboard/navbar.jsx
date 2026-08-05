import { Bell, Search, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle";

const TopBar = ({ currentUser, onMenuClick }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

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

  return (
    <header className="bg-base-100 border-b border-base-300 px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden btn btn-ghost btn-sm"
        >
        
        </button>

        <div>
          <h1 className="text-xl font-bold text-primary">
            {getGreeting()}, {currentUser?.username?.toUpperCase()} 👋
          </h1>

          <p className="text-xs text-base-content/60">
            Welcome back! How was your day?
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center gap-2 bg-base-200 rounded-full px-2 py-2 md:px-4">
          <Search
            size={16}
            className="text-base-content/50 shrink-0"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-20 sm:w-28 md:w-40 lg:w-56 text-base-content placeholder:text-base-content/50"
          />

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-[85vw] max-w-xs sm:w-80 bg-base-100 rounded-2xl shadow-xl border border-base-300 max-h-80 overflow-y-auto z-50"
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
                      {result.isPublic
                        ? `by ${result.author?.username}`
                        : "Private entry"}
                    </p>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
<ThemeToggle/>
        {/* <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <Bell size={20} />
            <span className="badge badge-primary badge-xs indicator-item"></span>
          </div>
        </button> */}
      </div>
    </header>
  );
};

export default TopBar;