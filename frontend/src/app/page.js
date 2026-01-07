import Image from "next/image";
import ProductDetails from "@/app/product/productDetails"
import Login from "@/app/sign-in/login"
import Signup from "./sign-in/signUp";
import Navbar from "@/components/navbar/navbar"
export default function Home() {
  return (
   <>
   <div className="bg-[#FFF9EF] h-screen w-screen">
    <Navbar/>
   <ProductDetails/>
   </div>
   </>
  );
}
