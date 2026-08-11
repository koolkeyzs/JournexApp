import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageTransition from "../Components/PageTransition";
import api from "../api";

import SideBar from "../Components/Dashboard/sidebar";
import TopBar from "../Components/Dashboard/navbar";
import DailyRandVerse from "../Components/Dashboard/DailyRandVerse";
import RecentEntries from "../Components/Dashboard/RecentEntriesLogic";
import ContinueDraft from "../Components/Dashboard/Draft";
import TrendingCommunity from "../Components/Dashboard/TrendingComm";
import AnnouncementBanner from "../Components/admin/AnnouncementBanner";

export default function Dashboard() {
  const [personalEntry, setPersonalEntry] = useState([]);
  const [communityEntries, setCommunityEntries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get("/dashboard", {
          withCredentials: true,
        });

        setPersonalEntry(data.personalEntry);
        setCommunityEntries(data.communityEntries);
        setCurrentUser(data.currentUser);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("You must be logged in!");
          navigate("/login");
        }
      }
    }

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <PageTransition>
      <div className="flex bg-base-200 min-h-screen">
        <SideBar currentUser={currentUser} />

        <div className="flex-1 md:ml-64">
          <TopBar currentUser={currentUser} />

          <AnnouncementBanner />

          <main className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Verse */}
              <div className="order-1 lg:order-0 lg:col-start-3 lg:row-start-1">
                <DailyRandVerse currentUser={currentUser} />
              </div>

              {/* Continue Draft */}
              <div className="order-2 lg:order-0 lg:col-start-1 lg:col-span-2 lg:row-start-1">
                <ContinueDraft hasDraft={false} />
              </div>

              {/* Trending */}
              <div className="order-3 lg:order-0 lg:col-start-3 lg:row-start-2">
                <TrendingCommunity
                  communityEntries={communityEntries}
                  currentUser={currentUser}
                />
              </div>

              {/* Recent Entries */}
              <div className="order-4 lg:order-0 lg:col-start-1 lg:col-span-2 lg:row-start-2">
                <RecentEntries personalEntry={personalEntry} />
              </div>
            </div>
          </main>
        </div>

      </div>
    </PageTransition>
  );
}
