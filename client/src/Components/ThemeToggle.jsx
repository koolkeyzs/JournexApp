import { useState, useEffect } from "react";
import {Moon, Sun} from 'lucide-react'


export default function ThemeToggle(){
const [theme , setTheme] = useState(()=>{
    return localStorage.getItem('theme' || 'light')
})


useEffect(()=>{
    document.documentElement.setAttribute('data-theme' , theme)
    localStorage.setItem('theme' , theme)
} , [theme])


const toggleTheme = ()=>{
    setTheme(theme === 'light' ? 'dark' : 'light')
}

return(
    <button
    onClick={toggleTheme}
    className="btn btn-ghost btn-circle"
    >

        {theme ==='light'? <Moon/> : <Sun/>}
        
    </button>
)
}


