
const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
      <img
        src="/JournexLogo.png"
        alt="Journex loading"
        className="h-30 object-contain animate-pulse"
      />
      <p className="text-sm text-base-content/50">Loading...</p>
    </div>
  )
}

export default LoadingScreen