import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../Components/admin/AdminSidebar";
import AdminNavbar from "../Components/admin/AdminNav";
import StatCard from "../Components/admin/StatCard";
import api from "../api";
import PageTransition from "../Components/PageTransition";

import {
    Users,
    FileText,
    Flag,
    MessageCircle
} from "lucide-react";
import LoadingScreen from "../Components/LoadingScreen";
import BottomNav from "../Components/BotttomNav";

export default function AdminDashboard() {

    const [stats, setStats] = useState({
        users: 0,
        entries: 0,
        reports: 0,
        comments: 0
    });
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchStats() {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data.stats);
                setAdmin(data.admin);
            } catch (err) {
                if (err.response?.status === 401) {
                    toast.error('You must be logged in!');
                    navigate('/login');
                } else if (err.response?.status === 403) {
                    toast.error('Admin access only!');
                    navigate('/dashboard');
                } else {
                    toast.error('Failed to load dashboard');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <PageTransition>
        <div className="drawer lg:drawer-open bg-base-200">

            <input
                id="admin-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            <div className="drawer-content flex flex-col">

                <AdminNavbar />

                <main className="p-6">

                    <div className="mb-8">
 <h1
            className="text-lg sm:text-2xl text-primary truncate"
            style={{ fontFamily: "var(--font-serif-elegant)" }}
          >
             Welcome, {admin?.username || 'Admin'}
          </h1>
                       

                        <p className="opacity-70 mt-2">
                            Manage Journex from one place.
                        </p>

                    </div>

                    {loading ? (
                        <LoadingScreen/>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                            <StatCard
                                title="Users"
                                value={stats.users}
                                icon={Users}
                            />

                            <StatCard
                                title="Entries"
                                value={stats.entries}
                                icon={FileText}
                            />

                            <StatCard
                                title="Reports"
                                value={stats.reports}
                                icon={Flag}
                            />

                            <StatCard
                                title="Comments"
                                value={stats.comments}
                                icon={MessageCircle}
                            />

                        </div>
                    )}

                </main>

            </div>

            <AdminSidebar />
<BottomNav/>
        </div>
         </PageTransition>
    );
}