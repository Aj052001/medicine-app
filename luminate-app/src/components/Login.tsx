import React, { useState } from "react";
import { useAuth } from "./UserContext.js"; // Adjust the path
import OnboardingScreen from "./OnboardingScreen.tsx";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { authData, login } = useAuth(); // Access auth context

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage({ text: "", type: "" });
    setFormData({ username: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isLogin
      ? "http://localhost:5000/auth/login"
      : "http://localhost:5000/auth/register";

    const payload = {
      email: formData.email,
      password: formData.password,
      ...(isLogin ? {} : { name: formData.username }), // Add name for registration
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user.email, data.token); // Update auth context
        setMessage({ text: "Authentication successful!", type: "success" });
      } else {
        setMessage({ text: data.message || "Authentication failed.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Network error, please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to onboarding screen if authenticated
  if (authData.isAuthenticated) {
    return <OnboardingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-purple-900 rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md text-center ${
              message.type === "success"
                ? "bg-green-600/20 text-green-200"
                : "bg-red-600/20 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-purple-800 border border-purple-600 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                placeholder="Enter your username"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-purple-800 border border-purple-600 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-purple-800 border border-purple-600 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
          <div className="text-center text-sm text-gray-300">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button onClick={toggleForm} className="text-purple-300 hover:text-purple-200 underline">
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button onClick={toggleForm} className="text-purple-300 hover:text-purple-200 underline">
                  Login here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForms;
