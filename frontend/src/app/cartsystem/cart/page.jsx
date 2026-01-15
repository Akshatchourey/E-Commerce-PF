"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Minus, ShoppingBag, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar/navbar";
export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giftWrap, setGiftWrap] = useState(false);
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch('/api/cart/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: newQuantity
        })
      });

      if (response.ok) {
        setCartItems(cartItems.map(item =>
          item.product.public_product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        console.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch('/api/cart/', {
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
        setCartItems(cartItems.filter(
          item => item.product.public_product_id !== productId
        ));
      } else {
        console.error('Failed to remove item');
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading cart</p>
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
                      <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 shrink-0 shadow-md overflow-hidden">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
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
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(
                                item.product.public_product_id,
                                item.quantity - 1
                              )}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(
                                item.product.public_product_id,
                                item.quantity + 1
                              )}
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
                  <Link href="/shop">
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
                  onCheckedChange={(checked) => setGiftWrap(checked)}
                  className="mt-1"
                />
                <label htmlFor="wrap" className="text-sm flex-1 cursor-pointer">
                  <span className="font-medium">Gift Wrap</span>
                  <p className="text-gray-600 mt-1">Add beautiful gift wrapping for $10.00</p>
                </label>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {giftWrap && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gift Wrap</span>
                    <span className="font-semibold">${giftWrapCost.toFixed(2)}</span>
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
                  <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
              {cartItems.length > 0 ? (
                  <Link href="/cartsystem/checkout">
                    <Button className="...">
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full mb-3 bg-gray-400 text-white h-12 text-base font-semibold cursor-not-allowed"
                    disabled
                  >
                    Proceed to Checkout
                  </Button>
                )}

              <Link href="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
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