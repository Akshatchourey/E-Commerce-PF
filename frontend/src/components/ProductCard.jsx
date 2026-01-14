"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { addToCart } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      await addToCart(product.public_product_id, 1);
      alert("Added to cart successfully!");
    } catch (error) {
      if (error.message.includes("Unauthorized")) {
         if(confirm("You need to log in to add items. Go to login?")) {
            router.push("/sign-in/login");
         }
      } else {
         alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-[14px] rounded-[8px] cursor-pointer hover:shadow-lg transition-shadow border border-gray-100">
      <div className="relative h-[220px] w-full">
        <img
        src={product.image}
        alt={product.title}
        className="h-[220px] w-full object-cover rounded-[6px]"
        loading="lazy"
      />
      </div>

      <h3 className="mt-[8px] text-[14px] font-medium text-gray-900 truncate">
        {product.title}
      </h3>

      <div className="flex justify-between items-center mt-2">
         <p className="text-[13px] text-gray-700 font-semibold">
            ₹{product.price}
         </p>
         
         <button 
            onClick={handleAddToCart}
            disabled={loading}
            className={`text-[12px] px-3 py-1.5 rounded transition-colors ${
               loading 
               ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
               : "bg-black text-white hover:bg-gray-800"
            }`}
         >
            {loading ? "Adding..." : "🛒 Add"}
         </button>
      </div>
    </div>
  );
}