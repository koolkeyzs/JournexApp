import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import PageTransition from "../Components/PageTransition";
import SideBar from "../Components/Dashboard/sidebar";
import TopBar from "../Components/Dashboard/navbar";
import FeaturedSlideshow from "../Components/community/FeaturedSlideShow";
import CommunityPostCard from "../Components/community/CommunityPostCard";
import { Users } from "lucide-react";
import DailyRandVerse from "../Components/Dashboard/DailyRandVerse";

export default function CommunityFeed() {
  const [entries, setEntries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get("/dashboard/community", {
          withCredentials: true,
        });
        setEntries(data.entries);
        setCurrentUser(data.currentUser);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("You must be logged in!");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <PageTransition>
      <div className="flex">
        <SideBar currentUser={currentUser} />

        <div className="flex-1 md:ml-64">
          <TopBar currentUser={currentUser} />

          <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Community Feed
            </h1>

            {loading ? (
              <p className="text-gray-500">Loading community reflections...</p>
            ) : entries.length > 0 ? (
              <>
                <FeaturedSlideshow entries={entries} />

                <div className="mt-8">
                  {[...entries]
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
                    .map((entry) => (
                      <CommunityPostCard key={entry._id} entry={entry} currentUser={currentUser} />
                    ))}
                </div>

                  {/* Sidebar - 1/3 width on desktop, hidden on mobile (or shown below feed) */}
    
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="text-purple-200 mb-3" size={48} />
                <p className="text-gray-500">No community reflections yet.</p>
              </div>

              
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
