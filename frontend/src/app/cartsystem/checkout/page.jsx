"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  CreditCard, 
  ShoppingBag, 
  Lock, 
  Mail, 
  MapPin, 
  User,
  Tag
} from "lucide-react";
import { useState } from "react";

export default function CheckoutPage() {
  const [saveInfo, setSaveInfo] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = 100.00;
  const shipping = 40.00;
  const discount = discountApplied ? 10.00 : 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/cartsystem/cart">
          <Button variant="outline" className="gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </Button>
          </Link>
          
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
              ✓
            </div>
            <span className="text-gray-600">Cart</span>
          </div>
          <div className="w-12 h-0.5 bg-[#F5F1E8]"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5F1E8] text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="font-semibold">Checkout</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
              3
            </div>
            <span className="text-gray-400">Complete</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif mb-2 text-gray-900">Checkout</h2>
        <p className="text-gray-600">Complete your purchase securely</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* LEFT: Checkout Form - 3 columns */}
          <div className="lg:col-span-3">
            <Card className="p-6 md:p-8 shadow-lg border-0 bg-white">
              
              {/* Contact Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 bg-[#F5F1E8]" />
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                </div>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="h-12"
                />
              </div>

              {/* Delivery Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 bg-[#F5F1E8]" />
                  <h3 className="text-xl font-semibold">Delivery Address</h3>
                </div>

                <div className="space-y-4">
                  <select className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#F5F1E8]">
                    <option>India</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="First Name" className="h-12" />
                    <Input placeholder="Last Name" className="h-12" />
                  </div>

                  <Input placeholder="Street Address" className="h-12" />

                  <Input placeholder="Apartment, suite, etc. (optional)" className="h-12" />

                  <div className="grid md:grid-cols-3 gap-4">
                    <Input placeholder="City" className="h-12" />
                    <Input placeholder="State" className="h-12" />
                    <Input placeholder="ZIP Code" className="h-12" />
                  </div>

                  <Input placeholder="Phone Number" type="tel" className="h-12" />
                </div>

                <div className="flex items-start gap-3 mt-6 p-4 bg-amber-50 rounded-lg">
                  <Checkbox
                    id="save"
                    checked={saveInfo}
                    onCheckedChange={(checked) => setSaveInfo(checked)}
                    className="mt-1"
                  />
                  <label htmlFor="save" className="text-sm flex-1 cursor-pointer">
                    <span className="font-medium">Save this information</span>
                    <p className="text-gray-600 mt-1">For faster checkout next time</p>
                  </label>
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 bg-[#F5F1E8]" />
                  <h3 className="text-xl font-semibold">Payment Method</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border-2 border-amber-600 rounded-lg bg-amber-50">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span className="font-medium">Credit / Debit Card</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                    <input type="radio" name="payment" className="w-4 h-4" />
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                      <path d="M24 9.5C15.7 9.5 9 16.2 9 24.5C9 32.8 15.7 39.5 24 39.5C32.3 39.5 39 32.8 39 24.5C39 16.2 32.3 9.5 24 9.5Z" fill="#5F6368"/>
                      <path d="M24 37C17 37 11.5 31.5 11.5 24.5C11.5 17.5 17 12 24 12C31 12 36.5 17.5 36.5 24.5C36.5 31.5 31 37 24 37Z" fill="white"/>
                      <path d="M24 15C18.5 15 14 19.5 14 25C14 30.5 18.5 35 24 35C29.5 35 34 30.5 34 25C34 19.5 29.5 15 24 15Z" fill="#4285F4"/>
                      <path d="M24 32.5C20 32.5 16.5 29 16.5 25C16.5 21 20 17.5 24 17.5C28 17.5 31.5 21 31.5 25C31.5 29 28 32.5 24 32.5Z" fill="#34A853"/>
                      <path d="M24 30C21.2 30 19 27.8 19 25C19 22.2 21.2 20 24 20C26.8 20 29 22.2 29 25C29 27.8 26.8 30 24 30Z" fill="#FBBC04"/>
                      <path d="M24 27.5C22.6 27.5 21.5 26.4 21.5 25C21.5 23.6 22.6 22.5 24 22.5C25.4 22.5 26.5 23.6 26.5 25C26.5 26.4 25.4 27.5 24 27.5Z" fill="#EA4335"/>
                    </svg>
                    <span className="font-medium">Google Pay</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT: Order Summary - 2 columns */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg border-0 bg-white sticky top-24">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                Order Summary
              </h3>

              {/* Product Item */}
              <div className="flex gap-4 mb-6 pb-6 border-b">
                <div className="relative">
                  <div className="w-20 h-24 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <div className="w-14 h-16 bg-amber-300/50 rounded-md"></div>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#F5F1E8] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    1
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Bamboo Photo Frame</h4>
                  <p className="text-sm text-gray-600">Color: Red</p>
                  <p className="font-bold mt-2">${subtotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="h-10"
                  />
                  <Button
                    onClick={() => setDiscountApplied(true)}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    Apply
                  </Button>
                </div>
                {discountApplied && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <span className="font-medium">✓</span> Discount applied!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-semibold text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Purchase Button */}
              <Button className="w-full h-12 bg-[#F5F1E8] hover:bg-[#f5f1e826] text-white font-semibold shadow-md mb-3">
                <Lock className="w-4 h-4 mr-2" />
                Complete Purchase
              </Button>

              <p className="text-xs text-center text-gray-500">
                🔒 Your payment information is secure and encrypted
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-[#F5F1E8] to-[#f5f1e857] text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-3xl font-serif mb-3">Stay Updated</h3>
            <p className="text-amber-100 max-w-md mx-auto">
              Subscribe to our newsletter for exclusive offers and latest updates
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white outline-1"
                placeholder="your@email.com"
              />
              <Button className="bg-white text-amber-700 hover:bg-amber-50 px-8 font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-2xl font-serif mb-4">CraftedRoots</h4>
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
            © 2024 CraftedRoots. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}