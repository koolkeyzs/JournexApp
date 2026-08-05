import { Rocket, Sparkles, BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import SideBar from "../Components/Dashboard/sidebar";
import PageTransition from "../Components/PageTransition";
import TopBar from "../Components/Dashboard/navbar";

const features = [
  "Secure Authentication",
  "Personal Journal Entries",
  "Rich Text Editor",
  "Mood Tracking",
  "Tags & Categories",
  "Community Feed",
  "Daily Bible Verse",
  "Featured Reflections",
  "Search Entries",
  "Likes & Comments",
  "Profile Management",
  "Image Uploads",
];

export default function WhatsNewPage() {
  return (
    <PageTransition>
        <TopBar/>

      <div className="min-h-screen bg-base-200 flex justify-center p-6">
      
        <SideBar />

        <div className="md:ml-64 w-full flex justify-center">

          <div className="max-w-4xl w-full">

            {/* Hero */}

            <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl text-primary-content p-10 shadow-xl">

              <div className="flex items-center gap-4">

                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">

                  <Rocket size={42} />

                </div>

                <div>

                  <div className="badge badge-warning badge-lg mb-2">
                    Latest Stable Release
                  </div>

                  <h1 className="text-5xl font-extrabold">
                    Journex v1.1
                  </h1>

                  <p className="mt-3 text-primary-content/90 text-lg leading-8 max-w-2xl">
                    A richer spiritual journaling experience with moods,
                    community reflections, profile improvements, powerful
                    writing tools and a cleaner dashboard.
                  </p>

                </div>

              </div>

            </div>

            {/* What's Included */}

            <div className="bg-base-100 rounded-3xl shadow-xl p-8 mt-8">

              <div className="flex items-center gap-3 mb-6">

                <Sparkles className="text-primary" />

                <h2 className="text-3xl font-bold">
                  What's New in v1.1
                </h2>

              </div>

              <div className="grid sm:grid-cols-2 gap-4">

                {features.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-4 bg-base-200 rounded-2xl px-5 py-4 hover:shadow-md transition"
                  >

                    <CheckCircle2
                      size={22}
                      className="text-success flex-shrink-0"
                    />

                    <span className="font-medium">
                      {feature}
                    </span>

                  </div>

                ))}

              </div>

            </div>
                        {/* Timeline */}

            <div className="bg-base-100 rounded-3xl shadow-xl p-8 mt-8">

              <div className="flex items-center gap-3 mb-8">

                <Clock3 className="text-primary" />

                <h2 className="text-3xl font-bold">
                  Development Timeline
                </h2>

              </div>

              <div className="space-y-8">

                {/* v1.0 */}

                <div className="flex gap-5">

                  <div className="flex flex-col items-center">

                    <div className="w-5 h-5 rounded-full bg-success"></div>

                    <div className="w-1 h-24 bg-success/30"></div>

                  </div>

                  <div>

                    <span className="badge badge-success mb-2">
                      Released
                    </span>

                    <h3 className="text-xl font-bold">
                      Version 1.0
                    </h3>

                    <p className="text-base-content/70 mt-2 leading-7">
                      The first public release of Journex introduced secure
                      authentication, private journaling, community sharing,
                      daily Bible verses and image uploads.
                    </p>

                  </div>

                </div>

                {/* v1.1 */}

                <div className="flex gap-5">

                  <div className="flex flex-col items-center">

                    <div className="w-5 h-5 rounded-full bg-primary ring-4 ring-primary/20"></div>

                    <div className="w-1 h-24 bg-primary/30"></div>

                  </div>

                  <div>

                    <span className="badge badge-primary mb-2">
                      Current Version
                    </span>

                    <h3 className="text-xl font-bold">
                      Version 1.1
                    </h3>

                    <p className="text-base-content/70 mt-2 leading-7">
                      A major UI refresh introducing the rich text editor,
                      mood tracking, tags, featured reflections, profile
                      improvements, likes, comments, search and a redesigned
                      dashboard experience.
                    </p>

                  </div>

                </div>

                {/* v1.2 */}

                <div className="flex gap-5">

                  <div className="flex flex-col items-center">

                    <div className="w-5 h-5 rounded-full bg-warning"></div>

                  </div>

                  <div>

                    <span className="badge badge-warning mb-2">
                      Coming Soon
                    </span>

                    <h3 className="text-xl font-bold">
                      Version 1.2
                    </h3>

                    <p className="text-base-content/70 mt-2 leading-7">
                      Artificial Intelligence and a complete Bible experience
                      are coming to Journex to make spiritual journaling even
                      more meaningful.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Coming Next */}

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-primary to-secondary p-10 text-primary-content shadow-xl">

              <div className="flex items-center gap-3 mb-6">

                <BookOpen size={30} />

                <h2 className="text-4xl font-bold">
                  Coming Next — Version 1.2
                </h2>

              </div>

              <p className="text-primary-content/90 leading-8 text-lg mb-8">
                Journex is evolving beyond a journal into your complete
                spiritual companion.
              </p>

              <div className="grid md:grid-cols-2 gap-5">

                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">

                  <h3 className="font-bold text-xl mb-3">
                    🤖 AI Reflection Assistant
                  </h3>

                  <p className="text-primary-content/80">
                    Receive thoughtful insights and encouragement based on
                    your journal entries.
                  </p>

                </div>

                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">

                  <h3 className="font-bold text-xl mb-3">
                    📖 Bible API
                  </h3>

                  <p className="text-primary-content/80">
                    Search verses, read chapters and explore multiple Bible
                    translations directly inside Journex.
                  </p>

                </div>

                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">

                  <h3 className="font-bold text-xl mb-3">
                    🔔 Smart Notifications
                  </h3>

                  <p className="text-primary-content/80">
                    Stay updated whenever someone interacts with your public
                    reflections.
                  </p>

                </div>

                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">

                  <h3 className="font-bold text-xl mb-3">
                    📱 Mobile Experience
                  </h3>

                  <p className="text-primary-content/80">
                    Better responsiveness, smoother performance and an even
                    cleaner interface.
                  </p>

                </div>

              </div>

            </div>
                        {/* Future Vision */}

            <div className="bg-base-100 rounded-3xl shadow-xl p-8 mt-8">

              <h2 className="text-3xl font-bold text-center mb-5">
                🚀 The Journey Continues...
              </h2>

              <p className="text-base-content/70 leading-8 text-center max-w-3xl mx-auto">

                Journex is only getting started. Every release is designed to
                make documenting your spiritual walk simpler, deeper and more
                meaningful. Future updates will continue to expand the platform
                with powerful tools for Bible study, AI assistance, community
                engagement and personal growth.

              </p>

              <div className="grid md:grid-cols-3 gap-5 mt-10">

                <div className="bg-base-200 rounded-2xl p-6 text-center">

                  <div className="text-4xl mb-3">🤝</div>

                  <h3 className="font-bold text-lg mb-2">
                    Stronger Community
                  </h3>

                  <p className="text-sm text-base-content/70">
                    More ways to connect, encourage and grow with believers
                    around the world.
                  </p>

                </div>

                <div className="bg-base-200 rounded-2xl p-6 text-center">

                  <div className="text-4xl mb-3">📚</div>

                  <h3 className="font-bold text-lg mb-2">
                    Deeper Bible Study
                  </h3>

                  <p className="text-sm text-base-content/70">
                    Powerful study tools, references and Scripture resources
                    integrated directly into your journal.
                  </p>

                </div>

                <div className="bg-base-200 rounded-2xl p-6 text-center">

                  <div className="text-4xl mb-3">✨</div>

                  <h3 className="font-bold text-lg mb-2">
                    Smarter Journaling
                  </h3>

                  <p className="text-sm text-base-content/70">
                    AI-powered insights, prompts and reflections that inspire
                    consistent spiritual growth.
                  </p>

                </div>

              </div>

            </div>

            {/* Thank You */}

            <div className="bg-primary text-primary-content rounded-3xl p-10 mt-8 text-center shadow-xl">

              <h2 className="text-4xl font-bold mb-4">
                Thank You ❤️
              </h2>

              <p className="text-primary-content/90 leading-8 max-w-2xl mx-auto">

                Thank you for being part of the Journex journey.
                Every reflection you write, every testimony you share and every
                prayer you record helps shape this platform into something
                greater.

              </p>

              <div className="mt-8">

                <div className="badge badge-lg badge-secondary px-6 py-4">
                  Built with ❤️ for Christians
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </PageTransition>

  );

}