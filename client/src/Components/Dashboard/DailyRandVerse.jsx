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
            className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-cover bg-center"
            style={{
                backgroundImage: "url('/verse.png')",
            }}
        >
            {/* Dark purple overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-purple-900/65 to-black/75" />

            {/* Card content */}
            <div className="relative z-10 p-6">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">

                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                        <span className="text-xl">
                            📖
                        </span>
                    </div>

                    <div>
                        <p className="text-white/70 text-xs font-medium uppercase tracking-[0.18em]">
                            Daily inspiration
                        </p>

                        <h3 className="text-white font-semibold text-lg">
                            Verse of the Day
                        </h3>
                    </div>

                </div>

                {/* Verse */}
                <div className="mb-4">

                    <p className="font-lora text-white text-xl sm:text-2xl italic leading-relaxed drop-shadow-md">
                        “{dailyVerse.text}”
                    </p>

                    <p className="font-lora text-white/90 font-medium mt-4 text-sm sm:text-base">
                        — {dailyVerse.reference}
                    </p>

                </div>

                {/* Copy & Share */}
                <div className="flex gap-3">

                    <button
                        onClick={handleCopy}
                        className="
                            flex-1
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-white/15
                            backdrop-blur-sm
                            border
                            border-white/20
                            text-white
                            text-sm
                            font-medium
                            px-4
                            py-2.5
                            rounded-lg
                            hover:bg-white/25
                            active:scale-[0.98]
                            transition
                        "
                    >
                        <Copy size={17} />
                        Copy
                    </button>

                    <button
                        onClick={handleShare}
                        className="
                            flex-1
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-white/15
                            backdrop-blur-sm
                            border
                            border-white/20
                            text-white
                            text-sm
                            font-medium
                            px-4
                            py-2.5
                            rounded-lg
                            hover:bg-white/25
                            active:scale-[0.98]
                            transition
                        "
                    >
                        <Share2 size={17} />
                        Share
                    </button>

                </div>

            </div>
        </div>
    );
};

export default DailyRandVerse;