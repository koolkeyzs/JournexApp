import { Link, useNavigate  } from 'react-router-dom'
import { BookOpen, PenLine, Tag, Users, Heart } from 'lucide-react'
import HomeNav from '../Components/HomeNav'
import PageTransition from '../Components/PageTransition'
import { useEffect, useState } from 'react'
import api from '../api'

export default function HomePage() {

const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data } = await api.get('/profile', {
                    withCredentials: true
                })
                setCurrentUser(data.user)
                navigate('/dashboard') // already logged in → go to dashboard
            } catch(err) {
                // not logged in → stay on homepage
            }
        }
        checkAuth()
    }, [])
  
    return (
      <PageTransition>
        <div className="min-h-screen bg-base-100">

           <HomeNav/>
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center px-6 py-20 md:py-32">
                <h2 className="text-4xl md:text-6xl font-bold text-base-content mb-4">
                    Faith. Community. Growth.
                </h2>
                <p className="text-base-content/60 text-lg md:text-xl max-w-xl mb-8">
                    A safe space for believers to journal their faith journey, share testimonies, encourage one another and grow together in God.
                </p>
                <div className="flex gap-4">
                    <Link to="/register" className="btn btn-primary btn-lg">Join the Community</Link>
                    <a href="#features" className="btn btn-outline btn-lg">Learn More</a>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 py-16 bg-base-200">
                <h3 className="text-3xl font-bold text-center mb-10 text-base-content">
                    ✨ What You Can Do
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    <div className="card bg-base-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
                        <PenLine size={32} className="text-primary" />
                        <p className="font-semibold">Journal Your Faith</p>
                        <p className="text-sm text-base-content/60">Write private devotions, prayers and reflections</p>
                    </div>
                    <div className="card bg-base-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
                        <Users size={32} className="text-primary" />
                        <p className="font-semibold">Share With Community</p>
                        <p className="text-sm text-base-content/60">Post public testimonies and encourage others</p>
                    </div>
                    <div className="card bg-base-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
                        <Heart size={32} className="text-primary" />
                        <p className="font-semibold">Encourage Others</p>
                        <p className="text-sm text-base-content/60">Comment and uplift fellow believers</p>
                    </div>
                    <div className="card bg-base-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
                        <Tag size={32} className="text-primary" />
                        <p className="font-semibold">Organize by Tags</p>
                        <p className="text-sm text-base-content/60">Find entries by faith, prayer, testimony and more</p>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="flex flex-col items-center justify-center text-center px-6 py-16">
                <div className="max-w-2xl">
                    <p className="text-2xl md:text-3xl font-serif italic text-base-content/70">
                        "And they overcame him by the blood of the Lamb and by the word of their testimony."
                    </p>
                    <p className="text-base-content/40 mt-4">— Revelation 12:11</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-base-content/10 px-8 py-6 text-center text-base-content/50 text-sm">
                <p>© 2026 Journex. Built for the body of Christ. 🙏</p>
            </footer>

        </div>
          </PageTransition>
    )
   
}