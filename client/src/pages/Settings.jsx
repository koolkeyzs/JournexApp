import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api'
import PageTransition from '../Components/PageTransition'
import SideBar from '../Components/Dashboard/sidebar'
import TopBar from '../Components/Dashboard/navbar'

import {
    Settings,
    User,
    Bell,
    LogOut,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react'

import { subscribeToPush } from '../utils/pushNotification'

function SettingsPage() {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(null)

    const [statusLoading, setStatusLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [enabled, setEnabled] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState(false)

    // Load current push status on mount
    useEffect(() => {
        async function checkStatus() {
            try {
                const { data } = await api.get('/notifications/status')
                setEnabled(data.enabled)
            } catch (err) {
                console.error('Notification status error:', err)
            } finally {
                setStatusLoading(false)
            }
        }
        checkStatus()
    }, [])

    const handleEnableNotifications = async () => {
        try {
            setLoading(true)
            setMessage('')
            setError(false)

            if (!('Notification' in window)) {
                throw new Error('Notifications are not supported by this browser.')
            }

            if (!('serviceWorker' in navigator)) {
                throw new Error('Service workers are not supported by this browser.')
            }

            await subscribeToPush()

            setEnabled(true)
            setMessage('Notifications are now enabled on this device.')
        } catch (err) {
            console.error('Notification setup error:', err)
            setError(true)
            setMessage(err.message || 'Could not enable notifications.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await api.get('/logout', { withCredentials: true })
            toast.success('Goodbye! 🙏')
            navigate('/')
        } catch (err) {
            console.error('Logout error:', err)
            toast.error('Failed to log out')
        }
    }

    return (
        <PageTransition>
            <div className="flex bg-base-200 min-h-screen">
                <SideBar currentUser={currentUser} />

                <div className="flex-1 md:ml-64">
                    <TopBar currentUser={currentUser} />

                    <div className="p-4 sm:p-6 max-w-3xl mx-auto">

                        {/* HEADER */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                    <Settings className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-base-content">Settings</h1>
                                    <p className="text-sm text-base-content/60">
                                        Manage your Journex account and preferences.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ACCOUNT SECTION */}
                        <div className="mb-6">
                            <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                                Account
                            </h2>

                            <Link
                                to="/profile"
                                className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:bg-base-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base-content">Profile</h3>
                                        <p className="mt-1 text-sm text-base-content/60">
                                            Manage your username, email, bio and profile picture.
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 shrink-0 text-base-content/40" />
                            </Link>
                        </div>

                        {/* NOTIFICATIONS */}
                        <div className="mb-6">
                            <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                                Notifications
                            </h2>

                            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                            enabled ? 'bg-success/15' : 'bg-primary/10'
                                        }`}>
                                            <Bell className={`h-5 w-5 ${enabled ? 'text-success' : 'text-primary'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-base-content">Push Notifications</h3>
                                            <p className="mt-1 text-sm leading-6 text-base-content/60">
                                                Receive notifications when someone likes,
                                                comments on, or interacts with your entries.
                                            </p>
                                        </div>
                                    </div>

                                    {!statusLoading && enabled && (
                                        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Enabled
                                        </div>
                                    )}
                                </div>

                                <div className="my-5 border-t border-base-300" />

                                {statusLoading ? (
                                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Checking notification status...
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-base-content/60">
                                            {enabled
                                                ? 'Notifications are enabled on this device.'
                                                : 'Enable notifications to stay updated.'}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleEnableNotifications}
                                            disabled={loading || enabled}
                                            className={`btn gap-2 ${
                                                enabled ? 'btn-success btn-outline cursor-default' : 'btn-primary'
                                            } ${loading ? 'cursor-wait opacity-70' : ''}`}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Enabling...
                                                </>
                                            ) : enabled ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Notifications Enabled
                                                </>
                                            ) : (
                                                <>
                                                    <Bell className="h-4 w-4" />
                                                    Enable Notifications
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {message && (
                                    <div className={`mt-5 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
                                        error ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
                                    }`}>
                                        {error ? (
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        ) : (
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                        )}
                                        <span>{message}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* LOGOUT */}
                        <div>
                            <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                                Account Actions
                            </h2>

                            <div className="rounded-2xl border border-error/20 bg-base-100 p-5 shadow-sm">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-4 rounded-xl p-2 text-left transition hover:bg-error/10"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error/10">
                                        <LogOut className="h-5 w-5 text-error" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-error">Log out</h3>
                                        <p className="mt-1 text-sm text-base-content/60">
                                            Sign out of your Journex account.
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </PageTransition>
    )
}

export default SettingsPage