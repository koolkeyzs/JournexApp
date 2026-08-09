import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api";
import { Link } from "react-router-dom";
import AdminNavbar from "../Components/admin/AdminNav";
import AdminSidebar from "../Components/admin/AdminSidebar";
import { Flag, CheckCircle2, ShieldCheck, ExternalLink, User } from "lucide-react";
import LoadingScreen from "../Components/LoadingScreen";

const statusStyles = {
  pending: { badge: "bg-primary/20 text-primary", border: "border-l-primary" },
  reviewed: { badge: "bg-primary/40 text-primary-content", border: "border-l-primary/60" },
  resolved: { badge: "bg-primary text-primary-content", border: "border-l-primary" },
};

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchReports() {
      try {
        const { data } = await api.get("/admin/reports");
        setReports(data.reports);
      } catch (err) {
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const handleReview = async (id) => {
    try {
      const { data } = await api.patch(`/admin/reports/${id}/review`);
      toast.success(data.message);
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "reviewed" } : r))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update report.");
    }
  };

  const handleResolve = async (id) => {
    try {
      const { data } = await api.patch(`/admin/reports/${id}/resolve`);
      toast.success(data.message);
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "resolved" } : r))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve report.");
    }
  };

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const counts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="drawer lg:drawer-open bg-base-200">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <AdminNavbar />

        <main className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Reports</h1>
          <p className="text-sm text-base-content/60 mb-6">
            Review and moderate reported content.
          </p>

          {/* Filter tabs */}
          <div className="tabs tabs-boxed bg-base-100 inline-flex mb-6 flex-wrap">
            {["all", "pending", "reviewed", "resolved"].map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`tab capitalize ${filter === key ? "tab-active" : ""}`}
              >
                {key} ({counts[key]})
              </button>
            ))}
          </div>

          {loading ? (
         <LoadingScreen/>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldCheck className="text-primary/30 mb-3" size={48} />
              <p className="text-base-content/60">No {filter !== "all" ? filter : ""} reports.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredReports.map((report) => {
                const style = statusStyles[report.status] || statusStyles.pending;
                return (
                  <div
                    key={report._id}
                    className={`bg-base-100 rounded-2xl shadow-sm border-l-4 ${style.border} p-5 flex flex-col`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="font-semibold text-base-content leading-snug">
                        {report.entry ? report.entry.title : "Deleted Entry"}
                      </h2>
                      <span className={`badge badge-sm ${style.badge} capitalize flex-shrink-0`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-base-content/60 mb-3">
                      <User size={12} />
                      Reported by <span className="font-medium">{report.reporter.username}</span>
                    </div>

                    <div className="flex gap-2 mb-4 text-sm text-base-content/80 bg-base-200 rounded-lg p-3">
                      <Flag size={15} className="text-primary flex-shrink-0 mt-0.5" />
                      <p>{report.reason}</p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2">
                      {report.entry ? (
                        <Link
                          to={`/entries/${report.entry._id}`}
                          className="btn btn-outline btn-primary btn-sm gap-1.5"
                        >
                          <ExternalLink size={14} />
                          View Entry
                        </Link>
                      ) : (
                        <span className="badge badge-outline">Entry Deleted</span>
                      )}

                      <button
                        className="btn btn-sm btn-outline btn-primary gap-1.5"
                        disabled={report.status !== "pending"}
                        onClick={() => handleReview(report._id)}
                      >
                        Mark Reviewed
                      </button>

                      <button
                        className="btn btn-sm btn-primary gap-1.5"
                        disabled={report.status === "resolved"}
                        onClick={() => handleResolve(report._id)}
                      >
                        <CheckCircle2 size={14} />
                        Resolve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <AdminSidebar />
    </div>
  );
}