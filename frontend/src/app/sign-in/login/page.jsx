"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

  // Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT tokens in localStorage
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("username", data.username);

        // Redirect to home or shop page
        router.push("/shoppage");
      } else {
        // Handle validation errors from Django
        setError(data.detail || data.non_field_errors || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="bg-[#8B735E] p-6">
        <div className="flex w-[900px] h-[460px]">
          <div className="w-1/2 bg-[#8B735E] flex items-center justify-center" />
          <div className="w-1/2 bg-[#E6C9A0] px-14 py-12 flex flex-col justify-between">
            <form onSubmit={handleLogin}>
              <div>
                <h1 className="text-2xl font-serif text-[#3A2E25] mb-4">
                  Crafted Roots
                </h1>

                <p className="text-sm text-[#3A2E25] mb-5">
                  Sign In To Crafted Roots
                </p>

                {error && <p className="text-red-600 text-xs mb-4">{error}</p>}

                <div className="flex gap-3 mb-5">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border border-[#3A2E25] bg-white py-1.5 text-xs rounded text-black hover:bg-white/90 h-auto"
                  >
                    Sign in with Google
                  </Button>
                </div>

                <div className="text-center text-xs text-[#3A2E25] mb-6">
                  — OR —
                </div>

                <div className="space-y-4">
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] px-1 py-1 text-sm rounded-none placeholder-[#5A4A3C] text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />

                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] px-1 py-1 text-sm rounded-none placeholder-[#5A4A3C] text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-black/90 py-2 rounded mt-6 text-sm h-auto"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <Link href="/sign-in/signup">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border border-[#3A2E25] text-[#3A2E25] hover:bg-[#3A2E25]/5 py-2 rounded mt-3 text-xs h-auto"
                  >
                    Sign Up
                  </Button>
                </Link>

                <p className="text-[10px] text-right mt-3 text-[#3A2E25] underline cursor-pointer hover:text-[#3A2E25]/70">
                  Forget Password?
                </p>

                <p className="text-[9px] text-right mt-4 text-[#3A2E25]">
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