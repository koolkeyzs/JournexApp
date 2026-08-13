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


self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clientList) => {

      // If Journex is already open, focus it
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      // If Journex isn't open, open it at its root
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});



