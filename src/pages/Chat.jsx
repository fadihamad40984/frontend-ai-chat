import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import {
  FaPaperPlane,
  FaSignOutAlt,
  FaRobot,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Load user & messages
  useEffect(() => {
    const loadUserAndMessages = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        navigate("/signin");
        return;
      }

      const currentUser = userData.user;
      setUser(currentUser);

      const { data: msgs, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: true });

      if (msgError) console.error("Message load error:", msgError);
      setMessages(msgs || []);

      // Realtime updates
      const channel = supabase
        .channel("messages-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            if (payload.new.user_id === currentUser.id) {
              setMessages((prev) => [...prev, payload.new]);
            }
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    loadUserAndMessages();
  }, [navigate]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const text = input.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user_id: user.id, sender: "user", text },
    ]);
    setInput("");

    await supabase
      .from("messages")
      .insert([{ user_id: user.id, sender: "user", text }]);
    setTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const botText = data.reply || "I'm still learning 🤖";

      // Transform bot response to array if it has multiple lines
      let botLines = [];
      if (typeof botText === "string") {
        botLines = botText
          .split(/\n|\r\n/)
          .filter((line) => line.trim() !== "");
        if (botLines.length === 0) botLines = [botText];
      } else if (Array.isArray(botText)) {
        botLines = botText;
      } else {
        botLines = [String(botText)];
      }

      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, user_id: user.id, sender: "bot", text: botLines },
      ]);

      await supabase
        .from("messages")
        .insert([{ user_id: user.id, sender: "bot", text: botLines }]);
    } catch (err) {
      console.error("Bot error:", err);
      setTyping(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  // Delete messages
  const deleteMessages = async (period) => {
    setMessage("Processing...");

    if (!user) return;

    const now = new Date();

    let threshold;
    if (period === "hour") {
      threshold = new Date(now.getTime() - 60 * 60 * 1000); // ساعة
    } else if (period === "day") {
      threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); // يوم
    } else if (period === "week") {
      threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // أسبوع
    }

    let query = supabase.from("messages").delete().eq("user_id", user.id);

    if (period !== "all") {
      query = query.lt("created_at", threshold.toISOString()); // تحويل UTC
    }

    const { error } = await query;

    if (error) {
      setMessage("❌ Error deleting messages: " + error.message);
    } else {
      setMessage("✅ Messages deleted successfully!");

      if (period === "all") {
        setMessages([]);
      } else {
        setMessages((prev) =>
          prev.filter((msg) => new Date(msg.created_at) >= (threshold || 0))
        );
      }
    }
  };

  // Render a message (supports array as list)
  const renderMessage = (msg) => {
    if (Array.isArray(msg.text)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {msg.text.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      );
    } else {
      return <p>{msg.text}</p>;
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-gray-800 z-20">
        <div className="flex items-center gap-2">
          <FaRobot className="text-2xl text-purple-400" />
          <h1 className="text-xl font-bold">BotSpoof Chat</h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
        >
          <FaSignOutAlt /> Logout
        </button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-3 relative z-10">
        {messages.length === 0 && !typing ? (
          <p className="text-center text-gray-400">Start the conversation 👇</p>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-xs text-gray-300">
                    {msg.sender === "user" ? <FaUserCircle /> : <FaRobot />}
                    <span className="capitalize">{msg.sender}</span>
                  </div>
                  {renderMessage(msg)}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-2xl text-sm animate-pulse">
                  Bot is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-700 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-all hover:scale-110 mr-3"
          title="View Profile"
        >
          <FaUserCircle size={32} className="text-purple-400" />
        </button>

        <form
          onSubmit={handleSend}
          className="flex items-center bg-gray-800 rounded-full px-4 py-2 shadow-lg flex-1"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full text-white font-bold transition-transform hover:scale-105"
          >
            <FaPaperPlane />
          </button>
        </form>
      </footer>

      {/* Profile Sidebar */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          profileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setProfileOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-[370px] bg-gray-900/95 border-r border-gray-800 shadow-2xl p-6 rounded-r-2xl overflow-y-auto transform transition-transform duration-300 ${
            profileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setProfileOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <FaTimes size={20} />
          </button>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 border-b border-gray-700 pb-2">
              Profile
            </h2>

            <div className="flex flex-col gap-4 text-gray-200">
              {/* User Information */}
              <div>
                <span className="font-semibold">Full Name:</span>{" "}
                {user?.user_metadata?.full_name || "Not provided"}
              </div>

              <div>
                <span className="font-semibold">Email:</span> {user?.email}
              </div>
              <div>
                <span className="font-semibold">Joined:</span>{" "}
                {new Date(user?.created_at).toLocaleString()}
              </div>

              {/* Delete Messages */}
              <div className="flex flex-col gap-4 mt-6">
                <span className="text-gray-300 font-semibold text-sm uppercase tracking-wide">
                  🧹 Delete Messages
                </span>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                  <button
                    onClick={() => deleteMessages("hour")}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-5 rounded-xl shadow-md transition-all transform hover:scale-105"
                  >
                    Last Hour
                  </button>
                  <button
                    onClick={() => deleteMessages("day")}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-5 rounded-xl shadow-md transition-all transform hover:scale-105"
                  >
                    Last Day
                  </button>
                  <button
                    onClick={() => deleteMessages("week")}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-5 rounded-xl shadow-md transition-all transform hover:scale-105"
                  >
                    Last Week
                  </button>
                  <button
                    onClick={() => deleteMessages("all")}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-5 rounded-xl shadow-md transition-all transform hover:scale-105"
                  >
                    All Messages
                  </button>
                </div>
                {message && (
                  <p className="mt-3 text-sm text-green-400 font-medium text-center animate-pulse">
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
