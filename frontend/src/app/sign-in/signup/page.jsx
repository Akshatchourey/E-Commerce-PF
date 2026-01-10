"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration successful:', response);
      alert('Account created successfully! Please login.');
      router.push('/sign-in/login');
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.';
      setError(msg);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="bg-[#8B735E] p-6">
        <div className="flex w-900px h-460px bg-[#8B735E]">
          <div className="w-1/2 bg-[#8B735E] flex items-center justify-center" />
          <div className="w-1/2 bg-[#E6C9A0] px-12 py-10 flex flex-col justify-between">
            <form onSubmit={handleSubmit}>
              <div>
                <h1 className="text-2xl font-serif text-black mb-2">
                  Crafted Roots
                </h1>
                <p className="text-sm text-black mb-4">
                  Create Account
                </p>
                {error && (
                  <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-xs rounded">
                    {error}
                  </div>
                )}
                <div className="flex gap-3 mb-4">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1 border border-[#3A2E25] text-xs py-1 rounded bg-white text-black hover:bg-white/90 h-auto"
                  >
                    Sign up with Google
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1 border border-[#3A2E25] text-xs py-1 rounded bg-white text-black hover:bg-white/90 h-auto"
                  >
                    Sign up with Email
                  </Button>
                </div>

                <div className="text-center text-xs text-black mb-4">
                  — OR —
                </div>

                <div className="space-y-3">
                  <label htmlFor="username" className="text-xs text-black">Full Name</label>
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Full Name"
                    aria-label="Full name"
                    disabled={loading}
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] text-sm px-1 py-1 rounded-none placeholder-black text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />

                  <label htmlFor="email" className="text-xs text-black">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    aria-label="Email address"
                    disabled={loading}
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] text-sm px-1 py-1 rounded-none placeholder-black text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />

                  <label htmlFor="password" className="text-xs text-black">Password</label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    aria-label="Password"
                    disabled={loading}
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] text-sm px-1 py-1 rounded-none placeholder-black text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />

                  <label htmlFor="confirmPassword" className="text-xs text-black">Confirm Password</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    aria-label="Confirm password"
                    disabled={loading}
                    className="w-full bg-transparent border-0 border-b border-[#3A2E25] text-sm px-1 py-1 rounded-none placeholder-black text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                  />
                </div>
              </div>

              <div>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-black/90 text-sm py-2 rounded mt-5 h-auto disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Link href="/sign-in/login">
                  <p className="text-[10px] text-center mt-3 text-black">
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