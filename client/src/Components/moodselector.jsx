import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const moodOptions = [
  { value: "Joyful", emoji: "😊" },
  { value: "Grateful", emoji: "🙏" },
  { value: "Peaceful", emoji: "☮️" },
  { value: "Hopeful", emoji: "🌟" },
  { value: "Blessed", emoji: "✨" },
  { value: "Excited", emoji: "🎉" },
  { value: "Content", emoji: "😌" },
  { value: "Reflective", emoji: "🤔" },
  { value: "Sad", emoji: "😢" },
  { value: "Anxious", emoji: "😰" },
  { value: "Overwhelmed", emoji: "😫" },
  { value: "Angry", emoji: "😠" },
  { value: "Confused", emoji: "😕" },
  { value: "Tired", emoji: "😴" },
  { value: "Lonely", emoji: "😔" },
  { value: "Hurt", emoji: "💔" },
  { value: "Disappointed", emoji: "😞" },
  { value: "Fearful", emoji: "😨" },
  { value: "Doubtful", emoji: "🤷" },
  { value: "Broken", emoji: "💔" },
];

const MoodSelect = ({ mood, setMood }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = moodOptions.find((m) => m.value === mood);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-base-300 rounded-xl px-4 py-2.5 text-sm text-base-content bg-base-100 focus:outline-none focus:border-primary"
      >
        <span>
          {selected
            ? `${selected.emoji} ${selected.value}`
            : "Select a mood..."}
        </span>

        <ChevronDown
          size={16}
          className={`text-base-content/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-lg border border-base-300 max-h-56 overflow-y-auto z-50 p-2 grid grid-cols-2 gap-1">
          {moodOptions.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => {
                setMood(m.value);
                setOpen(false);
              }}
              className={`text-left flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition ${
                mood === m.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-base-content hover:bg-base-200"
              }`}
            >
              {m.emoji} {m.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodSelect;