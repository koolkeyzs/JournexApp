import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { link } from 'joi'
import api from '../api'
import PageTransition from '../Components/PageTransition'

export default function ShowPage() {
    const [entry, setEntry] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [comment, setComment] = useState('')
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3000/entries/${id}`, {
                withCredentials: true
            })
            setEntry(data.entries)
            setCurrentUser(data.currentUser)
        } catch(err) {
            console.log('error:', err) 
            toast.error('Entry not found!')
            navigate('/dashboard')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/entries/${id}`, {
                withCredentials: true
            })
            toast.success('Entry deleted!')
            navigate('/dashboard')
        } catch(err) {
            toast.error(err.response.data.message)
        }
    }

    const handleComment = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`http://localhost:3000/entries/${id}/comments`,
                { comment: { text: comment } },
                { withCredentials: true }
            )
            toast.success('Comment added!')
            setComment('')
            fetchData()
        } catch(err) {
            toast.error(err.response.data.message)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/entries/${id}/comments/${commentId}`,
                { withCredentials: true }
            )
            toast.success('Comment deleted!')
            fetchData()
        } catch(err) {
            toast.error(err.response.data.message)
        }
    }

    if(!entry) return <p>Loading...</p>

    return (
        <PageTransition>
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold">{entry.title}</h1>
            <p className="text-gray-600 mt-2">{entry.content}</p>
            <p className="text-indigo-500 italic mt-2">{entry.verse}</p>

            {/* Images */}
            {entry.images && entry.images.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                    {entry.images.map((img, i) => (
                        <img key={i} src={img.url} className="w-full rounded-lg mb-2" />
                    ))}
                </div>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                    {entry.tags.map((tag, i) => (
                        <span key={i} className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
                            #{tag.toUpperCase()}
                        </span>
                    ))}
                </div>
            )}

            {/* Author */}
            {entry.author && (
                 <p className="text-gray-400 text-sm mt-3">
               Posted by: <span className="font-semibold">{entry.author.username}</span>
                </p>
                
            )}

            {/* Author actions - only entry owner */}
            {currentUser && entry.author && entry.author._id === currentUser._id && (
                <div className="flex gap-3 mt-4">
                    <Link to={`/entries/${entry._id}/edit`} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Edit
                    </Link>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                        Delete
                    </button>
                </div>
            )}

            {/* Comments - only if public */}
            {entry.isPublic && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3">Comments</h3>

                    {/* Comment form - only logged in users */}
                    {currentUser && (
                        <form onSubmit={handleComment}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Leave a comment..."
                                className="border rounded-lg w-full p-2 mt-2"
                            />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
                                Submit
                            </button>
                        </form>
                    )}

                    {/* Comments list */}
                    {entry.comment.map(c => (
                        <div key={c._id} className="border rounded-lg p-3 mt-2">
                            <p className="font-semibold">{c.author.username}</p>
                            <p>{c.text}</p>
                            {/* Delete comment - only comment owner */}
                            {currentUser && c.author && c.author._id === currentUser._id && (
                                <button 
                                    onClick={() => handleDeleteComment(c._id)}
                                    className="text-red-500 text-sm mt-1 hover:underline">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Link to="/dashboard" className="text-blue-500 hover:underline mt-4 block">
                Back to Dashboard
            </Link>
        </div>
        </PageTransition>
    )
}