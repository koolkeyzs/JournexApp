// const mongoose = require('mongoose')
// const Journex = require('./model/journex')
// const User = require('./model/user')

// mongoose.connect('mongodb://localhost:27017/Journex')
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Connection-Error'))
// db.once('open', () => { console.log('Database Connected') })

// const seedImages = [
//       {
//         url: 'https://res.cloudinary.com/vvlu3xl4/image/upload/v1782986106/Journex/ljtwg1kubbqx5bhatrzb.jpg',
//         filename: 'Journex/ljtwg1kubbqx5bhatrzb',
      
//       },
//       {
//         url: 'https://res.cloudinary.com/vvlu3xl4/image/upload/v1782986106/Journex/ze42ebpoeborqqs5rwjv.jpg',
//         filename: 'Journex/ze42ebpoeborqqs5rwjv',
        
//       }
//     ]


// const seedEntries = [
//   { title: "Peace of Mind", content: "Today I learned to trust God even when I cannot control the outcome of situations around me.", verse: "Philippians 4:6-7", tags: ["peace", "trust", "prayer"] },
//   { title: "Strength in Trials", content: "Hard moments are not meant to break me but to shape my character and deepen my faith.", verse: "Isaiah 41:10", tags: ["strength", "endurance", "faith"] },
//   { title: "Quiet Time with God", content: "In silence today, I felt more clarity than in any loud environment. God speaks in stillness.", verse: "Psalm 46:10", tags: ["silence", "devotion", "reflection"] },
//   { title: "Guidance of the Holy Spirit", content: "I felt a strong conviction in my heart today while making a decision, reminding me I am not alone.", verse: "John 14:26", tags: ["Holy Spirit", "guidance", "prayer"] },
//   { title: "Gratitude in Small Things", content: "I noticed small blessings today that I usually ignore — breath, peace, food, and life itself.", verse: "1 Thessalonians 5:18", tags: ["gratitude", "thanksgiving"] },
//   { title: "Learning Patience", content: "Waiting is uncomfortable, but I am learning that timing is part of God's process for growth.", verse: "James 1:4", tags: ["patience", "growth", "discipline"] },
//   { title: "Morning Devotion", content: "Starting my day with prayer helped me stay focused and calm throughout the day's challenges.", verse: "Lamentations 3:22-23", tags: ["morning", "devotion"] },
//   { title: "Evening Reflection", content: "Looking back at my actions today, I see where I reacted instead of responded with wisdom.", verse: "Psalm 4:8", tags: ["reflection", "evening"] },
//   { title: "Walking in Faith", content: "Even when nothing makes sense, I choose to trust that God is working behind the scenes.", verse: "Hebrews 11:1", tags: ["faith", "trust"] },
//   { title: "Weekly Review", content: "This week tested my discipline in prayer and consistency, but I am learning to stay steady.", verse: "Galatians 6:9", tags: ["review", "growth"] },
//   { title: "God's Guidance in Decisions", content: "Before making choices today, I paused and prayed for wisdom instead of rushing ahead.", verse: "Proverbs 3:5-6", tags: ["guidance", "wisdom"] },
//   { title: "Rest for the Soul", content: "Even in exhaustion, I found comfort in prayer and scripture that renewed my strength.", verse: "Matthew 11:28", tags: ["rest", "peace"] },
//   { title: "Trusting the Process", content: "Not everything needs immediate answers; some things grow over time according to God's timing.", verse: "Ecclesiastes 3:1", tags: ["trust", "timing"] },
//   { title: "Overcoming Doubt", content: "Doubt tried to weaken my confidence today, but I held on to faith instead of fear.", verse: "2 Timothy 1:7", tags: ["faith", "courage"] },
//   { title: "Discipline in Consistency", content: "Spiritual growth comes from showing up daily, not occasional effort.", verse: "1 Corinthians 9:24", tags: ["discipline", "consistency"] },
//   { title: "Inner Peace", content: "Despite external noise, I found calmness within through prayer and reflection.", verse: "John 16:33", tags: ["peace", "calm"] },
//   { title: "Renewed Strength", content: "Even when I felt tired, I experienced unexpected strength to continue my day.", verse: "Isaiah 40:31", tags: ["strength", "renewal"] },
//   { title: "Letting Go of Worry", content: "Worrying does not change outcomes, but trusting God brings peace.", verse: "Matthew 6:34", tags: ["trust", "peace", "surrender"] },
// ]

