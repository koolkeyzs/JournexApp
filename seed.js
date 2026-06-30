
const mongoose = require ('mongoose')
const path = require ('path');
const Journex = require ('./model/journex')



mongoose.connect('mongodb://localhost:27017/Journex')
const db = mongoose.connection;

db.on('error' , console.error.bind(console , 'Connection-Error'))
db.once ('open'  ,()=>{
    console.log('Database Connected')
})




  const seedEntries = [
  {
    title: "Peace of Mind",
    content:
      "Today I learned to trust God even when I cannot control the outcome of situations around me.",
    verse: "Philippians 4:6-7",
    tags: ["peace", "trust", "prayer"],
    author:"6a3ea8cec72f652480c45459" ,
    image: "https://picsum.photos/seed/peace/600/400",
  },
  {
    title: "Strength in Trials",
    content:
      "Hard moments are not meant to break me but to shape my character and deepen my faith.",
    verse: "Isaiah 41:10",
    tags: ["strength", "endurance", "faith"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/strength/600/400",
  },
  {
    title: "Quiet Time with God",
    content:
      "In silence today, I felt more clarity than in any loud environment. God speaks in stillness.",
    verse: "Psalm 46:10",
    tags: ["silence", "devotion", "reflection"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/silence/600/400",
  },
  {
    title: "Guidance of the Holy Spirit",
    content:
      "I felt a strong conviction in my heart today while making a decision, reminding me I am not alone.",
    verse: "John 14:26",
    tags: ["Holy Spirit", "guidance", "prayer"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/guidance/600/400",
  },
  {
    title: "Gratitude in Small Things",
    content:
      "I noticed small blessings today that I usually ignore — breath, peace, food, and life itself.",
    verse: "1 Thessalonians 5:18",
    tags: ["gratitude", "thanksgiving"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/gratitude/600/400",
  },
  {
    title: "Learning Patience",
    content:
      "Waiting is uncomfortable, but I am learning that timing is part of God’s process for growth.",
    verse: "James 1:4",
    tags: ["patience", "growth", "discipline"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/patience/600/400",
  },
  {
    title: "Morning Devotion",
    content:
      "Starting my day with prayer helped me stay focused and calm throughout the day’s challenges.",
    verse: "Lamentations 3:22-23",
    tags: ["morning", "devotion"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/morning/600/400",
  },
  {
    title: "Evening Reflection",
    content:
      "Looking back at my actions today, I see where I reacted instead of responded with wisdom.",
    verse: "Psalm 4:8",
    tags: ["reflection", "evening"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/evening/600/400",
  },
  {
    title: "Walking in Faith",
    content:
      "Even when nothing makes sense, I choose to trust that God is working behind the scenes.",
    verse: "Hebrews 11:1",
    tags: ["faith", "trust"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/faith/600/400",
  },
  {
    title: "Weekly Review",
    content:
      "This week tested my discipline in prayer and consistency, but I am learning to stay steady.",
    verse: "Galatians 6:9",
    tags: ["review", "growth"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/review/600/400",
  },
  {
    title: "God’s Guidance in Decisions",
    content:
      "Before making choices today, I paused and prayed for wisdom instead of rushing ahead.",
    verse: "Proverbs 3:5-6",
    tags: ["guidance", "wisdom"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/wisdom/600/400",
  },
  {
    title: "Rest for the Soul",
    content:
      "Even in exhaustion, I found comfort in prayer and scripture that renewed my strength.",
    verse: "Matthew 11:28",
    tags: ["rest", "peace"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/rest/600/400",
  },
  {
    title: "Trusting the Process",
    content:
      "Not everything needs immediate answers; some things grow over time according to God’s timing.",
    verse: "Ecclesiastes 3:1",
    tags: ["trust", "timing"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/process/600/400",
  },
  {
    title: "Overcoming Doubt",
    content:
      "Doubt tried to weaken my confidence today, but I held on to faith instead of fear.",
    verse: "2 Timothy 1:7",
    tags: ["faith", "courage"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/courage/600/400",
  },
  {
    title: "Discipline in Consistency",
    content:
      "Spiritual growth comes from showing up daily, not occasional effort.",
    verse: "1 Corinthians 9:24",
    tags: ["discipline", "consistency"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/discipline/600/400",
  },
  {
    title: "Inner Peace",
    content:
      "Despite external noise, I found calmness within through prayer and reflection.",
    verse: "John 16:33",
    tags: ["peace", "calm"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/calm/600/400",
  },
  {
    title: "Renewed Strength",
    content:
      "Even when I felt tired, I experienced unexpected strength to continue my day.",
    verse: "Isaiah 40:31",
    tags: ["strength", "renewal"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/renewal/600/400",
  },
  {
    title: "Letting Go of Worry",
    content:
      "Worrying does not change outcomes, but trusting God brings peace.",
    verse: "Matthew 6:34",
    tags: ["trust", "peace", "surrender"],
    author:"6a3ea8cec72f652480c45459",
    image: "https://picsum.photos/seed/surrender/600/400",
  },
];



async function seedDB() {
  await Journex.deleteMany({});  
  await Journex.insertMany(seedEntries);
  console.log('Seeded successfully!')
}


seedDB().then(() => {
  mongoose.connection.close();
});