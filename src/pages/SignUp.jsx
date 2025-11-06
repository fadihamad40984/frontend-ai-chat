import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          phone,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email to verify your account!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 px-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md relative">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">
          Create Account
        </h1>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-purple-400" : "bg-purple-700 hover:scale-105"
            } text-white p-3 rounded-xl font-bold transition-transform`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

      
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-purple-700 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>

        {loading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-700 font-semibold">
              Creating your account...
            </p>
          </div>
        )}

    
        {message && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
            <div className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-sm">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">✅ Done!</h2>
              <p className="text-gray-700 mb-4">{message}</p>
              <button
                onClick={() => navigate("/signin")}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Go to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
