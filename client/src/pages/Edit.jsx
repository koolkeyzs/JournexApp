import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'
import PageTransition from '../Components/PageTransition'
import RichTextEditor from '../Components/RichTexteditor'
import MoodSelect from '../Components/moodselector'
import { Upload, BookOpen, Camera, X, Globe, Lock, Save } from 'lucide-react'

export default function EditPage() {
    const [title, setTitle] = useState('')
    const [verse, setVerse] = useState('')
    const [content, setContent] = useState('')
    const [mood, setMood] = useState('')
    const [existingImages, setExistingImages] = useState([])
    const [newImages, setNewImages] = useState([])
    const [newPreviews, setNewPreviews] = useState([])
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.get(`/entries/${id}/edit`)
                setTitle(data.entries.title)
                setContent(data.entries.content)
                setVerse(data.entries.verse || '')
                setMood(data.entries.mood || '')
                setTags(data.entries.tags || [])
                setIsPublic(data.entries.isPublic)
                setExistingImages(data.entries.images || [])
            } catch (err) {
                toast.error('Could not load entry')
                navigate('/dashboard')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const totalImageCount = existingImages.length + newImages.length

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files)
        if (totalImageCount + files.length > 4) {
            toast.error('Maximum 4 images per entry!')
            return
        }
        setNewImages(prev => [...prev, ...files])
        setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
    }

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index))
        setNewPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const removeExistingImage = async (filename) => {
        try {
            await api.delete(`/entries/${id}/images/${encodeURIComponent(filename)}`)
            setExistingImages(prev => prev.filter(img => img.filename !== filename))
            toast.success('Image removed')
        } catch (err) {
            toast.error('Could not remove image')
        }
    }

    const commitTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags(prev => [...prev, tagInput.trim()])
        }
        setTagInput('')
    }

    const addTag = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            commitTag()
        }
    }

    const removeTag = (tag) => {
        setTags(prev => prev.filter(t => t !== tag))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim()) {
            toast.error("Title is required")
            return
        }

        if (!content.trim() || content === "<p></p>") {
            toast.error("Content is required")
            return
        }

        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('entry[title]', title)
            formData.append('entry[content]', content)
            formData.append('entry[verse]', verse)
            formData.append('entry[mood]', mood)
            formData.append('entry[tags]', tags.join(','))
            formData.append('entry[isPublic]', isPublic)

            newImages.forEach(img => formData.append('image', img))

            await api.put(`/entries/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            toast.success('Entry updated!')
            navigate(`/entries/${id}`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <PageTransition>
            <div className="max-w-3xl mx-auto p-6">

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Entry</h1>
                    <p className="text-gray-500 text-sm mt-1">Update your reflection.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Cover image */}
                    <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-purple-50 border-2 border-dashed border-purple-200">
                        {existingImages[0]?.url ? (
                            <img src={existingImages[0].url} alt="Cover" className="w-full h-full object-cover" />
                        ) : newPreviews[0] ? (
                            <img src={newPreviews[0]} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                <div className="bg-purple-600 text-white p-3 rounded-full mb-3">
                                    <Upload size={20} />
                                </div>
                                <p className="font-medium text-gray-700">Add a cover image</p>
                                <p className="text-xs text-gray-400 mt-1">Click to upload or drag and drop</p>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                            </label>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your entry a title..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-400"
                        />
                    </div>

                    {/* Scripture */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <BookOpen size={15} className="text-purple-500" />
                            Scripture (Optional)
                        </label>
                        <input
                            value={verse}
                            onChange={(e) => setVerse(e.target.value)}
                            placeholder="Psalm 23:1"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-400"
                        />
                    </div>

                    {/* Journal */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Your Journal
                        </label>
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>

                    {/* Existing + New Photos */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Camera size={15} className="text-purple-500" />
                            Photos
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {totalImageCount < 4 && (
                                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:border-purple-300 hover:text-purple-500 transition">
                                    <span className="text-xl">+</span>
                                    <span className="text-[10px] mt-1">Add Photos</span>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                                </label>
                            )}

                            {existingImages.map((img) => (
                                <div key={img.filename} className="relative w-24 h-24 rounded-xl overflow-hidden">
                                    <img src={img.url} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img.filename)}
                                        className="absolute top-1 right-1 bg-white/90 rounded-full p-1"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {newPreviews.map((src, i) => (
                                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden">
                                    <img src={src} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(i)}
                                        className="absolute top-1 right-1 bg-white/90 rounded-full p-1"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mood + Tags + Visibility — all three in one row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        {/* Mood */}
                        <div className="border border-gray-100 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Mood</p>
                            <p className="text-xs text-gray-400 mb-3">How are you feeling?</p>
                            <MoodSelect mood={mood} setMood={setMood} />
                        </div>

                        {/* Tags */}
                        <div className="border border-gray-100 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Tags</p>
                            <p className="text-xs text-gray-400 mb-3">Add relevant tags</p>
                            <div className="flex gap-1.5 flex-wrap mb-2">
                                {tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)}>
                                            <X size={11} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={addTag}
                                onBlur={commitTag}
                                placeholder="Type a tag and press Enter..."
                                className="text-sm outline-none text-gray-500 w-full"
                            />
                        </div>

                        {/* Visibility */}
                        <div className="border border-gray-100 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Visibility</p>
                            <p className="text-xs text-gray-400 mb-3">Who can view this entry?</p>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(false)}
                                    className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg border-2 transition ${!isPublic ? 'border-purple-500 bg-purple-50' : 'border-gray-100'}`}
                                >
                                    <Lock size={15} className="text-purple-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Private</p>
                                        <p className="text-xs text-gray-400">Only you can see this</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(true)}
                                    className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg border-2 transition ${isPublic ? 'border-purple-500 bg-purple-50' : 'border-gray-100'}`}
                                >
                                    <Globe size={15} className="text-purple-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Community</p>
                                        <p className="text-xs text-gray-400">Share with the community</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Submit */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white font-medium py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
                        >
                            <Save size={16} />
                            {submitting ? 'Saving...' : 'Update Entry'}
                        </button>
                        <Link to={`/entries/${id}`} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-center">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </PageTransition>
    )
}