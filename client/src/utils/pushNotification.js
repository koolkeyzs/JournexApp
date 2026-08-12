// const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

// export async function subscribeToPush() {
//     if (!('serviceWorker' in navigator)) {
//         throw new Error('Service workers are not supported')
//     }

//     if (!('PushManager' in window)) {
//         throw new Error('Push notifications are not supported')
//     }

//     const permission = await Notification.requestPermission()

//     if (permission !== 'granted') {
//         throw new Error('Notification permission was not granted')
//     }

//     const registration = await navigator.serviceWorker.ready

//     const subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: VAPID_PUBLIC_KEY
//     })

//     // Send the subscription to Journex
//     const response = await api.post(
//         '/notifications/subscribe',
//         {
           
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include',
//             body: JSON.stringify({
//                 subscription
//             })
//         }
//     )

//     if (!response.ok) {
//         throw new Error('Failed to save push subscription')
//     }

//     return subscription
// }





import api from "../api"

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

export async function subscribeToPush() {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers are not supported')
    }

    if (!('PushManager' in window)) {
        throw new Error('Push notifications are not supported')
    }

    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
        throw new Error('Notification permission was not granted')
    }

    const registration = await navigator.serviceWorker.ready

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
    })

    // Send the subscription to Journex
    await api.post('/notifications/subscribe', { subscription })

    return subscription
}