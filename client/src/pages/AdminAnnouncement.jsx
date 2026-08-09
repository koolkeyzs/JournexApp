import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { Trash2, Megaphone, X } from "lucide-react";

import AdminNavbar from "../Components/admin/AdminNav";
import AdminSidebar from "../Components/admin/AdminSidebar";
import PageTransition from "../Components/PageTransition";

const statusStyles = {
  Active: "bg-primary text-primary-content",
  Scheduled: "bg-primary/20 text-primary",
  Expired: "badge-ghost",
};

export default function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const { data } = await api.get("/announcements");
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load announcements");
    } finally {
      setLoadingAnnouncements(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !message || !startsAt || !expiresAt) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (new Date(expiresAt) <= new Date(startsAt)) {
      toast.error("Expiry time must be after the start time.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/announcements", { title, message, startsAt, expiresAt });
      toast.success("Announcement published!");
      setTitle("");
      setMessage("");
      setStartsAt("");
      setExpiresAt("");
      loadAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create announcement.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAnnouncement() {
    if (!confirmId) return;
    setDeleting(confirmId);

    try {
      await api.delete(`/announcements/${confirmId}`);
      toast.success("Announcement deleted");
      setAnnouncements((prev) => prev.filter((a) => a._id !== confirmId));
      setConfirmId(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete announcement.");
    } finally {
      setDeleting(null);
    }
  }

  function getStatus(announcement) {
    const now = new Date();
    const start = new Date(announcement.startsAt);
    const expiry = new Date(announcement.expiresAt);

    if (now < start) return "Scheduled";
    if (now >= start && now < expiry) return "Active";
    return "Expired";
  }

  return (
    <PageTransition>
      <div className="drawer lg:drawer-open bg-base-200 min-h-screen">
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col">
          <AdminNavbar />

          <main className="p-4 sm:p-6">
            <div className="max-w-4xl">

              <h1 className="text-2xl sm:text-3xl font-bold">Announcements</h1>
              <p className="text-sm text-base-content/60 mt-1 mb-6">
                Create and manage announcements for Journex users.
              </p>

              {/* CREATE ANNOUNCEMENT */}
              <form
                onSubmit={handleSubmit}
                className="bg-base-100 rounded-2xl p-5 sm:p-7 shadow-sm mb-8"
              >
                <h2 className="font-bold text-lg mb-5">Create announcement</h2>

                <div className="form-control mb-5">
                  <label className="label">
                    <span className="label-text font-semibold">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Journex is officially live!"
                    className="input input-bordered w-full focus:border-primary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-control mb-5">
                  <label className="label">
                    <span className="label-text font-semibold">Message</span>
                  </label>
                  <textarea
                    placeholder="Write your announcement..."
                    className="textarea textarea-bordered w-full min-h-32 focus:border-primary"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Starts at</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered w-full focus:border-primary"
                      value={startsAt}
                      onChange={(e) => setStartsAt(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Expires at</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered w-full focus:border-primary"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto">
                  {loading ? <span className="loading loading-spinner loading-sm" /> : "Publish announcement"}
                </button>
              </form>

              {/* ANNOUNCEMENT LIST */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone size={20} className="text-primary" />
                  <h2 className="text-xl font-bold">All announcements</h2>
                </div>

                {loadingAnnouncements ? (
                  <div className="flex justify-center py-10">
                    <span className="loading loading-spinner text-primary" />
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="bg-base-100 rounded-2xl p-10 text-center">
                    <Megaphone size={40} className="mx-auto mb-3 text-primary/30" />
                    <p className="text-base-content/60">No announcements yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {announcements.map((announcement) => {
                      const status = getStatus(announcement);

                      return (
                        <div key={announcement._id} className="bg-base-100 rounded-2xl p-4 sm:p-5 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-bold text-base sm:text-lg break-words">
                                  {announcement.title}
                                </h3>
                                <span className={`badge badge-sm ${statusStyles[status]}`}>
                                  {status}
                                </span>
                              </div>

                              <p className="text-sm text-base-content/70 mb-4 break-words">
                                {announcement.message}
                              </p>

                              <div className="text-xs text-base-content/50 space-y-1">
                                <p>Starts: {new Date(announcement.startsAt).toLocaleString()}</p>
                                <p>Expires: {new Date(announcement.expiresAt).toLocaleString()}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => setConfirmId(announcement._id)}
                              disabled={deleting === announcement._id}
                              className="btn btn-error btn-outline btn-sm gap-1 self-start sm:self-auto"
                            >
                              {deleting === announcement._id ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </main>
        </div>

        <AdminSidebar />
      </div>

      {/* Delete confirmation modal */}
      {confirmId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => !deleting && setConfirmId(null)}
        >
          <div
            className="bg-base-100 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-base-content">Delete announcement?</h3>
              <button onClick={() => setConfirmId(null)} disabled={!!deleting} className="text-base-content/40 hover:text-base-content">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-base-content/60 mb-6">This action can't be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} disabled={!!deleting} className="btn btn-outline flex-1">
                Cancel
              </button>
              <button onClick={deleteAnnouncement} disabled={!!deleting} className="btn btn-error flex-1">
                {deleting ? <span className="loading loading-spinner loading-sm"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}