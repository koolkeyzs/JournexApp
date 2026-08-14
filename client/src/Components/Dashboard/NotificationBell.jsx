import { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const NotificationBell = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const displayCount = useMemo(() => {
    if (unreadCount <= 0) return null;
    return unreadCount > 9 ? "9+" : unreadCount;
  }, [unreadCount]);

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch (err) {
      console.log(err);
    }
  };

  const handleNotificationClick = async (notification) => {
    // navigate first — don't wait for the patch
    if (notification.entry?._id) {
        navigate(`/entries/${notification.entry._id}`)
        setIsOpen(false)
    }

    // then mark as read in background
    try {
        await api.patch(`/notifications/${notification._id}/read`)
        setNotifications((prev) =>
            prev.map((item) =>
                item._id === notification._id ? { ...item, read: true } : item
            )
        )
        setUnreadCount((prev) => Math.max(prev - 1, 0))
    } catch (err) {
        console.log(err)
    }
}

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn btn-ghost btn-circle btn-sm relative"
        aria-label="Notifications"
      >
        <div className="indicator">
          <Bell size={20} className="text-base-content" />
          {displayCount && (
            <span className="badge badge-primary badge-xs indicator-item rounded-full">
              {displayCount}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-[92vw] max-w-88 sm:w-[24rem] bg-base-100 border border-base-300 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 border-b border-base-300 bg-base-200">
              <p className="text-sm font-semibold text-base-content">
                Notifications
              </p>
              <button
                onClick={markAllAsRead}
                className="text-[11px] sm:text-xs font-medium text-primary hover:opacity-80"
              >
                Mark all as read
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex min-h-24 items-center justify-center px-4 py-6 text-sm text-base-content/60">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full items-start gap-2.5 sm:gap-3 border-b border-base-300 px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-colors last:border-0 ${
                      notification.read ? "bg-base-100" : "bg-primary/10"
                    }`}
                  >
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-base-200 text-sm font-semibold text-primary">
                      {notification.sender?.profilePic?.url ? (
                        <img
                          src={notification.sender.profilePic.url}
                          alt={notification.sender.username}
                          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover"
                        />
                      ) : (
                        notification.sender?.username?.[0]?.toUpperCase() || "U"
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-5 text-base-content">
                        {notification.type === "like" ? (
                          <span>
                            <span className="font-semibold">
                              {notification.sender?.username || "Someone"}
                            </span>{" "}
                            liked your entry
                          </span>
                        ) : notification.type === "comment" ? (
                          <span>
                            <span className="font-semibold">
                              {notification.sender?.username || "Someone"}
                            </span>{" "}
                            commented on your entry
                          </span>
                        ) : notification.type === "comment_reply" ? (
                          <span>
                            <span className="font-semibold">
                              {notification.sender?.username || "Someone"}
                            </span>{" "}
                            replied to your comment
                          </span>
                        ) : (
                          <span>
                            <span className="font-semibold">
                              {notification.sender?.username || "Someone"}
                            </span>{" "}
                            shared a new public entry
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-[11px] sm:text-xs text-base-content/60">
                        {/* {notification.entry?.title || "an entry"} •{" "} */}
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
