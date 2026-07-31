import { verses } from "./Verse"

export function getDailyVerse(userId) {
    if (!userId) return verses[0] // sensible fallback

    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    // combine date + userId for unique verse per user per day
    const userSeed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = (day + month + year + userSeed) % verses.length

    return verses[index]
}
