export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
    
      <div className="bg-[#8B735E] p-6">
        
        <div className="flex w-900px h-460px bg-[#8B735E]">

          <div className="w-1/2 bg-[#8B735E] flex items-center justify-center">
          </div>

          <div className="w-1/2 bg-[#E6C9A0] px-12 py-10 flex flex-col justify-between">

            <div>
              <h1 className="text-2xl font-serif text-black mb-2">
                Crafted Roots
              </h1>

              <p className="text-sm text-black mb-4">
                Create Account
              </p>

              <div className="flex gap-3 mb-4">
                <button className="flex-1 border border-[#3A2E25] text-xs py-1 rounded bg-white text-black">
                  Sign up with Google
                </button>
                <button className="flex-1 border border-[#3A2E25] text-xs py-1 rounded bg-white text-black">
                  Sign up with Email
                </button>
              </div>

              <div className="text-center text-xs text-black mb-4">
                — OR —
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-transparent border-b border-[#3A2E25] text-sm px-1 py-1 outline-none placeholder-black text-black"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-[#3A2E25] text-sm px-1 py-1 outline-none placeholder-black text-black"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent border-b border-[#3A2E25] text-sm px-1 py-1 outline-none placeholder-black text-black"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full bg-transparent border-b border-[#3A2E25] text-sm px-1 py-1 outline-none placeholder-black text-black"
                />
              </div>
            </div>

            <div>
              <button className="w-full bg-black text-white text-sm py-2 rounded mt-5">
                Create Account
              </button>

              <p className="text-[10px] text-center mt-3 text-black">
                Already have an account?
                <a href="/login" className="underline ml-1">
                  Login
                </a>
              </p>

              <p className="text-[9px] text-right mt-3 text-black">
                Terms & Conditions
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}