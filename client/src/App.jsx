import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboardPage";
import Login from "./pages/LoginPage";
import PrivateEntries from "./pages/PrivateEntries";
import CommunityFeed from "./pages/CommunityEntries";
import Register from "./pages/registerPage";
import toast from "react-hot-toast";
import ShowPage from "./pages/Showpage";
import NewEntry from "./pages/NewEntry";
import EditPage from "./pages/Edit";
import ProfilePage from "./pages/UserProfile";
import HomePage from "./pages/HomePage";
import { AnimatePresence } from "framer-motion";
import ChangePassword from "./pages/ChangePassword";
import PublicProfile from "./pages/PublicProfile";
import WhatsNewPage from "./pages/Roadmap";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import MyReports from "./pages/Myreports";
import AdminEntries from "./pages/AdminEntries";
import AdminComments from "./pages/AdminComments";
import AdminAnnouncement from "./pages/AdminAnnouncement";
// import EditComment from "./pages/EditComment";

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/private" element={<PrivateEntries />} />
        <Route path="/dashboard/community" element={<CommunityFeed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/entries/:id" element={<ShowPage />} />
        <Route path="/entries" element={<NewEntry />} />
        <Route path="/entries/:id/edit" element={<EditPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:id" element={<PublicProfile />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        <Route path="/roadmap" element={<WhatsNewPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/admin/entries" element={<AdminEntries />} />
        <Route path="/admin/comments" element={<AdminComments />} />
        <Route path="/admin/announcements" element={<AdminAnnouncement />} />
        {/* <Route path="/entries/:commentId/editComment" element={<EditComment/>} /> */}
      </Routes>
    </AnimatePresence>
  );
}
