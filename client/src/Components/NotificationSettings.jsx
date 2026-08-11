import { useEffect, useState } from 'react'
import { Bell, BellOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { subscribeToPush } from '../utils/pushNotification'

function NotificationSettings() {
    const [loading, setLoading] = useState(false)
    const [enabled, setEnabled] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
        // Check the browser's current notification permission
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                setEnabled(true)
            }
        }
    }, [])

    const handleEnableNotifications = async () => {
        try {
            setLoading(true)
            setMessage('')
            setError(false)

            // Browser support check
            if (!('Notification' in window)) {
                throw new Error(
                    'Notifications are not supported by this browser.'
                )
            }

            // Service worker support check
            if (!('serviceWorker' in navigator)) {
                throw new Error(
                    'Service workers are not supported by this browser.'
                )
            }

            await subscribeToPush()

            setEnabled(true)
            setMessage('Notifications are now enabled.')
        } catch (error) {
            console.error('Notification error:', error)

            setError(true)
            setMessage(
                error.message || 'Could not enable notifications.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Notifications
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Control how Journex keeps you updated.
                </p>
            </div>


            {/* Notification Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between gap-4">

                    {/* Icon + Description */}
                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                            {enabled ? (
                                <Bell className="h-6 w-6 text-purple-600" />
                            ) : (
                                <BellOff className="h-6 w-6 text-purple-600" />
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Push Notifications
                            </h3>

                            <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
                                Receive notifications when someone likes,
                                comments on, or interacts with your Journex
                                entries.
                            </p>
                        </div>

                    </div>


                    {/* Status */}
                    {enabled && (
                        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Enabled
                        </div>
                    )}

                </div>


                {/* Divider */}
                <div className="my-6 border-t border-gray-100" />


                {/* Action */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="text-sm text-gray-500">
                        {enabled
                            ? 'You will receive Journex notifications on this device.'
                            : 'Enable notifications to stay updated.'}
                    </div>


                    <button
                        type="button"
                        onClick={handleEnableNotifications}
                        disabled={loading || enabled}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200
                            ${
                                enabled
                                    ? 'cursor-default bg-green-100 text-green-700'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
                            }
                            ${
                                loading
                                    ? 'cursor-wait opacity-70'
                                    : ''
                            }
                        `}
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


                {/* Success / Error Message */}
                {message && (
                    <div
                        className={`mt-5 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
                            error
                                ? 'bg-red-50 text-red-700'
                                : 'bg-green-50 text-green-700'
                        }`}
                    >

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
    )
}

export default NotificationSettings