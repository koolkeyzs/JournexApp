import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import api from '../api'
import PageTransition from '../Components/PageTransition'

export default function PrivateEntries() {
    const [entries, setEntries] = useState([])

    useEffect(() => {
        async function fetchData() {
            const { data } = await api.get('/dashboard/community', {
                withCredentials: true
            })
            setEntries(data.entries)
        }
        fetchData()
    }, [])

    return (
        <PageTransition>
        <div className="flex flex-col items-center min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-6">Community Feed</h1>
            {entries.length === 0 && <p>No public entries yet.</p>}

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