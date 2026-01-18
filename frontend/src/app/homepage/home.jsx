"use client"
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowUp, ChevronLeft, ChevronRight, Star, Heart, Bell, User, Search } from 'lucide-react';
import Navbar from '@/components/navbar/navbar';
export default function CraftedRootsHomepage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 6,
    mins: 5,
    secs: 30
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  
  const dealProducts = [
    { id: 1, name: 'Woven Basket' },
    { id: 2, name: 'Embroidered Pouch' },
    { id: 3, name: 'Sunflower Art' }
  ];

  const newArrivals = [
    { id: 1, name: 'Soy Wax Candles', price: '$24.99', reviews: 156, rating: 5 },
    { id: 2, name: 'Warli Handpainted Panels', price: '$89.99', reviews: 89, rating: 5 },
    { id: 3, name: 'Wooden Keychains', price: '$12.99', reviews: 203, rating: 5 },
    { id: 4, name: 'Handmade Soaps', price: '$18.99', reviews: 142, rating: 5 },
    { id: 5, name: 'Hand painted Lamps', price: '$54.99', reviews: 78, rating: 5 },
    { id: 6, name: 'Jute Bags', price: '$34.99', reviews: 167, rating: 5 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        
        if (secs > 0) {
          secs--;
        } else {
          secs = 59;
          if (mins > 0) {
            mins--;
          } else {
            mins = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, mins, secs };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dealProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + dealProducts.length) % dealProducts.length);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
     <Navbar/>
      {/* Hero Section */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Product Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transform hover:shadow-md transition-all duration-300">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Product Image 1</p>
              </div>
            </div>

            {/* Center Sale Banner */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-8 flex flex-col justify-center items-center text-center border border-gray-200">
              <div className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-xs">Banner Image</p>
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">ULTIMATE</h2>
              <h3 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-4 tracking-wider">SALE</h3>
              <p className="text-gray-600 mb-6 text-sm uppercase tracking-wider">New Collection</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition-colors shadow-sm">
                SHOP NOW
              </button>
            </div>

            {/* Right Side - Two Images Stacked */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transform hover:shadow-md transition-all duration-300 flex-1">
                <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Product Image 2</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transform hover:shadow-md transition-all duration-300 flex-1">
                <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Product Image 3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">Deals Of The Month</h2>
              <p className="text-gray-600 leading-relaxed">
                Get excited and handcrafted with passion. Our handmade crafts are born high-quality natural materials.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition-colors shadow-sm">
                Buy Now
              </button>
              
              <div className="pt-6">
                <p className="text-lg font-semibold text-gray-900 mb-4">Hurry, Before It's Too Late!</p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: timeLeft.days.toString().padStart(2, '0'), label: 'Days' },
                    { value: timeLeft.hours.toString().padStart(2, '0'), label: 'Hr' },
                    { value: timeLeft.mins.toString().padStart(2, '0'), label: 'Mins' },
                    { value: timeLeft.secs.toString().padStart(2, '0'), label: 'Sec' }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <span className="text-3xl font-bold text-gray-900">{item.value}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Carousel */}
            <div className="relative">
              <div className="flex gap-4 overflow-hidden">
                {dealProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`transition-all duration-500 ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
                    }`}
                    style={{ display: index === currentSlide ? 'block' : 'none' }}
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">{product.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {dealProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif">New Arrivals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed with care and handcrafted with precision, our handmade articles are made from high-quality natural materials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 group">
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">{product.name}</p>
                  <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 hover:fill-red-500" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">({product.reviews}) Customer Reviews</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a202c] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">CRAFTEDROOTS</h3>
              <p className="text-gray-400 text-sm">Premium quality products for your home</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <button className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors">
          <ShoppingCart className="w-6 h-6" />
        </button>
        <button
          onClick={scrollToTop}
          className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}