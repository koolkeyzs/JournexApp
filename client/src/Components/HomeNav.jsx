import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const HomeNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-300 fixed top-0 z-50 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center w-full py-1">

        <Link to="/" className="flex items-center gap-2">
          <img src="/JournexLogo.png" alt="Journex logo" className="h-9 object-contain" />
          <span className="text-2xl sm:text-3xl font-bold text-primary">Journex</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-2">
          <Link to="/login" className="btn btn-ghost btn-sm text-base-content/70">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Register
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden btn btn-ghost btn-sm btn-circle"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-base-100 border-b border-base-300 shadow-lg flex flex-col p-4 gap-2">
       <Link
    to="/login"
    onClick={() => setIsOpen(false)}
    className="btn btn-ghost bg-base-200 w-full justify-start text-base-content/70"
>
    Login
</Link>
          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className="btn btn-primary w-full"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default HomeNav;