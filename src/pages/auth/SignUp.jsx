import React, { useState } from "react";
import logo from "../../assets/AGROFARMA (12).png";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // const NODE_URL = process.env.NODE_API_URL

    try {
      const response = await fetch(`http://localhost:8000/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to register");
      }

      alert("Signup successful! You can now log in.");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div>
          <img src={logo} alt="Company Logo" className="mx-auto lg:h-20" />
          <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
            Create an Account
          </h2>
          {error && <div className="mb-4 text-red-500">{error}</div>}
        </div>

        <form
          onSubmit={handleSubmit}
          action="#"
          method="POST"
          className="space-y-6"
        >
          <div>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username (John Doe)"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full rounded-t-md border bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
            <input
              id="email-address"
              name="email"
              type="email"
              required
              placeholder="Email (johndoe@example.com)"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full border border-t-0 bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password (********)"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full -mt-px rounded-b-md border bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="remember-me" className="text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div> */}

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-indigo-600"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
