import React from 'react'
import { useState } from 'react'


const SideBar = () => {
    const [isOpen , setIsOpen] = useState(false)
  return (
    <div>
        <aside className='w-64 min-h-screen bg-base-300 p-5  '>

        </aside>
    </div>
  )
}

export default SideBar