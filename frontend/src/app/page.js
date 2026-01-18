import Login from "@/app/sign-in/login/page"
import CheckoutPage from "./cartsystem/checkout/page";
import Shop from "@/app/shoppage/page"
import CraftedRootsProduct from "./product/page";
export default function Home() {
  return (
   <>
   <div className="bg-[#FFF9EF] h-screen w-screen">
    <CraftedRootsProduct/>
   </div>
   </>
  );
}
