import {
  BookOpen,
  LayoutDashboard,
  BookMarked,
  Users,
  PenSquare,
  BookOpenCheck,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";
import HomeNav from "../HomeNav";
import TopBar from "./navbar";

const SideBar = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.get("/logout", { withCredentials: true });
    toast.success("Goodbye! 🙏");
    navigate("/");
  };

  const navLinks = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/private",
      icon: <BookMarked size={18} />,
      label: "My Journal",
    },
    {
      to: "/dashboard/community",
      icon: <Users size={18} />,
      label: "Community Feed",
    },
    {
      to: "/entries",
      icon: <PenSquare size={18} />,
      label: "Create New Entry",
    },
    
    { to: "/profile", icon: <User size={18} />, label: "Profile" },
    {
      to: "/roadmap",
      icon: <BookOpenCheck size={18} />,
      label: "What's Next??",
    },
  ];

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 btn btn-ghost btn-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                fixed top-0 left-0 h-full w-64 bg-base-100 border-r border-base-content/10
                flex flex-col z-40 transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-base-content/10">
          <h2 className="text-2xl flex gap-2 items-center font-bold text-primary">
            <BookOpen size={28} />
            Journex
          </h2>
          <p className="text-xs text-base-content/40 mt-1">
            Reflect. Grow. Inspire.
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 text-base-content/70"
            >
              {link.icon}
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile + Logout at bottom */}
        <div className="p-4 border-t border-base-content/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="avatar placeholder">
              <div className="bg-primary/20 text-primary rounded-full w-9">
                <span className="text-sm font-bold">
                  {currentUser?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">{currentUser?.username}</p>
              <p className="text-xs text-base-content/40">View Profile</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-sm w-full gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
