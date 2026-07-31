import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageTransition from "../Components/PageTransition";
import api from "../api";
import { BookOpen, Lock, Users, PlusCircle, LogOut, User } from "lucide-react";
import SideBar from "../Components/Dashboard/sidebar";
import TopBar from "../Components/Dashboard/navbar";
import DailyRandVerse from "../Components/Dashboard/DailyRandVerse";
import RecentEntries from "../Components/Dashboard/RecentEntriesLogic";
import ContinueDraft from "../Components/Dashboard/Draft";
import TrendingCommunity from "../Components/Dashboard/TrendingComm";


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
        if (err.response.status === 401) {
          toast.error("You must be logged in!");
          navigate("/login");
        }
      }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    await api.get("/logout", { withCredentials: true });
    toast.success("Goodbye! 🙏");
   window.location.href = '/';
  };

  return (
    <PageTransition>
      <div className="flex">
        <SideBar currentUser={currentUser} />

        <div className="flex-1 md:ml-64">
          <TopBar currentUser={currentUser} />

         <div className="p-6">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Verse — 1st on mobile, top-right on desktop */}
    <div className="order-1 lg:order-0 lg:col-start-3 lg:row-start-1">
      <DailyRandVerse currentUser={currentUser} />
    </div>

    {/* Draft — 2nd on mobile, top-left on desktop */}
    <div className="order-2 lg:order-0 lg:col-start-1 lg:col-span-2 lg:row-start-1">
      <ContinueDraft hasDraft={false} />
    </div>

    {/* Trending — 3rd on mobile, bottom-right on desktop */}
    <div className="order-3 lg:order-0 lg:col-start-3 lg:row-start-2">
      <TrendingCommunity communityEntries={communityEntries}  currentUser={currentUser} />
    </div>

    {/* Recent Entries — 4th on mobile, bottom-left on desktop */}
    <div className="order-4 lg:order-0 lg:col-start-1 lg:col-span-2 lg:row-start-2">
      <RecentEntries personalEntry={personalEntry} />
    </div>

  </div>
</div>
        </div>
      </div>
    </PageTransition>
  );
}