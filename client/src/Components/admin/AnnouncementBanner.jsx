import { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";
import api from "../../api";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadAnnouncement();
  }, []);

  async function loadAnnouncement() {
    try {
      const { data } = await api.get("/announcements/active");
      setAnnouncement(data.announcement);
    } catch (err) {
      console.error("Failed to load announcement:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !announcement || dismissed) {
    return null;
  }

  return (
    <div className="mb-6 bg-error/5 border border-error/20 rounded-2xl p-4 sm:p-5 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <div className="bg-error/15 text-error rounded-full p-2 shrink-0">
          <Megaphone size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-error bg-error/10 px-2 py-0.5 rounded-full inline-block mb-2">
            Announcement
          </span>

          <h2 className="font-bold text-base text-base-content mb-1">
            {announcement.title}
          </h2>

          <p className="text-sm text-base-content/60 leading-relaxed">
            {announcement.message}
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-base-content/40 hover:text-error hover:bg-error/10 rounded-full p-1.5 transition shrink-0"
          aria-label="Close announcement"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
