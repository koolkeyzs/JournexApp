import { Rocket, Sparkles, BookOpen } from "lucide-react";
import SideBar from "../Components/Dashboard/sidebar";
import PageTransition from '../Components/PageTransition'

export default function WhatsNewPage() {
  return (
           <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex justify-center items-center  p-6">
 <SideBar/>
  

   
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-10">

        <div className="flex items-center gap-3 mb-4">
          <Rocket className="text-purple-600" size={35} />
          <h1 className="text-4xl font-bold text-gray-800">
            Journex v1.0
          </h1>
        </div>

        <p className="text-gray-600 text-lg leading-8">
          Welcome to the first official release of Journex! 🎉
          This version introduces the core experience for documenting your
          spiritual journey through journaling, community sharing and daily
          inspiration.
        </p>

        {/* Current Version */}

        <div className="mt-10">

          <div className="flex items-center gap-2 mb-5">

            <Sparkles className="text-yellow-500" />

            <h2 className="text-2xl font-bold">
              What's Included
            </h2>

          </div>

          <ul className="space-y-3 text-gray-700">

            <li>✅ Secure Authentication</li>

            <li>✅ Personal Journal Entries</li>

            <li>✅ Community Feed</li>

            <li>✅ Daily Bible Verse</li>

            <li>✅ Inspirational Quotes</li>

            <li>✅ Search Entries</li>

            <li>✅ Profile Management</li>

            <li>✅ Image Uploads</li>

          </ul>

        </div>

        {/* Next Version */}

        <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">

          <div className="flex items-center gap-3 mb-4">

            <BookOpen />

            <h2 className="text-3xl font-bold">
              Coming Next — v1.1
            </h2>

          </div>

          <p className="text-purple-100 leading-8">
            The next major update brings full Bible integration to Journex,
            making Scripture study a seamless part of your journaling
            experience.
          </p>

          <ul className="mt-6 space-y-3">

            <li>📖 Full Bible API Integration</li>

            <li>🔍 Search Bible Verses</li>

            <li>📚 Read Complete Chapters</li>

            <li>🌍 Multiple Bible Translations</li>

          </ul>

        </div>

        {/* Future */}

        <div className="mt-10 text-center">

          <h3 className="text-xl font-bold text-gray-800">
            🚀 The Journey Continues...
          </h3>

          <p className="text-gray-600 mt-4 leading-7">
            This is only the beginning. Future updates will introduce AI-powered
            journaling, real-time interactions, automation, mobile support,
            premium features and many more improvements to help you reflect,
            grow and strengthen your walk with God.
          </p>

          <p className="mt-8 text-purple-600 font-semibold">
            Thank you for being part of the Journex journey ❤️
          </p>

        </div>

      </div>

    </div>
           </PageTransition>
  );
}