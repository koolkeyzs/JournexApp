import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'
import PageTransition from '../Components/PageTransition'
import SideBar from '../Components/Dashboard/sidebar'
import TopBar from '../Components/Dashboard/navbar'
import GridEntryCard from '../Components/privateGrid'
import { BookOpen } from 'lucide-react'

export default function PrivateEntries() {
    const [entries, setEntries] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.get('/dashboard/private', {
                    withCredentials: true
                })
                setEntries(data.entries)
                setCurrentUser(data.currentUser)
            } catch(err) {
                if(err.response?.status === 401) {
                    toast.error('You must be logged in!')
                    navigate('/login')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    return (
        <PageTransition>
            <div className="flex">
                <SideBar currentUser={currentUser} />

                <div className="flex-1 md:ml-64">
                    <TopBar currentUser={currentUser} />

                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Journal</h1>

                        {loading ? (
                            <p className="text-gray-500">Loading your reflections...</p>
                        ) : sortedEntries.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {sortedEntries.map(entry => (
                                    <GridEntryCard key={entry._id} entry={entry} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <BookOpen className="text-purple-200 mb-3" size={48} />
                                <p className="text-gray-500">No entries yet — start your first reflection.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}