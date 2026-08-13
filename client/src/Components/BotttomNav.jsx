import {
    Home,
    BookOpen,
    Plus,
    Users,
    User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            label: "Home",
            icon: Home,
            path: "/dashboard",
        },
        {
            label: "Journal",
            icon: BookOpen,
            path: "/entries",
        },
        {
            label: "Community",
            icon: Users,
            path: "/community",
        },
        {
            label: "Profile",
            icon: User,
            path: "/profile",
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className="
                fixed
                bottom-0
                left-0
                right-0
                z-50
                md:hidden
                bg-base-100/95
                backdrop-blur-lg
                border-t
                border-base-300
                shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
            "
        >
            <div className="relative flex items-center justify-around h-[72px] px-2">

                {/* Home */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`flex flex-col items-center justify-center gap-1 w-16 transition ${
                        isActive("/dashboard")
                            ? "text-primary"
                            : "text-base-content/60"
                    }`}
                >
                    <Home
                        size={22}
                        strokeWidth={isActive("/dashboard") ? 2.5 : 2}
                    />

                    <span className="text-[11px] font-medium">
                        Home
                    </span>
                </button>

                {/* Journal */}
                <button
                    onClick={() => navigate("/entries")}
                    className={`flex flex-col items-center justify-center gap-1 w-16 transition ${
                        isActive("/entries")
                            ? "text-primary"
                            : "text-base-content/60"
                    }`}
                >
                    <BookOpen
                        size={22}
                        strokeWidth={isActive("/entries") ? 2.5 : 2}
                    />

                    <span className="text-[11px] font-medium">
                        Journal
                    </span>
                </button>

                {/* Create button */}
                <button
                    onClick={() => navigate("/entries/new")}
                    className="
                        relative
                        -mt-7
                        flex
                        items-center
                        justify-center
                        w-14
                        h-14
                        rounded-full
                        bg-primary
                        text-primary-content
                        shadow-lg
                        shadow-primary/30
                        border-4
                        border-base-100
                        hover:scale-105
                        active:scale-95
                        transition
                    "
                    aria-label="Create new journal entry"
                >
                    <Plus size={28} strokeWidth={2.5} />
                </button>

                {/* Community */}
                <button
                    onClick={() => navigate("/community")}
                    className={`flex flex-col items-center justify-center gap-1 w-16 transition ${
                        isActive("/community")
                            ? "text-primary"
                            : "text-base-content/60"
                    }`}
                >
                    <Users
                        size={22}
                        strokeWidth={isActive("/community") ? 2.5 : 2}
                    />

                    <span className="text-[11px] font-medium">
                        Community
                    </span>
                </button>

                {/* Profile */}
                <button
                    onClick={() => navigate("/profile")}
                    className={`flex flex-col items-center justify-center gap-1 w-16 transition ${
                        isActive("/profile")
                            ? "text-primary"
                            : "text-base-content/60"
                    }`}
                >
                    <User
                        size={22}
                        strokeWidth={isActive("/profile") ? 2.5 : 2}
                    />

                    <span className="text-[11px] font-medium">
                        Profile
                    </span>
                </button>

            </div>
        </nav>
    );
};

export default BottomNav;