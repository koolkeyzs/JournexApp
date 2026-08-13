import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import PageTransition from "../Components/PageTransition";
import SideBar from "../Components/Dashboard/sidebar";
import TopBar from "../Components/Dashboard/navbar";
import { Flag, ExternalLink, ShieldCheck } from "lucide-react";
import LoadingScreen from "../Components/LoadingScreen";
import BottomNav from "../Components/BotttomNav";

const statusStyles = {
  pending: {
    badge: "bg-primary/20 text-primary",
    border: "border-l-primary",
    label: "Pending Review",
  },
  reviewed: {
    badge: "bg-primary/40 text-primary-content",
    border: "border-l-primary/60",
    label: "Reviewed",
  },
  resolved: {
    badge: "bg-primary text-primary-content",
    border: "border-l-primary",
    label: "Resolved",
  },
};

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const { data } = await api.get("/my-reports");
        setReports(data.reports);
      } catch (err) {
        toast.error("Failed to load your reports");
      } finally {
        setLoading(false);
      }
    }

    async function fetchCurrentUser() {
      try {
        const { data } = await api.get("/profile");
        setCurrentUser(data.user);
      } catch (err) {
        console.log(err);
      }
    }

    fetchReports();
    fetchCurrentUser();
  }, []);

  return (
    <PageTransition>
      <div className="flex bg-base-200 min-h-screen">
        <SideBar currentUser={currentUser} />

        <div className="flex-1 md:ml-64">
          <TopBar currentUser={currentUser} />

          <div className="p-4 sm:p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-base-content mb-1">
              My Reports
            </h1>
            <p className="text-sm text-base-content/60 mb-6">
              Track the status of content you've reported.
            </p>

            {loading ? (
              <LoadingScreen />
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShieldCheck className="text-primary/30 mb-3" size={48} />
                <p className="text-base-content/60">
                  You haven't reported anything yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reports.map((report) => {
                  const style =
                    statusStyles[report.status] || statusStyles.pending;
                  return (
                    <div
                      key={report._id}
                      className={`bg-base-100 rounded-2xl shadow-sm border-l-4 ${style.border} p-4`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-base-content">
                          {report.entry
                            ? report.entry.title
                            : "Entry no longer available"}
                        </h3>
                        <span
                          className={`badge badge-sm ${style.badge} shrink-0`}
                        >
                          {style.label}
                        </span>
                      </div>

                      <div className="flex gap-2 text-sm text-base-content/70 mb-3">
                        <Flag
                          size={14}
                          className="text-primary shrink-0 mt-0.5"
                        />
                        <p>{report.reason}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-base-content/40">
                          Reported{" "}
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>

                        {report.entry && (
                          <Link
                            to={`/entries/${report.entry._id}`}
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink size={12} />
                            View Entry
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <BottomNav/>
      </div>
    </PageTransition>
  );
}
