import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dW5pdmVyc2l0eSUyMHN0dWRlbnR8ZW58MHx8MHx8fDA%3D')",
        }}
      ></div>

      {/* BLUE GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200/60 via-white/70 to-blue-50/90"></div>

      {/* MAIN CONTENT */}
      <div className="relative">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col md:flex-row items-center gap-16">
          {/* TEXT */}
          <div className="flex-1 space-y-6 animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Skyline Institute of <br />
              <span className="text-blue-700 drop-shadow-md">Technology</span>
            </h1>

            <p className="text-gray-700 text-lg max-w-xl font-medium">
              Empowering students to learn, innovate, and build the future. Join
              one of India's most dynamic & modern campuses.
            </p>

            <div className="flex gap-4 mt-6">
              <Link
                to="/admission"
                className="px-6 py-3 rounded-lg text-white bg-blue-700 shadow-lg
                           hover:bg-blue-800 hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                Apply Now
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white shadow
                           hover:shadow-lg transition transform hover:-translate-y-1"
              >
                Login
              </Link>
            </div>
          </div>

          {/* FEATURE GRID */}
          <div className="flex-1 grid grid-cols-2 gap-6 animate-slideUp">
            {[
              {
                title: "Modern Labs",
                desc: "AI, ML, Robotics & Cybersecurity labs.",
                color: "from-blue-500 to-cyan-400",
              },
              {
                title: "Library & Research",
                desc: "Wide digital resources & research centers.",
                color: "from-purple-500 to-indigo-400",
              },
              {
                title: "Sports Complex",
                desc: "World-class indoor & outdoor arenas.",
                color: "from-green-500 to-emerald-400",
              },
              {
                title: "Hostel & Cafeteria",
                desc: "Comfortable stay & hygienic food.",
                color: "from-pink-500 to-rose-400",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/90 backdrop-blur shadow-lg hover:shadow-xl 
                           transition transform hover:-translate-y-2 border-t-4 border-transparent hover:border-blue-600"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center 
                               justify-center text-white font-bold mb-3 shadow`}
                >
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE SECTION */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
            Why Choose Skyline?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeInSlow">
            {[
              "Experienced Faculty & Industry Collaborations",
              "Strong Placement Record & Internship Programs",
              "Active Clubs, Hackathons & National-Level Events",
            ].map((text, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg hover:shadow-2xl 
                           transition transform hover:-translate-y-2 border-l-4 border-blue-700"
              >
                <p className="text-gray-700 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </section>
        <Footer/>
      </div>
    </div>
  );
}