// async function seedDB() {
//   await Journex.deleteMany({});

//   const user = await User.findOne({});

//   const entries = seedEntries.map((entry, i) => ({
//     ...entry,
//     author: user._id,
//     images: [seedImages[i % seedImages.length]] 
//   }));

//   await Journex.insertMany(entries);
//   console.log('Seeded successfully! Author:', user.username);
// }

// seedDB().then(() => {
//   mongoose.connection.close();
// });


if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const mongoose = require('mongoose')
const Journex = require('./model/journex')
const User = require('./model/user')

mongoose.connect('mongodb://localhost:27017/Journex')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', () => {
    console.log('Database Connected')
})

const sampleImages = [
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800',
    'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=800',
    null, // some entries with no image, to test your fallback icon
]

const sampleEntries = [
    { title: "Finding Peace in His Presence", content: "Today I was reminded that in the midst of every storm, God is still in control. I sat quietly this morning and felt a peace that truly does surpass understanding.", verse: "Philippians 4:7", tags: ["peace", "faith"] },
    { title: "Lessons from the Wilderness", content: "The wilderness is not a place of punishment, but a place of preparation. I've been walking through a hard season, but I can see now how it's shaping me.", verse: "Deuteronomy 8:2", tags: ["growth", "trust"] },
    { title: "Grateful Heart", content: "I choose to be grateful for the small things that often go unnoticed — a warm cup of coffee, a quiet morning, a friend who checked in on me today.", verse: "1 Thessalonians 5:18", tags: ["gratitude"] },
    { title: "Trusting God's Timing", content: "It's hard to wait. But today I was reminded that His timing is perfect, even when mine feels off. I'm learning to release control.", verse: "Ecclesiastes 3:1", tags: ["patience", "trust"] },
    { title: "Walking by Faith", content: "Some days the path ahead is completely unclear, and that used to terrify me. Today, I'm choosing to walk by faith and not by sight.", verse: "2 Corinthians 5:7", tags: ["faith"] },
    { title: "He Restores My Soul", content: "I felt so weary this week, running on empty. But sitting in stillness this morning, I felt Him restore something in me I didn't know was broken.", verse: "Psalm 23:3", tags: ["restoration", "peace"] },
    { title: "A Season of Waiting", content: "Nothing about my circumstances has changed, but something in my heart has shifted. I'm learning that waiting isn't wasted time.", verse: "Isaiah 40:31", tags: ["patience"] },
    { title: "Joy in the Morning", content: "Weeping may endure for a night, but joy comes in the morning. I woke up today with an unexplainable lightness after a hard week.", verse: "Psalm 30:5", tags: ["joy"] },
    { title: "Surrendering My Plans", content: "I had everything mapped out, and none of it happened the way I expected. Learning to hold my plans loosely and trust the bigger picture.", verse: "Proverbs 16:9", tags: ["surrender", "trust"] },
    { title: "Community and Connection", content: "I'm so thankful for the people God has placed in my life this season. Community has carried me through more than I realized.", verse: "Ecclesiastes 4:9-10", tags: ["community", "gratitude"] },
]

async function seedDB() {
    const users = await User.find({})

    if (users.length === 0) {
        console.log("No users found! Register at least one user first, then run this again.")
        return
    }

    await Journex.deleteMany({}) // clears existing entries — comment this out if you want to keep old data

    for (let i = 0; i < sampleEntries.length; i++) {
        const entry = sampleEntries[i]
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]

        const newEntry = new Journex({
            title: entry.title,
            content: entry.content,
            verse: entry.verse,
            tags: entry.tags,
            author: randomUser._id,
            isPublic: true,
            images: randomImage ? [{ url: randomImage, filename: `seed-${i}` }] : [],
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) // spread over the last 10 days
        })

        await newEntry.save()
    }

    console.log(`Seeded ${sampleEntries.length} public entries!`)
}

seedDB().then(() => {
    mongoose.connection.close()
})
 