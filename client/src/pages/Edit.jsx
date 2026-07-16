import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import api from '../api'

export default function EditPage(){
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        verse: '',
        tags: '',
        isPublic: false
    })
    const [images, setImages] = useState([])
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            const { data } = await api.get(`/entries/${id}/edit`, {
                withCredentials: true
            })
            setFormData({
                title: data.entries.title,
                content: data.entries.content,
                verse: data.entries.verse,
                tags: data.entries.tags,
                isPublic: data.entries.isPublic
            })
        }
        fetchData()
    }, [])

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const form = new FormData()
            form.append('entry[title]', formData.title)
            form.append('entry[content]', formData.content)
            form.append('entry[verse]', formData.verse)
            form.append('entry[tags]', formData.tags)
            form.append('entry[isPublic]', formData.isPublic)
            
            for(let img of images) {
                form.append('image', img)
            }

            await axios.put(`http://localhost:3000/entries/${id}`, form, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            toast.success('Entry updated!')
            navigate(`/entries/${id}`)
        } catch(err) {
            if(err.response) {
                toast.error(err.response.data.message)
            } else {
                toast.error('Something went wrong!')
            }
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center">Edit Entry</h2>
                
                <input 
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                
                <textarea 
                    name="content"
                    placeholder="Content"
                    value={formData.content}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                
                <input 
                    type="text"
                    name="verse"
                    placeholder="Scripture verse"
                    value={formData.verse}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                
                <input 
                    type="text"
                    name="tags"
                    placeholder="Tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />

                <input 
                    type="file"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    className="border rounded-lg px-4 py-2"
                />

                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({...prev, isPublic: e.target.checked}))}
                    />
                    <label>Make this entry public</label>
                </div>

                <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Update Entry
                </button>
            </form>
        </div>
    )
}