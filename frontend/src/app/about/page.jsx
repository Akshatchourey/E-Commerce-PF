"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import { 
  Heart, 
  Users, 
  Target, 
  Award,
  ShoppingBag,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <Navbar/>
      <div className="text-center pt-16 pb-12">
        <h1 className="text-5xl md:text-6xl font-serif mb-4 text-gray-900">About Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-6">
          Discover the story behind CraftedRoots - where tradition meets modern craftsmanship.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <Card className="p-8 md:p-12 shadow-lg border-0 bg-white mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-serif mb-4 text-gray-900">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Description
              </p>
            </div>
            <div className="h-64 md:h-96 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg flex items-center justify-center">
              <Sparkles className="w-24 h-24 text-amber-600" />
            </div>
          </div>
        </Card>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 shadow-lg border-0 bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality First</h3>
            <p className="text-gray-600 text-sm">
              Every product is handpicked and meets our rigorous quality standards.
            </p>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600 text-sm">
              We support local artisans and craftspeople in their creative journey.
            </p>
          </Card>
          <Card className="p-6 shadow-lg border-0 bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
            <p className="text-gray-600 text-sm">
              Committed to eco-friendly practices and sustainable sourcing.
            </p>
          </Card>

          <Card className="p-6 shadow-lg border-0 bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600 text-sm">
              Striving for excellence in every aspect of our business.
            </p>
          </Card>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 shadow-lg border-0 bg-white">
            <h2 className="text-2xl font-serif mb-4 text-gray-900">Our Mission</h2>
            <p className="text-gray-600">
              To connect people with authentic, handcrafted products that celebrate 
              tradition and quality. We believe in supporting artisans and preserving 
              traditional crafts while making them accessible to modern consumers.
            </p>
          </Card>
          <Card className="p-8 shadow-lg border-0 bg-white">
            <h2 className="text-2xl font-serif mb-4 text-gray-900">Our Vision</h2>
            <p className="text-gray-600">
              To become the leading platform for authentic handcrafted products, 
              creating a sustainable ecosystem that benefits artisans, customers, 
              and communities while preserving cultural heritage.
            </p>
          </Card>
        </div>
        <Card className="p-8 md:p-12 shadow-lg border-0 bg-gradient-to-br from-amber-600 to-amber-700 text-white text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-serif mb-4">Explore Our Collection</h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Discover unique, handcrafted products that bring beauty and meaning to your everyday life.
          </p>
          <Link href="/shoppage">
            <Button className="bg-white text-amber-700 hover:bg-amber-50 px-8 py-3 font-semibold">
              Shop Now
            </Button>
          </Link>
        </Card>

      </div>
    </div>
  );
}
