import Signup from "./signUp.jsx"
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">

      <div className="bg-[#8B735E] p-6">

        <div className="flex w-900px h-460px">

        
          <div className="w-1/2 bg-[#8B735E] flex items-center justify-center">
          
          </div>

         
          <div className="w-1/2 bg-[#E6C9A0] px-14 py-12 flex flex-col justify-between">

          
            <div>
              <h1 className="text-2xl font-serif text-[#3A2E25] mb-4">
                Crafted Roots
              </h1>

              <p className="text-sm text-[#3A2E25] mb-5">
                Sign In To Crafted Roots
              </p>

              <div className="flex gap-3 mb-5">
                <button className="flex-1 flex items-center justify-center gap-2 border border-[#3A2E25] bg-white py-1.5 text-xs rounded text-black">
                  Sign up with Google
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-[#3A2E25] bg-white py-1.5 text-xs rounded text-black">
                  Sign up with Email
                </button>
              </div>

            
              <div className="text-center text-xs text-[#3A2E25] mb-6">
                — OR —
              </div>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent border-b border-[#3A2E25] px-1 py-1 text-sm outline-none placeholder-[#5A4A3C] text-black"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent border-b border-[#3A2E25] px-1 py-1 text-sm outline-none placeholder-[#5A4A3C] text-black"
                />
              </div>
            </div>

          
            <div>
              <button className="w-full bg-black text-white py-2 rounded mt-6 text-sm">
                Sign In
              </button>

              <button className="w-full border border-[#3A2E25] text-[#3A2E25] py-2 rounded mt-3 text-xs">
                Register Now
              </button>

              <p className="text-[10px] text-right mt-3 text-[#3A2E25] underline cursor-pointer">
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