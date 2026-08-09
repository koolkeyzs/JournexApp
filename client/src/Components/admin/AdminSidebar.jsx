import {
    LayoutDashboard,
    Users,
    FileText,
    Flag,
    MessageCircle,
    Megaphone,
    Settings,
    LogOut,
    ShieldCheck
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";

export default function AdminSidebar() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.get("/logout", { withCredentials: true });
        toast.success("Goodbye! 🙏");
        navigate("/");
    };

    return (

        <div className="drawer-side">

            <label
                htmlFor="admin-drawer"
                className="drawer-overlay"
            ></label>

            <aside className="w-72 min-h-full bg-base-100 border-r border-base-300">

                <div className="p-6">

                    <h2 className="text-3xl font-bold text-primary">
                        Journex
                    </h2>

                    <p className="text-sm opacity-70">
                        Admin Panel
                    </p>

                </div>

                <ul className="menu p-4 gap-2">

                    <li>
                        <NavLink to="/dashboard">
                            <LayoutDashboard size={20}/>
                            Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/dashboard">
                            <ShieldCheck size={20}/>
                           Admin Dashboard
                        </NavLink>
                    </li>
                     
          

                    <li>
                        <NavLink to="/admin/users">
                            <Users size={20}/>
                            Users
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/entries">
                            <FileText size={20}/>
                            Entries
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/reports">
                            <Flag size={20}/>
                            Reports
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/comments">
                            <MessageCircle size={20}/>
                            Comments
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/announcements">
                            <Megaphone size={20}/>
                            Announcements
                        </NavLink>
                    </li>

                    {/* <li>
                        <NavLink to="/admin/settings">
                            <Settings size={20}/>
                            Settings
                        </NavLink>
                    </li> */}
                </ul>

              <div className="absolute bottom-6 left-0 right-0 px-4">

                

    <button
        onClick={handleLogout}
        className="btn btn-outline btn-error w-full gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-150"
    >
        <LogOut size={18}/>
        Logout
    </button>

</div>

            </aside>

        </div>

    );

}