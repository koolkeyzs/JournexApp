import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PageTransition from '../Components/PageTransition'
import toast from 'react-hot-toast'
import api from '../api'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, LogIn } from 'lucide-react'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     setLoading(true)
    //     try {
    //         await api.post('/login', { username, password })
    //         toast.success('Welcome back! 🙏')
    //         setTimeout(() => {
    //             navigate('/dashboard')
    //         }, 1500)
    //     } catch (err) {
    //         toast.error('Incorrect username or password')
    //     } finally {
    //         setLoading(false)
    //     }
    // }


const [searchParams] = useSearchParams()
const redirectTo = searchParams.get('redirect') || '/dashboard'

const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
        await api.post('/login', { username, password })
        toast.success('Welcome back! 🙏')
        setTimeout(() => {
            navigate(redirectTo) // redirects back to where they were!
        }, 1500)
    } catch (err) {
        toast.error('Incorrect username or password')
    } finally {
        setLoading(false)
    }
}
    return (
        <PageTransition>
            <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
                <div className="card bg-base-100 shadow-xl w-full max-w-md">
                    <div className="card-body">

                        {/* Logo */}
                        <div className="flex flex-col items-center mb-6">
                            <BookOpen size={40} className="text-primary mb-2" />
                            <h1 className="text-3xl font-bold text-primary">Journex</h1>
                            <p className="text-base-content/50 text-sm mt-1">Welcome back, believer 🙏</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Username</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input input-bordered w-full  rounded-xl hover:border-primary focus:outline-none focus:border-primary transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input input-bordered w-full  rounded-xl hover:border-primary focus:outline-none focus:border-primary transition-all duration-200"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <LogIn size={18} />
                                        Login
                                    </span>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-base-content/50 mt-4">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:underline font-semibold">
                                Sign Up
                            </Link>
                        </p>

                        <p className="text-center text-sm text-base-content/50 mt-2">
    <Link to="/" className="text-primary hover:underline">
        ← Back to Home
    </Link>
</p>

                    </div>
                </div>
            </div>
        </PageTransition>
    )
}