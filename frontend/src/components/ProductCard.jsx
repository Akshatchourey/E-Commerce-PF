"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { addToCart, addToWishlist, removeFromWishlist } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleWishlistUpdate = (event) => {
      // Optimistically update based on the event detail
      const detail = event.detail;
      if (detail && detail.productId === product.public_product_id) {
        setIsInWishlist(detail.action === "add");
      }
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [product.public_product_id]);

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

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    
    // Optimistic update - update UI immediately
    const newWishlistState = !isInWishlist;
    setIsInWishlist(newWishlistState);
    setWishlistLoading(true);

    try {
      if (newWishlistState) {
        await addToWishlist(product.public_product_id);
      } else {
        await removeFromWishlist(product.public_product_id);
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsInWishlist(!newWishlistState);
      
      if (error.message.includes("Unauthorized")) {
        if(confirm("You need to log in to use wishlist. Go to login?")) {
          router.push("/sign-in/login");
        }
      } else {
        alert(error.message);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div 
      onClick={() => router.push(`/product/${product.public_product_id}`)}
      className="bg-white p-[14px] rounded-[8px] cursor-pointer hover:shadow-lg transition-shadow border border-gray-100">
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
      </div>

      <div className="flex justify-between items-center mt-3 gap-2">
         <button 
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`text-[20px] p-2 rounded transition-colors ${
               wishlistLoading 
               ? "opacity-50 cursor-not-allowed" 
               : isInWishlist
               ? "text-red-500 hover:text-red-600"
               : "text-gray-400 hover:text-red-500"
            }`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
         >
            <Heart 
              size={20} 
              fill={isInWishlist ? "currentColor" : "none"}
            />
         </button>

         <button 
            onClick={handleAddToCart}
            disabled={loading}
            className={`text-[12px] px-3 py-1.5 rounded flex-1 transition-colors ${
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