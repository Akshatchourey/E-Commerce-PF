'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password,
      });

      console.log('Login successful:', response);
      
      // Redirect based on user role
      if (response.role === 'seller') {
        router.push('/seller_dashboard');
      } else {
        router.push('/'); // Redirect to home page
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
      console.error('Login error:', err);
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
            <div>
              <h1 className="text-2xl font-serif text-[#3A2E25] mb-4">
                Crafted Roots
              </h1>

              <p className="text-sm text-[#3A2E25] mb-5">
                Sign In To Crafted Roots
              </p>

              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-xs rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mb-5">
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1 border border-[#3A2E25] bg-white py-1.5 text-xs rounded text-black hover:bg-white/90 h-auto"
                >
                  Sign in with Google
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1 border border-[#3A2E25] bg-white py-1.5 text-xs rounded text-black hover:bg-white/90 h-auto"
                >
                  Sign in with Email
                </Button>
              </div>

              <div className="text-center text-xs text-[#3A2E25] mb-6">
                — OR —
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username or Email"
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full bg-transparent border-0 border-b border-[#3A2E25] px-1 py-1 text-sm rounded-none placeholder-[#5A4A3C] text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                />

                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full bg-transparent border-0 border-b border-[#3A2E25] px-1 py-1 text-sm rounded-none placeholder-[#5A4A3C] text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                />
              </div>
            </div>

            <div>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-white hover:bg-black/90 py-2 rounded mt-6 text-sm h-auto disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
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
          </div>
        </div>
      </div>
    </div>
  );
}