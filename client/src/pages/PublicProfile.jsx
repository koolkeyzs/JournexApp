import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import PageTransition from '../Components/PageTransition'
import SideBar from '../Components/Dashboard/sidebar'
import CommunityPostCard from '../Components/Community/CommunityPostCard'
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

                {selectedImage && (
                    <div
                      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                      onClick={() => setSelectedImage(null)}
                    >
                      <div className="relative max-w-4xl w-full">
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-2 right-2 bg-white/20 text-white rounded-full p-1 hover:bg-white/40 z-10"
                        >
                          <X size={20} />
                        </button>
                        <img
                          src={selectedImage}
                          className="w-full max-h-[90vh] object-contain rounded-xl"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  )}

                <div className="flex-1 md:ml-64 p-6 max-w-2xl mx-auto">

                    {/* Profile header — read-only */}
                    <div className="flex items-center gap-4 mb-4">
                        {profileUser.profilePic?.url ? (
                            <img src={profileUser.profilePic.url} className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                             onClick={() => setSelectedImage(profileUser.profilePic.url)}
                             />
                            
                        ) : (
                            <div className="
            
                            w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
        
                                {profileUser.username?.charAt(0).toUpperCase()}
                                
                            </div>
                        )}
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{profileUser.username}</h1>
                            {profileUser.bio && (
                                <p className="text-sm text-gray-500 mt-1">{profileUser.bio}</p>
                            )}
                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                <Calendar size={12} />
                                <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                            </div>

                             {profileUser.email && (
        <p className="text-xs text-gray-500 mt-1">{profileUser.email}</p>
    )}
                           
                        </div>
                    </div>

                    {/* Tag / button to reveal entries */}
                    <button
                        onClick={() => setShowEntries(true)}
                        className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-purple-100 transition"
                    >
                        <BookOpen size={15} />
                        See {profileUser.username}'s entries ({entries.length})
                    </button>

                </div>
            </div>

            {/* Modal — pops up with their public entries */}
            {showEntries && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowEntries(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-gray-800">
                                {profileUser.username}'s Public Reflections
                            </h2>
                            <button onClick={() => setShowEntries(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {entries.length > 0 ? (
                            entries.map(entry => (
                                <CommunityPostCard key={entry._id} entry={{ ...entry, author: profileUser }} currentUser={currentUser} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-8">No public reflections yet.</p>
                        )}
                    </div>
                </div>
            )}
        </PageTransition>
    )
}