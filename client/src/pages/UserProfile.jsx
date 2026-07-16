import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate , useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'



export default function ProfilePage (){
    const [profile , setProfile] = useState({
        email: '',
        createdAt: ''
    })
    const [bio, setBio] = useState('')



    const [image , setImage] = useState('')
    const navigate = useNavigate()


   const fetchData = async () => {
    try {
        const { data } = await api.get('/profile', {
            withCredentials: true
        })
        setProfile(data.user) // removed setBio from here
    } catch(err) {
        toast.error('Please login first!')
        navigate('/login')
    }
}

useEffect(() => {
    async function load() {
        try {
            const { data } = await api.get('/profile', {
                withCredentials: true
            })
            setProfile(data.user)
           
        } catch(err) {
            toast.error('Please login first!')
            navigate('/login')
        }
    }
    load()
}, [])


const handleUpload = async (e) => {
    e.preventDefault()
    try {
        const formData = new FormData()
        formData.append('profilePic', image)
        await api.post('/profile/upload', formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Profile picture updated!')
        fetchData() // refetch to show new pic
    } catch(err) {
        toast.error('Something went wrong!')
    }
}

const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
        await api.put('/profile/update', 
            { bio:bio },
            { withCredentials: true }
        )
        toast.success('Profile updated!')
        setBio('')
        fetchData()
    } catch(err) {
        toast.error('Something went wrong!')
    }
}

return (
    <div className="flex flex-col items-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        {/* Profile pic */}
        {profile.profilePic && profile.profilePic.url ? (
            <img src={profile.profilePic.url} className="w-32 h-32 rounded-full object-cover mb-4" />
        ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <p className="text-gray-500">No photo</p>
            </div>
        )}

        {/* User info */}
        <p className="text-xl font-semibold">{profile.username}</p>
        <p className="text-gray-500">{profile.email}</p>
        <p className="text-gray-400 text-sm">Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>

{/* Display bio */}
{profile.bio && (
    <p className="text-gray-600 mt-4 text-center">{profile.bio}</p>
)}


<form onSubmit={handleUpdateProfile} className="flex flex-col gap-3 mt-4">
    <textarea 
        name="bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself..."
        className="border rounded-lg p-2 w-full"
    />
    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
        Update Bio
    </button>
</form>


      

        {/* Upload form */}
        <form onSubmit={handleUpload} className="flex flex-col gap-3 mt-6">
            <input 
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="border rounded-lg p-2"
            />
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Update Profile Picture
            </button>
        </form>
    </div>
)
        
            
}

