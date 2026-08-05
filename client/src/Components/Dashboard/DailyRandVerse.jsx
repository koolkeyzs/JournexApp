import { getDailyVerse } from "../../lib/verseUtils";
import { useState, useEffect } from "react";

const DailyRandVerse = ({ currentUser }) => {
    const [dailyVerse, setDailyVerse] = useState(null);

    useEffect(() => {
        if (!currentUser?._id) return;
        const verse = getDailyVerse(currentUser._id);
        setDailyVerse(verse);
    }, [currentUser]);

    if (!dailyVerse) return null;

    return (
        <div className="w-full bg-base-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                    📖
                </div>

                <h3 className="font-semibold text-base-content">
                    Verse of the Day
                </h3>
            </div>

            <p className="italic text-base-content/80 leading-relaxed mb-4">
                "{dailyVerse.text}"
            </p>

            <p className="text-primary font-medium mb-5">
                {dailyVerse.reference}
            </p>

            {/* 
            <button className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary/20 transition">
                📖 Read Full Chapter
            </button> 
            */}
        </div>
    );
};

export default DailyRandVerse;