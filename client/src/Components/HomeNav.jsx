import React from 'react'
import {BookOpen, NotebookPen} from 'lucide-react'
import { Link } from 'react-router-dom'


const HomeNav = () => {
  return (
    <div>
        <nav className='navbar bg-base-100 border-b shadow-sm px-6 border-base-content/10 fixed'>
        <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className='text-4xl text-primary flex font-bold gap-3'>
            <BookOpen size={40}/>
            Journex
            
            </h1>

            <div className='flex '>
        <Link to='/login' className='text-1xl font-bold btn btn-primary text-dark m-2'>
        <span>Login</span>

        </Link>
            
        <Link to='/register' className='text-1xl font-bold btn btn-primary text-dark m-2'>
        <span>Register</span>

        </Link>
            </div>
        </div>
        </div>
        </nav>
    </div>
  )
}

export default HomeNav