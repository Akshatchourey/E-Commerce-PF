import Image from "next/image";
import ProductDetails from "@/app/product/page"
import Login from "@/app/sign-in/login/page"
import Signup from "./sign-in/signup/page";
import Navbar from "@/components/navbar/navbar"
import CartPage from "./cartsystem/cart/page";
import CheckoutPage from "./cartsystem/checkout/page"
export default function Home() {
  return (
   <>
   <div className="bg-[#FFF9EF] h-screen w-screen">
    <Navbar/>
    <CartPage/>
   </div>
   </>
  );
}
