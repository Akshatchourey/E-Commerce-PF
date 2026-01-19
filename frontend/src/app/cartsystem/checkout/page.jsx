"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingBag, CreditCard, Truck, Tag, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import { API_BASE, authenticatedFetch } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Detailed UI States for Address
  const [addressDetails, setAddressDetails] = useState({
    houseNo: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");

  // Logic States
  const [giftWrap, setGiftWrap] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  useEffect(() => {
    fetchCheckoutSummary();
  }, []);

  const fetchCheckoutSummary = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/api/sync-cart-wishlist/`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart || []);
        if (data.cart.length === 0) router.push("/cartsystem/cart");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddressDetails({ ...addressDetails, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await authenticatedFetch(`${API_BASE}/api/apply-offer/`, {
        method: "POST",
        body: JSON.stringify({ coupon: couponCode, cart_total: subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedDiscount(data.discount_amount);
      } else {
        alert(data.detail || "Invalid Coupon");
        setAppliedDiscount(0);
      }
    } catch (err) {
      console.error("Coupon error:", err);
    }
  };

  const total = subtotal - appliedDiscount + (giftWrap ? 10 : 0);

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate detailed fields
    const { houseNo, area, city, state, pincode } = addressDetails;
    if (!houseNo || !area || !city || !state || !pincode || !phoneNumber) {
      alert("Please fill in all required delivery fields.");
      return;
    }

    // Concatenate fields for the backend "shipping_address" field
    const fullAddress = `${houseNo}, ${area}, ${addressDetails.landmark ? addressDetails.landmark + ', ' : ''}${city}, ${state} - ${pincode}`;

    setProcessing(true);

    try {
      const orderRes = await authenticatedFetch(`${API_BASE}/api/create-order/`, {
        method: "POST",
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_id: item.product.public_product_id,
            quantity: item.quantity,
          })),
          shipping_address: fullAddress,
          phone_number: phoneNumber,
          coupon: couponCode,
          gift_wrap: giftWrap,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Crafted Roots",
        description: "Order Payment",
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          const verifyRes = await authenticatedFetch(`${API_BASE}/api/verify-payment/`, {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            router.push("/cartsystem/complete");
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: { contact: phoneNumber },
        theme: { color: "#8B735E" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-serif text-[#8B735E]">Loading Checkout...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Left Side: Detailed Forms (3 cols) */}
          <div className="lg:col-span-3 space-y-8">
            <section>
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-2 text-[#3A2E25]">
                <MapPin className="w-6 h-6 text-[#8B735E]" /> Delivery Address
              </h2>
              <Card className="p-8 space-y-6 shadow-sm border-0 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">House / Flat No.</label>
                    <Input name="houseNo" placeholder="e.g. 102, Royal Apt" onChange={handleAddressChange} />
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Area / Colony</label>
                    <Input name="area" onChange={handleAddressChange} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Landmark (Optional)</label>
                  <Input name="landmark" onChange={handleAddressChange} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">City</label>
                    <Input name="city" placeholder="Bhopal" onChange={handleAddressChange} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">State</label>
                    <Input name="state" placeholder="MP" onChange={handleAddressChange} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Pincode</label>
                    <Input name="pincode" placeholder="462001" onChange={handleAddressChange} />
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-6 flex items-center gap-2 text-[#3A2E25]">
                <Phone className="w-6 h-6 text-[#8B735E]" /> Contact Information
              </h2>
              <Card className="p-8 shadow-sm border-0 bg-white">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Primary Mobile Number</label>
                <Input
                  type="tel"
                  placeholder="+91 00000 00000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Card>
            </section>
          </div>

          {/* Right Side: Summary (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 shadow-xl border-0 bg-white sticky top-24">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[#3A2E25]">
                <ShoppingBag className="w-5 h-5 text-[#8B735E]" /> Order Summary
              </h3>

              <div className="space-y-4 mb-6 border-b pb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Apply Coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="uppercase"
                  />
                  <Button onClick={handleApplyCoupon} variant="outline" className="border-[#8B735E] text-[#8B735E]">Apply</Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded border border-dashed border-stone-200">
                  <Checkbox
                    id="gift_wrap"
                    checked={giftWrap}
                    onCheckedChange={(checked) => setGiftWrap(!!checked)}
                  />
                  <label htmlFor="gift_wrap" className="text-sm cursor-pointer font-medium text-gray-700">
                    Add Gift Wrap (+₹10)
                  </label>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount Applied</span>
                    <span>-₹{appliedDiscount.toFixed(2)}</span>
                  </div>
                )}
                {giftWrap && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Gift Wrapping</span>
                    <span>₹10.00</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-double">
                  <span className="text-lg font-bold text-[#3A2E25]">Final Total</span>
                  <span className="text-3xl font-bold text-[#8B735E]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-[#3A2E25] hover:bg-black text-white h-14 text-lg font-bold rounded shadow-lg"
              >
                {processing ? "Processing..." : "Complete Order"}
              </Button>

              <p className="text-[10px] text-center mt-4 text-gray-400 uppercase tracking-widest">
                Protected by Razorpay Secure
              </p>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}