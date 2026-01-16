"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ShoppingBag, ArrowRight, Package, Home } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import confetti from "canvas-confetti"; // run for animation: npm install canvas-confetti

export default function OrderCompletePage() {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // 1. Fire confetti for a celebratory feel
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <Card className="p-12 shadow-2xl border-0 bg-white rounded-3xl relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400" />

          <div className="flex justify-center mb-8">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600 animate-bounce" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your order has been placed successfully and is now being processed by our artisans.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <Package className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Shipping Status</p>
              <p className="text-sm font-medium text-gray-900">Preparing for Dispatch</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <ShoppingBag className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Confirmation</p>
              <p className="text-sm font-medium text-gray-900">Email Receipt Sent</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shoppage" className="w-full sm:w-auto">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 px-8 flex gap-2">
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 px-8 border-stone-200 text-stone-600 hover:bg-stone-50 flex gap-2">
                <Home className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </Card>

        <div className="mt-12 text-gray-400 text-sm">
          <p>Need help with your order? <Link href="/support" className="text-amber-600 hover:underline">Contact Support</Link></p>
        </div>
      </main>

      {/* Trust Badges */}
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-stone-200 mt-20">
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
          <p className="font-serif italic text-xl">Crafted Roots</p>
          <div className="flex items-center gap-2 text-sm font-bold">
             SECURE CHECKOUT
          </div>
          <div className="flex items-center gap-2 text-sm font-bold">
             EST. 2026
          </div>
        </div>
      </footer>
    </div>
  );
}