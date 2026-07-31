import { getDailyVerse } from "../../lib/verseUtils";
import { useState, useEffect } from "react";
import React from 'react'

const DailyRandVerse = ({ currentUser }) => {
    const [dailyVerse, setDailyVerse] = useState(null)

    useEffect(() => {
        if (!currentUser?._id) return
        const verse = getDailyVerse(currentUser._id)
        setDailyVerse(verse)
    }, [currentUser])

    if (!dailyVerse) return null

    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                    📖
                </div>
                <h3 className="font-semibold text-gray-800">Verse of the Day</h3>
            </div>

            <p className="italic text-gray-600 leading-relaxed mb-4">
                "{dailyVerse.text}"
            </p>

            <p className="text-purple-600 font-medium mb-5">
                {dailyVerse.reference}
            </p>

            {/* <button className="w-full flex items-center justify-center gap-2 bg-purple-100 text-purple-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-purple-200 transition">
                📖 Read Full Chapter
            </button> */}
        </div>
    )
}

export default DailyRandVerse