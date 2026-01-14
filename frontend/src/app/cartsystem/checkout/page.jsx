"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Lock,
  Mail,
  MapPin,
  Tag
} from "lucide-react";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountData, setDiscountData] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [formData, setFormData] = useState({ //getch from user database some aspects
    email: "",
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;

    setApplyingCoupon(true);
    setCouponError(false);

    try {
      const response = await fetch('/api/apply-offer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          coupon: discountCode,
          cart_total: subtotal
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDiscountData(data);
        setCouponError(false);
      } else {
        // Trigger shake and red highlight
        setCouponError(true);
        setDiscountData(null);

        // Remove shake effect after animation completes
        setTimeout(() => setCouponError(false), 600);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError(true);
      setTimeout(() => setCouponError(false), 600);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName ||
        !formData.address || !formData.city || !formData.state ||
        !formData.zipCode || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Processing payment with Razorpay...', {
      formData,
      cartItems,
      total: finalTotal
    });

    alert('Payment processing will be integrated with Razorpay');
  };

  const subtotal = cartItems.reduce((sum, item) =>
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );
  const giftWrapCost = giftWrap ? 10.00 : 0;
  const shipping = subtotal > 0 ? 40.00 : 0;
  const discount = discountData ? parseFloat(discountData.discount_amount) : 0;
  const finalTotal = subtotal + giftWrapCost + shipping - discount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading checkout...</p>
      </div>
    );
  }
  //enable it when shop page is able to store data and cart will be able to fetch data
  /*if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <ShoppingBag className="w-16 h-16 text-gray-300" />
        <p className="text-xl text-gray-600">Your cart is empty</p>
        <Link href="/shoppage">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }*/

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
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
          <div className="w-12 h-0.5 bg-amber-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold">
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
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-serif mb-2 text-gray-900">Checkout</h2>
        <p className="text-gray-600">Complete your purchase securely</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="p-6 md:p-8 shadow-lg border-0 bg-white">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12"
                  required
                />
              </div>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-semibold">Delivery Address</h3>
                </div>

                <div className="space-y-4">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                  </div>

                  <Input
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />

                  <Input
                    name="apartment"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="h-12"
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                    <Input
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                    <Input
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                    />
                  </div>

                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
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
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Payment will be processed securely through Razorpay
                </p>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg border-0 bg-white sticky top-24">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                Order Summary ({cartItems.length} items)
              </h3>
              <div className="max-h-64 overflow-y-auto mb-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.public_product_id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="relative">
                      <div className="w-20 h-24 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 overflow-hidden">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                            width={80}
                            height={96}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-14 h-16 bg-amber-300/50 rounded-md"></div>
                          </div>
                        )}
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{item.product.title}</h4>
                      <p className="text-xs text-gray-600">by {item.product.seller}</p>
                      <p className="font-bold mt-2 text-sm">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg mb-6">
                <Checkbox
                  id="giftwrap"
                  checked={giftWrap}
                  onCheckedChange={(checked) => setGiftWrap(checked)}
                  className="mt-1"
                />
                <label htmlFor="giftwrap" className="text-sm flex-1 cursor-pointer">
                  <span className="font-medium">Gift Wrap</span>
                  <p className="text-gray-600 mt-1">Add beautiful gift wrapping for $10.00</p>
                </label>
              </div>

              {/* Discount Code with Shake Effect */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Discount Code
                </label>
                <div className={`flex gap-2 ${couponError ? 'shake-animation' : ''}`}>
                  <Input
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className={`h-10 transition-all ${
                      couponError
                        ? 'border-red-500 border-2 focus:ring-red-500 bg-red-50'
                        : ''
                    }`}
                  />
                  <Button
                    onClick={applyDiscount}
                    variant="outline"
                    className="whitespace-nowrap"
                    disabled={applyingCoupon}
                  >
                    {applyingCoupon ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
                {discountData && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <span className="font-medium">✓</span>
                    {discountData.discount_type === 'PERCENT'
                      ? `${discountData.discount_value}% discount applied!`
                      : `$${discountData.discount_value} discount applied!`}
                  </p>
                )}
                {couponError && !discountData && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <span className="font-medium">✗</span>
                    Invalid coupon code
                  </p>
                )}
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
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                </div>
                {discountData && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-semibold text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md mb-3"
              >
                <Lock className="w-4 h-4 mr-2" />
                Pay with Razorpay
              </Button>

              <p className="text-xs text-center text-gray-500">
                Your payment information is secure and encrypted
              </p>
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