import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageTransition from '../Components/PageTransition'
import api from '../api'
import { BookOpen, Lock, Users, PlusCircle, LogOut, User } from 'lucide-react'
import SideBar from '../Components/Dashboard/sidebar'

export default function Dashboard() {
  const [personalEntry, setPersonalEntry] = useState([])
  const [communityEntries, setCommunityEntries] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get('/dashboard', {
            withCredentials: true 
        })
        setPersonalEntry(data.personalEntry)
        setCommunityEntries(data.communityEntries)
        setCurrentUser(data.currentUser)
      } catch(err) {
        if(err.response.status === 401) {
            toast.error('You must be logged in!')
            navigate('/login')
        }
      }
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await api.get('/logout', { withCredentials: true })
    toast.success('Goodbye! 🙏')
    navigate('/')
  }

  return (
    <PageTransition>
      
        <SideBar/>

    </PageTransition>
  )
}