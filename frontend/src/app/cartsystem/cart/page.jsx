"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Minus, ShoppingBag, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar/navbar";
import { API_BASE, authenticatedFetch } from "@/lib/api";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giftWrap, setGiftWrap] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  // 1. Using the sync-cart-wishlist endpoint and authenticatedFetch
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`${API_BASE}/api/sync-cart-wishlist/`);
      if (response.ok) {
        const data = await response.json();
        // sync-cart-wishlist returns { cart: [], wishlist: [] }
        setCartItems(data.cart || []);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Using PATCH method as required by manage_cart view
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await authenticatedFetch(`${API_BASE}/api/cart/`, {
        method: 'PATCH',
        body: JSON.stringify({
          product_id: productId,
          quantity: newQuantity
        })
      });

      if (response.ok) {
        setCartItems(prev => prev.map(item =>
          item.product.public_product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ));
        // Notify Navbar to update cart count
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/api/cart/`, {
        method: 'DELETE',
        body: JSON.stringify({
          product_id: productId
        })
      });

      if (response.ok) {
        setCartItems(prev => prev.filter(
          item => item.product.public_product_id !== productId
        ));
        // Notify Navbar to update cart count
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) =>
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );
  const giftWrapCost = giftWrap ? 10.00 : 0;
  const total = subtotal + giftWrapCost;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl font-serif">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <Navbar/>
      <div className="text-center pt-12 pb-8">
        <h2 className="text-4xl md:text-5xl font-serif mb-3 text-gray-900">Your Cart</h2>
        <p className="text-gray-600">Review your items and proceed to checkout</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="p-6 shadow-lg border-0 bg-white">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                Shopping Items ({cartItems.length})
              </h3>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                  <Link href="/shoppage">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div
                      key={item.product.public_product_id}
                      className="flex gap-6 pb-6 border-b mb-6 last:border-b-0"
                    >
                      <div className="relative w-32 h-32 rounded-lg bg-stone-100 shrink-0 shadow-sm overflow-hidden border">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="h-[220px] w-full object-cover rounded-[6px]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-amber-50">
                            <ShoppingBag className="text-amber-200 w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">{item.product.title}</h4>
                          <p className="text-sm text-gray-600 mb-1">Seller: {item.product.seller}</p>
                          <p className="text-sm text-gray-500 mb-3">Category: {item.product.category}</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{parseFloat(item.product.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(item.product.public_product_id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(item.product.public_product_id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.product.public_product_id)}
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

          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg border-0 bg-white sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg mb-6">
                <Checkbox
                  id="wrap"
                  checked={giftWrap}
                  onCheckedChange={(checked) => setGiftWrap(!!checked)}
                  className="mt-1"
                />
                <label htmlFor="wrap" className="text-sm flex-1 cursor-pointer">
                  <span className="font-medium">Gift Wrap</span>
                  <p className="text-gray-600 mt-1">Add beautiful gift wrapping for ₹10.00</p>
                </label>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {giftWrap && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gift Wrap</span>
                    <span className="font-semibold">₹{giftWrapCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {cartItems.length > 0 ? (
                <Link href="/cartsystem/checkout">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg font-semibold rounded-md">
                    Proceed to Checkout
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full bg-gray-300 text-gray-500 h-12 text-lg font-semibold cursor-not-allowed"
                  disabled
                >
                  Proceed to Checkout
                </Button>
              )}

              <Link href="/shoppage">
                <Button variant="outline" className="w-full mt-3">
                  Back to Shop
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

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