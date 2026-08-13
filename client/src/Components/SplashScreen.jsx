import { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-violet-700 via-purple-700 to-purple-950 text-white">

      {/* Background shapes */}
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />

      {/* Mountain/cloud shapes */}
      <div className="absolute bottom-0 left-0 h-40 w-full overflow-hidden">
        <div className="absolute -bottom-24 left-[-10%] h-72 w-[70%] rounded-[50%] bg-white/10" />
        <div className="absolute -bottom-28 right-[-15%] h-80 w-[75%] rounded-[50%] bg-white/10" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center text-center">

        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-[2rem] bg-black shadow-2xl">
          <img
            src="/JournexLogo.png"
            alt="Journex"
            className="h-24 w-24 object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold tracking-wide">
          Journex
        </h1>

        <p className="mt-3 text-lg text-white/80">
          Write. Reflect. Grow.
        </p>

        <div className="mt-8 flex items-center gap-4 text-white/70">
          <span className="text-3xl">📖</span>
          <span className="text-2xl">✦</span>
          <span className="text-3xl">👥</span>
        </div>

      </div>

      {/* Loading dots */}
      <div className="absolute bottom-10 flex gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white/60" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-white/80 [animation-delay:200ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:400ms]" />
      </div>

    </div>
  );
}