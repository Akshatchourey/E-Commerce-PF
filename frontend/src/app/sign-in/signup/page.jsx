"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Signup Submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Frontend validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // The backend RegisterSerializer expects: username, email, password
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please sign in.");
        router.push("/sign-in/login");
      } else {
        // Handle Django validation errors (username already exists)
        const errorMessage = Object.values(data).flat().join(" ");
        setError(errorMessage || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="bg-[#8B735E] p-6">
        <div className="flex w-[900px] h-[460px] bg-[#8B735E]">
          <div className="w-1/2 bg-[#8B735E] flex items-center justify-center" />
          <div className="w-1/2 bg-[#E6C9A0] px-12 py-10 flex flex-col justify-between">
            <form onSubmit={handleSignup}>
              <div>
                <h1 className="text-2xl font-serif text-black mb-2">
                  Crafted Roots
                </h1>

                <p className="text-sm text-black mb-4">
                  Create Account
                </p>

                {error && <p className="text-red-600 text-[10px] mb-2 font-bold">{error}</p>}

                <div className="flex gap-3 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border border-[#3A2E25] text-xs py-1 rounded bg-white text-black hover:bg-white/90 h-auto"
                  >
                    Sign up with Google
                  </Button>
                </div>

                <div className="text-center text-xs text-black mb-4">
                  — OR —
                </div>

                <div className="space-y-3">
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] text-sm px-1 py-1 rounded-none placeholder-black text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />

                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] text-sm px-1 py-1 rounded-none placeholder-black text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />

                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] text-sm px-1 py-1 rounded-none placeholder-black text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />

                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] text-sm px-1 py-1 rounded-none placeholder-black text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-black/90 text-sm py-2 rounded mt-5 h-auto"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <Link href="/sign-in/login">
                  <p className="text-[10px] text-center mt-3 text-black hover:underline cursor-pointer">
                    Already have an account?
                  </p>
                </Link>

                <p className="text-[9px] text-right mt-3 text-black">
                  Terms & Conditions
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}