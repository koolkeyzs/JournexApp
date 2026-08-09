import { Link, useNavigate } from 'react-router-dom'
import { PenLine, Tag, Users, Heart, Quote, ArrowRight } from 'lucide-react'
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
        const { data } = await api.get('/profile', { withCredentials: true })
        setCurrentUser(data.user)
        navigate('/dashboard')
      } catch (err) {
        // not logged in → stay on homepage
      }
    }
    checkAuth()
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen bg-base-100">

        <HomeNav />

        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 -translate-x-1/3" />

          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full mb-6">
              Your journal, your community
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-base-content mb-6 leading-tight">
              Faith. Community. <span className="text-primary">Growth.</span>
            </h1>

            <p className="text-base-content/60 text-lg md:text-xl max-w-xl mx-auto mb-10">
              A safe space for believers to journal their faith journey, share testimonies,
              and grow together in God.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg gap-2">
                Join the Community
                <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn btn-outline btn-lg">
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* Features — bento grid */}
        <section id="features" className="px-6 py-20 bg-base-200">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-base-content mb-3">
              What you can do
            </h2>
            <p className="text-center text-base-content/60 mb-12">
              Everything you need to reflect, connect, and grow.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

              {/* Large featured tile */}
              <div className="md:col-span-4 md:row-span-2 bg-base-100 rounded-2xl p-8 flex flex-col justify-between">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <PenLine size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content mb-2">
                    Journal your faith
                  </h3>
                  <p className="text-base-content/60">
                    Write private devotions, prayers, and reflections — capture your walk with God, one entry at a time.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 bg-base-100 rounded-2xl p-6">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Users size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-base-content mb-1">Share with community</h3>
                <p className="text-sm text-base-content/60">Post public testimonies and encourage others.</p>
              </div>

              <div className="md:col-span-2 bg-base-100 rounded-2xl p-6">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Heart size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-base-content mb-1">Encourage others</h3>
                <p className="text-sm text-base-content/60">Comment and uplift fellow believers.</p>
              </div>

              <div className="md:col-span-6 bg-base-100 rounded-2xl p-6 flex items-center gap-4">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content mb-0.5">Organize by tags</h3>
                  <p className="text-sm text-base-content/60">Find entries by faith, prayer, testimony, and more.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="px-6 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Quote className="text-primary/30 mx-auto mb-4" size={36} />
            <p className="text-2xl md:text-3xl font-serif italic text-base-content/80 leading-relaxed">
              And they overcame him by the blood of the Lamb and by the word of their testimony.
            </p>
            <p className="text-primary font-medium mt-4">— Revelation 12:11</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-base-300 px-8 py-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/JournexLogo.png" alt="Journex logo" className="h-6 object-contain" />
              <span className="font-semibold text-base-content">Journex</span>
            </div>
            <p className="text-base-content/50 text-sm">
              © 2026 Journex. Built for the body of Christ.
            </p>
          </div>
        </footer>

      </div>
    </PageTransition>
  )
}