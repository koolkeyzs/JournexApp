import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import PageTransition from "../Components/PageTransition";
import SideBar from "../Components/Dashboard/sidebar";
import {
  SquarePen,
  Camera,
  KeyRound,
  Calendar,
  Mail,
  User,
  Check,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [bio, setBio] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const { data } = await api.get("/profile");
      setProfile(data.user);
    } catch (err) {
      toast.error("Please login first!");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleUpdateDetails = async (field) => {
    try {
      await api.put("/profile/update-details", {
        username: field === "username" ? editValue : profile.username,
        email: field === "email" ? editValue : profile.email,
      });

      toast.success(`${field} updated!`);
      setEditingField(null);
      fetchData();
    } catch (err) {
      toast.error("Username or email already exists!");
    }
  };

  const handleUpdateBio = async () => {
    try {
      await api.put("/profile/update", { bio });

      toast.success("Bio updated!");
      setEditingBio(false);
      fetchData();
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      await api.post("/profile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile picture updated!");
      fetchData();
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  const InlineEdit = ({ field, value, icon }) => (
    <div className="flex items-center gap-2 py-3">
      <span className="text-primary">{icon}</span>

      {editingField === field ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 input input-bordered input-sm"
            autoFocus
          />

          <button
            onClick={() => handleUpdateDetails(field)}
            className="text-success hover:scale-110 transition"
          >
            <Check size={18} />
          </button>

          <button
            onClick={() => setEditingField(null)}
            className="text-error hover:scale-110 transition"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-base-content">
            {value}
          </span>

          <button
            onClick={() => {
              setEditingField(field);
              setEditValue(value);
            }}
            className="ml-auto text-primary hover:scale-110 transition"
          >
            <SquarePen size={15} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <PageTransition>
      <SideBar currentUser={profile} />

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 btn btn-circle btn-sm"
            >
              <X size={18} />
            </button>

            <img
              src={selectedImage}
              alt="Profile"
              className="w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="md:ml-64 min-h-screen bg-base-200 p-6">
        <div className="max-w-2xl mx-auto">

          <h1 className="text-3xl font-bold text-base-content text-center mb-6">
            My Profile
          </h1>

          {/* Profile */}
          <div className="card bg-base-100 shadow-sm mb-5">
            <div className="card-body">

              <div className="flex flex-col items-center mb-6">
                <div className="relative">

                  {profile.profilePic?.url ? (
                    <img
                      src={profile.profilePic.url}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(profile.profilePic.url)}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
                      {profile.username?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <button
                    onClick={() => fileRef.current.click()}
                    className="absolute bottom-0 right-0 btn btn-primary btn-circle btn-xs"
                  >
                    {uploading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <Camera size={14} />
                    )}
                  </button>

                  <input
                    type="file"
                    ref={fileRef}
                    className="hidden"
                    onChange={handleUpload}
                  />
                </div>

                <h2 className="text-xl font-bold mt-3 text-base-content">
                  {profile.username}
                </h2>

                <div className="flex items-center gap-2 text-base-content/60 text-xs mt-1">
                  <Calendar size={12} />
                  <span>
                    Joined{" "}
                    {profile.createdAt &&
                      new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border border-base-300 rounded-xl px-4 divide-y divide-base-300">
                <InlineEdit
                  field="username"
                  value={profile.username}
                  icon={<User size={16} />}
                />

                <InlineEdit
                  field="email"
                  value={profile.email}
                  icon={<Mail size={16} />}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="card bg-base-100 shadow-sm mb-5">
            <div className="card-body">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-base-content">
                  About Me
                </h3>

                {!editingBio && (
                  <button
                    onClick={() => {
                      setEditingBio(true);
                      setBio(profile.bio || "");
                    }}
                    className="text-primary"
                  >
                    <SquarePen size={16} />
                  </button>
                )}
              </div>

              {editingBio ? (
                <>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Tell everyone about yourself..."
                    className="textarea textarea-bordered w-full"
                  />

                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setEditingBio(false)}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleUpdateBio}
                      className="btn btn-primary btn-sm"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-base-content/70 text-sm">
                  {profile.bio ||
                    "No bio yet. Click the edit icon to add one!"}
                </p>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="font-semibold text-base-content mb-3">
                Security
              </h3>

              <Link
                to="/profile/change-password"
                className="flex items-center gap-3 text-base-content hover:text-primary transition"
              >
                <KeyRound size={16} className="text-primary" />
                Change Password
                <SquarePen size={14} className="ml-auto text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}