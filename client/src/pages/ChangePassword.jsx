import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'
import PageTransition from '../Components/PageTransition'
import SideBar from '../Components/Dashboard/sidebar'
import { KeyRound, Eye, EyeOff, ArrowLeft } from 'lucide-react'





 const PasswordInput = ({ value, onChange, placeholder, show, onToggle }) => (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 pr-10"
                required
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    )



export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(newPassword !== confirmPassword) {
            toast.error('New passwords do not match!')
            return
        }

        if(newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!')
            return
        }

        setLoading(true)
        try {
            await api.put('/profile/change-password', {
                oldPassword,
                newPassword
            })
            toast.success('Password changed successfully!')
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
            navigate('/profile')
        } catch(err) {
            toast.error(err.response?.data?.message || 'Failed to change password!')
        } finally {
            setLoading(false)
        }
    }

   
    return (
        <PageTransition>
            <SideBar />
            <div className="md:ml-64 min-h-screen bg-base-200 p-6">
                <div className="max-w-md mx-auto">

                    {/* Back button */}
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm mb-6 transition"
                    >
                        <ArrowLeft size={16} />
                        Back to Profile
                    </Link>

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-100 p-2 rounded-full">
                                <KeyRound size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Change Password</h1>
                                <p className="text-xs text-gray-400">Keep your account secure</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {/* Old Password */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                    Current Password
                                </label>
                                <PasswordInput
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    show={showOld}
                                    onToggle={() => setShowOld(!showOld)}
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                    New Password
                                </label>
                                <PasswordInput
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    show={showNew}
                                    onToggle={() => setShowNew(!showNew)}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                    Confirm New Password
                                </label>
                                <PasswordInput
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    show={showConfirm}
                                    onToggle={() => setShowConfirm(!showConfirm)}
                                />
                                {/* Match indicator */}
                                {confirmPassword && (
                                    <p className={`text-xs mt-1 ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                        {newPassword === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full mt-2"
                            >
                                {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Change Password'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}