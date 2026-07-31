import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'
import PageTransition from '../Components/PageTransition'
import SideBar from '../Components/Dashboard/sidebar'
import { SquarePen, Camera, KeyRound, Calendar, Mail, User, Check, X } from 'lucide-react'

export default function ProfilePage() {
    const [profile, setProfile] = useState({})
    const [bio, setBio] = useState('')
    const [editingField, setEditingField] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [editingBio, setEditingBio] = useState(false)
    const [image, setImage] = useState('')
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const { data } = await api.get('/profile')
            setProfile(data.user)
        } catch(err) {
            toast.error('Please login first!')
            navigate('/login')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdateDetails = async (field) => {
        try {
            await api.put('/profile/update-details', {
                username: field === 'username' ? editValue : profile.username,
                email: field === 'email' ? editValue : profile.email
            })
            toast.success(`${field} updated!`)
            setEditingField(null)
            fetchData()
        } catch(err) {
            toast.error('Username or email already exist Try again!')
        }
    }

    const handleUpdateBio = async () => {
        try {
            await api.put('/profile/update', { bio })
            toast.success('Bio updated!')
            setEditingBio(false)
            fetchData()
        } catch(err) {
            toast.error('Something went wrong!')
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if(!file) return
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('profilePic', file)
            await api.post('/profile/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            toast.success('Profile picture updated!')
            fetchData()
        } catch(err) {
            toast.error('Something went wrong!')
        } finally {
            setUploading(false)
        }
    }

    const InlineEdit = ({ field, value, icon }) => (
        <div className="flex items-center gap-2 py-2">
            <span className="text-purple-400">{icon}</span>
            {editingField === field ? (
                <div className="flex items-center gap-2 flex-1">
                    <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 border border-purple-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
                        autoFocus
                    />
                    <button onClick={() => handleUpdateDetails(field)} className="text-green-500 hover:text-green-700">
                        <Check size={18} />
                    </button>
                    <button onClick={() => setEditingField(null)} className="text-red-400 hover:text-red-600">
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-700 text-sm">{value}</span>
                    <button
                        onClick={() => { setEditingField(field); setEditValue(value) }}
                        className="text-purple-400 hover:text-purple-600 ml-auto"
                    >
                        <SquarePen size={14} />
                    </button>
                </div>
            )}
        </div>
    )

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
            
            <div className="md:ml-64 min-h-screen bg-base-200 p-6">
                <div className="max-w-2xl mx-auto">

                    {/* Header */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">

                        {/* Avatar + Upload */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                {profile.profilePic?.url ? (
                                    <img src={profile.profilePic.url} className="w-24 h-24 rounded-full object-cover"
                                     onClick={() => setSelectedImage(profile.profilePic.url)}
                                     />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-3xl font-bold">
                                        {profile.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileRef.current.click()}
                                    className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-1.5 hover:bg-purple-700 transition"
                                >
                                    {uploading ? <span className="loading loading-spinner loading-xs"></span> : <Camera size={14} />}
                                </button>
                                <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} />
                            </div>
                            <h2 className="text-xl font-bold mt-3">{profile.username}</h2>
                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                <Calendar size={12} />
                                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Info fields */}
                        <div className="border border-gray-100 rounded-xl px-4 divide-y divide-gray-100">
                            <InlineEdit field="username" value={profile.username} icon={<User size={16} />} />
                            <InlineEdit field="email" value={profile.email} icon={<Mail size={16} />} />
                        </div>
                    </div>

                    {/* Bio Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800">About Me</h3>
                            {!editingBio && (
                                <button
                                    onClick={() => { setEditingBio(true); setBio(profile.bio || '') }}
                                    className="text-purple-400 hover:text-purple-600"
                                >
                                    <SquarePen size={16} />
                                </button>
                            )}
                        </div>

                        {editingBio ? (
                            <div className="flex flex-col gap-2">
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell the community about yourself..."
                                    rows={3}
                                    className="border border-purple-300 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 resize-none w-full"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditingBio(false)} className="btn btn-ghost btn-sm">Cancel</button>
                                    <button onClick={handleUpdateBio} className="btn btn-primary btn-sm">Save</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                {profile.bio || 'No bio yet. Click the edit icon to add one!'}
                            </p>
                        )}
                    </div>

                    {/* Security Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Security</h3>
                        <Link
                            to="/profile/change-password"
                            className="flex items-center gap-3 text-sm text-gray-700 hover:text-purple-600 transition"
                        >
                            <KeyRound size={16} className="text-purple-400" />
                            Change Password
                            <SquarePen size={14} className="ml-auto text-purple-400" />
                        </Link>
                    </div>

                </div>
            </div>
        </PageTransition>
    )
}