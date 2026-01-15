"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Trash2, ShoppingCart, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar/navbar";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.error('No access token found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/sync-cart-wishlist/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlist);
      } else {
        console.error('Failed to fetch wishlist items:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch('/api/wishlist/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          product_id: productId
        })
      });

      if (response.ok) {
        setWishlistItems(wishlistItems.filter(
          item => item.product.public_product_id !== productId
        ));
      } else {
        console.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch('/api/transfer-to-cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });

      if (response.ok) {
        // Remove from wishlist after adding to cart
        setWishlistItems(wishlistItems.filter(
          item => item.product.public_product_id !== productId
        ));
      } else {
        console.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <Navbar/>
      <div className="text-center pt-12 pb-8">
        <h2 className="text-4xl md:text-5xl font-serif mb-3 text-gray-900">Your Wishlist</h2>
        <p className="text-gray-600">Items you've saved for later</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <Card className="p-6 shadow-lg border-0 bg-white">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-600" />
            Saved Items ({wishlistItems.length})
          </h3>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
              <Link href="/shoppage">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {wishlistItems.map((item) => (
                <div
                  key={item.product.public_product_id}
                  className="flex gap-6 pb-6 border-b mb-6 last:border-b-0"
                >
                  <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 shrink-0 shadow-md overflow-hidden">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-24 bg-amber-300/50 rounded-md"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">
                        {item.product.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        Seller: {item.product.seller}
                      </p>
                      {item.product.category && (
                        <p className="text-sm text-gray-500 mb-3">
                          Category: {item.product.category}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-gray-900">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => addToCart(item.product.public_product_id)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromWishlist(item.product.public_product_id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/shoppage">
                <Button variant="outline" className="mt-6 w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </>
          )}
        </Card>
      </div>
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-3xl font-serif mb-3">Stay Updated</h3>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="your@email.com"
              />
              <Button className="bg-white text-amber-700 hover:bg-amber-50 px-8 font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-2xl font-serif mb-4">CRAFTEDROOTS</h4>
              <p className="text-gray-400 text-sm">
                Premium quality products for your home and lifestyle.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Shop</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2026 CraftedRoots. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
