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