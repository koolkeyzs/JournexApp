import {
  LayoutDashboard,
  Users,
  PenSquare,
  BookOpenCheck,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Flag,
  ShieldCheck,
  LockIcon,
  Settings,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";

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
      icon: <LockIcon size={18} />,
      label: "Private Journal",
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
    {
      to: "/my-reports",
      icon: <Flag size={18} />,
      label: "My Reports",
    },
    {
      to: "/roadmap",
      icon: <BookOpenCheck size={18} />,
      label: "What's Next??",
    },
    {
      to: "/settings",
      icon: <Settings size={18} />,
      label: "Settings",
    },

    ...(currentUser?.role === "admin"
      ? [
          {
            to: "/admin/dashboard",
            icon: <ShieldCheck size={18} />,
            label: "Admin Dashboard",
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-[70] btn btn-ghost btn-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0
          left-0
          w-64
          bg-base-100
          border-r
          border-base-300
          flex
          flex-col
          z-[65]
          transition-transform
          duration-300

          h-[calc(100vh-72px)]

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:h-screen
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-base-300 shrink-0">
          <img
            src="/JournexLogo.png"
            alt="Journex logo"
            className="h-15 object-contain"
          />

          <p className="text-xs text-base-content/60 mt-1">
            Reflect. Grow. Inspire.
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 text-base-content/70"
            >
              {link.icon}

              <span className="text-sm font-medium">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* WhatsApp Community */}
        <div className="px-4 pb-3 shrink-0">
          <a
            href="https://chat.whatsapp.com/KX88qWNnwAB12Ei94du7Qu?s=cl&p=a&ilr=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 transition-all duration-200"
          >
            <MessageCircle size={18} />

            <span className="text-sm font-medium">
              Click to join our WhatsApp community
            </span>
          </a>
        </div>

        {/* User */}
        <div className="p-4 border-t border-base-300 shrink-0">
          <Link to="/profile">
            <div className="flex items-center gap-3 mb-3">
              <div className="avatar placeholder">
                <div className="bg-primary/20 text-primary rounded-full w-9">
                  {currentUser?.profilePic?.url ? (
                    <img
                      src={currentUser.profilePic.url}
                      className="rounded-full w-9 h-9 object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold">
                      {currentUser?.username
                        ?.charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-base-content">
                  {currentUser?.username}
                </p>

                <p className="text-xs text-base-content/60">
                  View Profile
                </p>
              </div>
            </div>
          </Link>

          {/* Logout */}
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