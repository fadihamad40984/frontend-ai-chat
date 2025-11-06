import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaComments, FaArrowRight } from "react-icons/fa";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 flex flex-col items-center justify-center text-white relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.3)_0%,_transparent_60%)] animate-pulse"></div>

    
      <div className="relative z-10 text-center space-y-4">
        <div className="flex justify-center items-center gap-3 mb-4">
          <FaRobot className="text-5xl animate-bounce" />
          <h1 className="text-5xl font-extrabold tracking-wide">BotSpoof AI</h1>
        </div>

        <p className="text-lg max-w-xl mx-auto text-white/90">
          Your personal AI companion 🤖 — chat, learn, and explore with the power of intelligent conversation.
        </p>

        
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => navigate("/signin")}
            className="bg-white text-purple-700 font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-purple-100 transition-transform flex items-center gap-2"
          >
            <FaComments /> Sign In
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-transparent border-2 border-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-purple-700 transition-all flex items-center gap-2"
          >
            Get Started <FaArrowRight />
          </button>
        </div>
      </div>

    
      <footer className="absolute bottom-6 text-white/70 text-sm">
        © {new Date().getFullYear()} BotSpoof AI — Made with 💜 By Fadi Hamad
      </footer>
    </div>
  );
}

export default Welcome;
