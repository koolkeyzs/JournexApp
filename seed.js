// seed.js — run once with: node seed.js
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const mongoose = require('mongoose')
const User = require('./model/user')
const Journex = require('./model/journex')
const Comment = require('./model/comments')
const Report = require('./model/report')

mongoose.connect('mongodb://localhost:27017/Journex')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', () => console.log('Database Connected'))

const sampleImages = [
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800',
    'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=800',
    null,
]

const moods = ['Joyful', 'Grateful', 'Peaceful', 'Hopeful', 'Blessed', 'Sad', 'Anxious', 'Overwhelmed', 'Reflective', 'Content']

const tagPool = ['faith', 'prayer', 'gratitude', 'peace', 'trust', 'growth', 'community', 'joy', 'patience', 'restoration']

const sampleEntries = [
    { title: "Finding Peace in His Presence", content: "<p>Today I was reminded that in the midst of every storm, God is still in control. I sat quietly this morning and felt a peace that truly does surpass understanding.</p>", verse: "Philippians 4:7" },
    { title: "Lessons from the Wilderness", content: "<p>The wilderness is not a place of punishment, but a place of preparation. I've been walking through a hard season, but I can see now how it's shaping me.</p>", verse: "Deuteronomy 8:2" },
    { title: "Grateful Heart", content: "<p>I choose to be grateful for the small things that often go unnoticed — a warm cup of coffee, a quiet morning, a friend who checked in on me today.</p>", verse: "1 Thessalonians 5:18" },
    { title: "Trusting God's Timing", content: "<p>It's hard to wait. But today I was reminded that His timing is perfect, even when mine feels off. I'm learning to release control.</p>", verse: "Ecclesiastes 3:1" },
    { title: "Walking by Faith", content: "<p>Some days the path ahead is completely unclear, and that used to terrify me. Today, I'm choosing to walk by faith and not by sight.</p>", verse: "2 Corinthians 5:7" },
    { title: "He Restores My Soul", content: "<p>I felt so weary this week, running on empty. But sitting in stillness this morning, I felt Him restore something in me I didn't know was broken.</p>", verse: "Psalm 23:3" },
    { title: "A Season of Waiting", content: "<p>Nothing about my circumstances has changed, but something in my heart has shifted. I'm learning that waiting isn't wasted time.</p>", verse: "Isaiah 40:31" },
    { title: "Joy in the Morning", content: "<p>Weeping may endure for a night, but joy comes in the morning. I woke up today with an unexplainable lightness after a hard week.</p>", verse: "Psalm 30:5" },
    { title: "Surrendering My Plans", content: "<p>I had everything mapped out, and none of it happened the way I expected. Learning to hold my plans loosely and trust the bigger picture.</p>", verse: "Proverbs 16:9" },
    { title: "Community and Connection", content: "<p>I'm so thankful for the people God has placed in my life this season. Community has carried me through more than I realized.</p>", verse: "Ecclesiastes 4:9-10" },
    { title: "My Private Struggle", content: "<p>This one's just between me and God. Some things aren't ready to be shared yet, but I know He sees it all.</p>", verse: "Psalm 34:18" },
    { title: "Quiet Time Reflections", content: "<p>Just journaling my thoughts this morning before the day gets busy. Nothing profound, just honest.</p>", verse: "" },
]

const sampleComments = [
    "This is so encouraging! Thank you for sharing. God bless you abundantly 🙏",
    "Amen! This really spoke to my heart today.",
    "I needed to read this. Thank you.",
    "Praying for you as you walk through this season.",
    "This is beautiful. Keep pressing on!",
    "Wow, this hit different today. Thank you for your vulnerability.",
]

const reportReasons = [
    "This content seems inappropriate for the community.",
    "Possible spam or promotional content.",
    "This doesn't align with community guidelines.",
]

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomTags() {
    const shuffled = [...tagPool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 1)
}

async function seedDB() {
    console.log('Clearing existing data...')
    await Journex.deleteMany({})
    await Comment.deleteMany({})
    await Report.deleteMany({})
    await User.deleteMany({})

    console.log('Creating users...')

    const usersData = [
        { username: 'kelvin', email: 'kelvin@example.com', role: 'admin' },
        { username: 'grace_o', email: 'grace@example.com', role: 'user' },
        { username: 'michael_t', email: 'michael@example.com', role: 'user' },
        { username: 'sarah_k', email: 'sarah@example.com', role: 'user' },
        { username: 'david_w', email: 'david@example.com', role: 'user' },
    ]

    const users = []
    for (const u of usersData) {
        const user = new User({ username: u.username, email: u.email, role: u.role })
        const registered = await User.register(user, 'password123')
        users.push(registered)
    }
    console.log(`Created ${users.length} users. Password for all: "password123"`)

    console.log('Creating entries...')
    const entries = []
    for (let i = 0; i < sampleEntries.length; i++) {
        const entryData = sampleEntries[i]
        const author = randomFrom(users)
        const isPublic = i < 10 // last 2 stay private, rest public

        const randomImageCount = Math.random() > 0.3 ? 1 : 0
        const images = randomImageCount
            ? [{ url: randomFrom(sampleImages.filter(Boolean)), filename: `seed-${i}` }]
            : []

        // random subset of users like this entry
        const likers = users.filter(() => Math.random() > 0.5).map(u => u._id)

        const entry = new Journex({
            title: entryData.title,
            content: entryData.content,
            verse: entryData.verse,
            tags: randomTags(),
            mood: randomFrom(moods),
            author: author._id,
            isPublic,
            images,
            likes: likers,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
        })

        await entry.save()
        entries.push(entry)
    }
    console.log(`Created ${entries.length} entries.`)

    console.log('Creating comments...')
    let commentCount = 0
    for (const entry of entries) {
        if (!entry.isPublic) continue
        const numComments = Math.floor(Math.random() * 3)
        for (let i = 0; i < numComments; i++) {
            const commenter = randomFrom(users)
            const comment = new Comment({
                text: randomFrom(sampleComments),
                author: commenter._id,
            })
            await comment.save()
            entry.comment.push(comment._id)
            commentCount++
        }
        await entry.save()
    }
    console.log(`Created ${commentCount} comments.`)

    console.log('Creating reports...')
    const publicEntries = entries.filter(e => e.isPublic)
    let reportCount = 0
    for (let i = 0; i < 3; i++) {
        const entry = randomFrom(publicEntries)
        const reporter = randomFrom(users)
        if (entry.author.toString() === reporter._id.toString()) continue // don't self-report

        const report = new Report({
            reporter: reporter._id,
            entry: entry._id,
            reason: randomFrom(reportReasons),
            status: randomFrom(['pending', 'pending', 'reviewed', 'resolved']), // weighted toward pending
        })
        await report.save()
        reportCount++
    }
    console.log(`Created ${reportCount} reports.`)

    console.log('\n✅ Seed complete!')
    console.log('\nLogin with any of these (password: password123):')
    usersData.forEach(u => console.log(`  ${u.username} (${u.role})`))
}

seedDB()
    .then(() => {
        mongoose.connection.close()
    })
    .catch((err) => {
        console.error('Seed failed:', err)
        mongoose.connection.close()
    })