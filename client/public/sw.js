self.addEventListener('push' , (event)=>{
    const data = event.data ? event.data.json() :{}
    const title = data.title || 'Journex'

    const options ={
        body : data.body || 'You have a notification',
        icon: '/JournexLogo.png',
        badge: 'JournexLogo.png',
         silent: false, 
            vibrate: [200, 100, 200],
    }

    event.waitUntil(
        self.registration.showNotification(title , options)
    )
})