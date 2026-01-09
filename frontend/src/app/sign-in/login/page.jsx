import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Login() {
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
              <div className="flex gap-3 mb-5">
                <Button 
                  variant="outline"
                  className="flex-1 border border-[#3A2E25] bg-white py-1.5 text-xs rounded text-black hover:bg-white/90 h-auto"
                >
                  Sign up with Google
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border border-[#3A2E25] bg-white py-1.5 text-xs rounded text-black hover:bg-white/90 h-auto"
                >
                  Sign up with Email
                </Button>
              </div>
              <div className="text-center text-xs text-[#3A2E25] mb-6">
                — OR —
              </div>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent border-0 border-b border-[#3A2E25] px-1 py-1 text-sm rounded-none placeholder-[#5A4A3C] text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                />

                <Input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent border-0 border-b border-[#3A2E25] px-1 py-1 text-sm rounded-none placeholder-[#5A4A3C] text-black focus-visible:ring-0 focus-visible:border-[#3A2E25]"
                />
              </div>
            </div>
            <div>
              <Button className="w-full bg-black text-white hover:bg-black/90 py-2 rounded mt-6 text-sm h-auto">
                Sign In
              </Button>
              
              <Link href="/sign-in/signup">
                <Button 
                  variant="outline"
                  className="w-full border border-[#3A2E25] text-[#3A2E25] hover:bg-[#3A2E25]/5 py-2 rounded mt-3 text-xs h-auto"
                >
                  Sign Up
                </Button>
              </Link>

              <p className="text-10px text-right mt-3 text-[#3A2E25] underline cursor-pointer hover:text-[#3A2E25]/70">
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