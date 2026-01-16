"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

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
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF9EF] via-[#FFF9EF] to-[#F5EFDE] p-4">
      <div className="shadow-2xl rounded-xl overflow-hidden">
        <div className="flex w-full max-w-4xl bg-white" style={{ width: '900px', height: '600px' }}>
          <div className="w-1/2 bg-gradient-to-br from-[#8B735E] to-[#A0866F] flex items-center justify-center p-8">
            <div className="text-center">
              <Image 
                src="/logo.png" 
                alt="Crafted Roots - Handcrafted products showcasing quality and tradition" 
                width={280}
                height={280}
                className="w-full h-auto max-w-[280px] mx-auto rounded-lg shadow-lg"
              />
              <p className="text-white/70 text-sm mt-6 font-light">
                Crafted with care, Rooted in quality
              </p>
            </div>
          </div>
          <div className="w-1/2 bg-gradient-to-b from-[#FFF9EF] to-[#F5EFDE] px-12 py-10 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="text-center">
                <h1 className="text-3xl font-serif text-[#3A2E25] mb-2">
                  Crafted Roots
                </h1>
                <p className="text-sm text-[#8B7355] font-light">
                  Create Your Account
                </p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Button
                  type="button"
                  className="w-full border-2 border-[#D4C5B0] bg-white text-[#3A2E25] py-3 text-sm rounded-lg hover:bg-[#FFF9EF] hover:border-[#8B735E] font-medium h-auto transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  Sign up with Google
                </Button>
                <div className="flex items-center gap-2 py-2">
                  <div className="flex-1 border-t border-[#D4C5B0]" />
                  <span className="text-xs text-[#8B7355] font-light">OR</span>
                  <div className="flex-1 border-t border-[#D4C5B0]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-[#D4C5B0] px-0 py-3 text-sm rounded-none placeholder-[#C4B5A0] text-[#3A2E25] focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#8B735E] transition-colors duration-200"
                  />
                </div>

                <div className="relative">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-[#D4C5B0] px-0 py-3 text-sm rounded-none placeholder-[#C4B5A0] text-[#3A2E25] focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#8B735E] transition-colors duration-200"
                  />
                </div>

                <div className="relative">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-[#D4C5B0] px-0 py-3 text-sm rounded-none placeholder-[#C4B5A0] text-[#3A2E25] focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#8B735E] transition-colors duration-200"
                  />
                </div>

                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-[#D4C5B0] px-0 py-3 text-sm rounded-none placeholder-[#C4B5A0] text-[#3A2E25] focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#8B735E] transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <Button
                  type="button"
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#8B735E] to-[#7B6350] text-white hover:from-[#7B6350] hover:to-[#6B5340] disabled:from-[#8B735E]/50 disabled:to-[#7B6350]/50 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-semibold text-base h-auto transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                
                <div className="border-t border-[#E5DDD0] pt-4 space-y-3">
                  <div className="text-center">
                    <Link href="/sign-in/login" className="text-xs text-[#8B7355] hover:text-[#8B735E] font-medium transition duration-200">
                      Already have an account? <span className="underline underline-offset-2">Sign In</span>
                    </Link>
                  </div>

                  <p className="text-xs text-center text-[#8B7355] leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <button type="button" className="font-medium text-[#8B735E] hover:underline">
                      Terms & Conditions
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}