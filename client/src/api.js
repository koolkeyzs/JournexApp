// import axios from 'axios'

// const hostname = window.location.hostname // "localhost" on PC, "192.168.100.238" on phone

// const baseURL = hostname === "localhost" 
//   ? "http://localhost:3000" 
//   : `http://${hostname}:3000`

// const api = axios.create({
//   baseURL,
//   withCredentials: true,
// })

// export default api



import axios from 'axios'
import toast from 'react-hot-toast'

const hostname = window.location.hostname

const baseURL = hostname === "localhost" 
  ? "http://localhost:3000" 
  : `http://${hostname}:3000`

const api = axios.create({
  baseURL,
  withCredentials: true,
})

// intercept every response
api.interceptors.response.use(
    response => response,
    error => {
        if(error.response?.status === 401) {
            const currentPath = window.location.pathname
            
            // skip if already on login or home page
            if(currentPath === '/login' || currentPath === '/') {
                return Promise.reject(error)
            }

            // skip if it's a logout or profile check request
            if(error.config?.url?.includes('/logout') || 
               error.config?.url?.includes('/profile')) {
                return Promise.reject(error)
            }

            toast.error('You must be logged in!')
            window.location.href = `/login?redirect=${currentPath}`
        }
        if(error.response?.status === 403) {
            toast.error('You do not have permission!')
        }
        return Promise.reject(error)
    }
)

export default api