import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'
import PageTransition from '../Components/PageTransition'

export default function PrivateEntries() {
    const [entries, setEntries] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.get('/dashboard/private', {
                    withCredentials: true 
                })
                setEntries(data.entries)
            } catch(err) {
                if(err.response.status === 401) {
                    toast.error('You must be logged in!')
                    navigate('/login')
                }
            }
        }
        fetchData()
    }, [])

    return (
        <PageTransition>
        <div className="flex flex-col items-center min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-6">My Private Entries</h1>
            {entries.map(entry => (
                <div key={entry._id} className="border rounded-lg p-4 mb-3 w-full max-w-lg">
                    <h2 className="text-xl font-semibold">{entry.title}</h2>
                    <p className="text-gray-500">{entry.verse}</p>
                    <Link to={`/entries/${entry._id}`} className="text-blue-500 hover:underline">
                        View Entry
                    </Link>
                </div>
            ))}
        </div>
        </PageTransition>
    )
}