import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

// Intercept every response
api.interceptors.response.use(
    response => response,

    error => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname

            // Skip if already on login or home page
            if (currentPath === '/login' || currentPath === '/') {
                return Promise.reject(error)
            }

            // Skip logout/profile requests
            if (
                error.config?.url?.includes('/logout') ||
                error.config?.url?.includes('/profile')
            ) {
                return Promise.reject(error)
            }

            toast.error('You must be logged in!')
            window.location.href = `/login?redirect=${currentPath}`
        }

        if (error.response?.status === 403) {
            toast.error('You do not have permission!')
        }

        return Promise.reject(error)
    }
)

export default api