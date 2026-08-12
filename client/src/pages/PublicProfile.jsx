import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import PageTransition from '../Components/PageTransition'
import SideBar from '../Components/Dashboard/sidebar'
import CommunityPostCard from '../Components/community/CommunityPostCard'
import { Calendar, BookOpen, X } from 'lucide-react'

export default function PublicProfile() {
    const [profileUser, setProfileUser] = useState(null)
    const [entries, setEntries] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
        const [selectedImage, setSelectedImage] = useState(null);
    const [showEntries, setShowEntries] = useState(false)
    const { id } = useParams()



      


    

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.get(`/users/${id}`)
                setProfileUser(data.user)
                setEntries(data.publicEntries)
                setCurrentUser(data.currentUser)  
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    if (!profileUser) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">User not found</p>
        </div>
    )

    return (
       <PageTransition>
  <div className="flex">
    <SideBar currentUser={currentUser} />

    {/* Image Lightbox */}
    {selectedImage && (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div className="relative max-w-4xl w-full animate-in fade-in zoom-in duration-300">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 right-3 btn btn-circle btn-sm btn-error z-10"
          >
            <X size={18} />
          </button>

          <img
            src={selectedImage}
            className="w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    )}

    <div className="flex-1 md:ml-64 bg-base-200 min-h-screen p-6">

      <div className="max-w-2xl mx-auto">

        {/* PROFILE CARD */}

        <div className="bg-base-100 border border-base-300 rounded-3xl shadow-xl p-6 mb-8">

          <div className="flex items-center gap-5">

            {/* Avatar */}

            <div className="relative group">

              {profileUser.profilePic?.url ? (
                <img
                  src={profileUser.profilePic.url}
                  onClick={() => setSelectedImage(profileUser.profilePic.url)}
                  className="
                  w-20
                  h-20
                  rounded-full
                  object-cover
                  cursor-pointer
                  ring
                  ring-primary/20
                  group-hover:ring-primary
                  transition-all
                  duration-300
                  shadow-md
                  "
                />
              ) : (
                <div
                  className="
                  w-20
                  h-20
                  rounded-full
                  bg-primary
                  text-primary-content
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-bold
                  shadow-lg
                  "
                >
                  {profileUser.username?.charAt(0).toUpperCase()}
                </div>
              )}

            </div>

            {/* User Info */}

            <div className="flex-1">

              <h1 className="text-3xl font-bold text-base-content">
                {profileUser.username}
              </h1>

              {profileUser.bio && (
                <p className="text-base-content/70 mt-2 leading-relaxed">
                  {profileUser.bio}
                </p>
              )}

              <div className="flex items-center gap-2 text-base-content/50 text-xs mt-3">
                <Calendar size={13} />
                Joined{" "}
                {new Date(profileUser.createdAt).toLocaleDateString()}
              </div>

              {profileUser.email && (
                <p className="text-sm text-base-content/60 mt-1">
                  {profileUser.email}
                </p>
              )}

            </div>

          </div>

          {/* Button */}

          <div className="mt-6">

            <button
              onClick={() => setShowEntries(true)}
              className="
              btn
              btn-primary
              rounded-full
              shadow-md
              hover:shadow-xl
              transition-all
              "
            >
              <BookOpen size={17} />
              See {profileUser.username}'s Entries ({entries.length})
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>

  {/* MODAL */}

  {showEntries && (

    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowEntries(false)}
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="
        bg-base-100
        border
        border-base-300
        rounded-3xl
        shadow-2xl
        w-full
        max-w-lg
        max-h-[80vh]
        overflow-y-auto
        p-6
        animate-in
        fade-in
        zoom-in
        duration-300
        "
      >

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-bold text-base-content">
            {profileUser.username}'s Public Reflections
          </h2>

          <button
            onClick={() => setShowEntries(false)}
            className="
            btn
            btn-circle
            btn-ghost
            btn-sm
            text-error
            "
          >
            <X size={18} />
          </button>

        </div>

        {entries.length > 0 ? (

          entries.map((entry) => (
            <CommunityPostCard
              key={entry._id}
              entry={{ ...entry, author: profileUser }}
              currentUser={currentUser}
            />
          ))

        ) : (

          <div className="text-center py-12">

            <BookOpen
              size={45}
              className="mx-auto text-base-content/20 mb-3"
            />

            <p className="text-base-content/60">
              No public reflections yet.
            </p>

          </div>

        )}

      </div>

    </div>

  )}

</PageTransition>
    )
}