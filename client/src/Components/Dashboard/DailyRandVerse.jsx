import { getDailyVerse } from "../../lib/verseUtils";
import { useState, useEffect } from "react";
import { Copy, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

const DailyRandVerse = ({ currentUser }) => {
    const [dailyVerse, setDailyVerse] = useState(null);

    useEffect(() => {
        if (!currentUser?._id) return;

        const verse = getDailyVerse(currentUser._id);
        setDailyVerse(verse);
    }, [currentUser]);

    if (!dailyVerse) return null;

    const verseText = `"${dailyVerse.text}"\n— ${dailyVerse.reference}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(verseText);
            toast.success("Verse copied!");
        } catch (error) {
            toast.error("Could not copy verse");
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Verse of the Day — Journex",
                    text: verseText,
                });
            } else {
                await navigator.clipboard.writeText(verseText);
                toast.success("Verse copied!");
            }
        } catch (error) {
            // User cancelled the share menu.
        }
    };

    return (
        <div
            className="w-full bg-base-100 rounded-2xl p-6 shadow-sm bg-cover bg-center"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(45, 10, 80, 0.72), rgba(20, 5, 40, 0.78)), url('/verse-bg.jpg')",
            }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/15 text-white p-2 rounded-full backdrop-blur-sm">
                    📖
                </div>

                <h3 className="font-semibold text-white">
                    Verse of the Day
                </h3>
            </div>

            <p className="font-lora italic text-white/95 leading-relaxed mb-4 drop-shadow-md">
                "{dailyVerse.text}"
            </p>

            <p className="font-lora text-white/90 font-medium mb-5">
                {dailyVerse.reference}
            </p>

            {/* Copy & Share */}
            <div className="flex gap-3">

                <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-white/25 backdrop-blur-sm border border-white/20 transition"
                >
                    <Copy size={17} />
                    Copy
                </button>

                <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-white/25 backdrop-blur-sm border border-white/20 transition"
                >
                    <Share2 size={17} />
                    Share
                </button>

            </div>

        </div>
    );
};

export default DailyRandVerse;