import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'
import PageTransition from '../Components/PageTransition'

export default function NewEntry(){
    const [newEntry, setNewEntry] = useState({
        title: '',
        content: '',
        verse: '',
        tags: '',
        isPublic: false
    })
    const [images, setImages] = useState([])
    const navigate = useNavigate()

    const handleChange = (e) => {
        setNewEntry(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

         if (!newEntry.title.trim() || !newEntry.content.trim() || !newEntry.verse.trim()) {
      toast.error("All fields are required");
      return;
    }
        try {
            const formData = new FormData()
            formData.append('entry[title]', newEntry.title)
            formData.append('entry[content]', newEntry.content)
            formData.append('entry[verse]', newEntry.verse)
            formData.append('entry[tags]', newEntry.tags)
            formData.append('entry[isPublic]', newEntry.isPublic)
            
            for(let img of images) {
                formData.append('image', img)
            }

            const { data } = await api.post('/entries', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            toast.success('Successfully created a new entry!')
            setTimeout(() => {
                navigate(`/entries/${data.id}`)
            }, 1500)

       } catch(err) {
    if(err.response) {
        toast.error(err.response.data.message) // catches Multer + Express errors
    } else {
        toast.error('Something went wrong!')
    }
}
    }

    
    return (
        <PageTransition>
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center">New Entry</h2>
                
                <input 
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newEntry.title}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                
                <textarea 
                    name="content"
                    placeholder="Content"
                    value={newEntry.content}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                
                <input 
                    type="text"
                    name="verse"
                    placeholder="Scripture verse"
                    value={newEntry.verse}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                
                <input 
                    type="text"
                    name="tags"
                    placeholder="Tags"
                    value={newEntry.tags}
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
                        checked={newEntry.isPublic}
                        onChange={(e) => setNewEntry(prev => ({...prev, isPublic: e.target.checked}))}
                    />
                    <label>Make this entry public</label>
                </div>

                <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Create Entry
                </button>
            </form>
        </div>
        </PageTransition>
    )
}