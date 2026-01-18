"use client"
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowUp, ChevronLeft, ChevronRight, Star, Heart, Bell, User, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import Image from 'next/image';

export default function CraftedRootsHomepage() {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 6,
    mins: 5,
    secs: 30
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroProducts, setHeroProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});

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

  useEffect(() => {
    fetchProducts({ limit: 20, ordering: '-created_at' })
      .then(data => {
        const products = data.results.products || [];
        
        if (products.length > 0) {
          setNewArrivals(products.slice(1, 7));
          // Set hero products 
          setHeroProducts([
            products[4],
            products[1],
            products[2],
            products[3]
          ]);
          // Set deal products - select 3-5 random products for slider
          const shuffled = [...products].sort(() => Math.random() - 0.5);
          const randomCount = Math.floor(Math.random() * 3) + 3; // 3-5 products
          setDealProducts(shuffled.slice(0, randomCount));
        }
      })
      .catch(err => console.error("Error fetching products:", err));
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

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({...prev, [index]: true}));
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
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                {!loadedImages[0] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                )}
                {heroProducts[0]?.image ? (
                  <img 
                    src={`${heroProducts[0].image}?w=400&q=60`} 
                    alt={heroProducts[0].title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onLoad={() => handleImageLoad(0)}
                    style={{filter: loadedImages[0] ? 'none' : 'blur(10px)'}}
                  />
                ) : (
                  <p className="text-gray-500 text-sm">No image</p>
                )}
              </div>
            </div>

            {/* Center Sale Banner */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-8 flex flex-col justify-center items-center text-center border border-gray-200">
              <div className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                  {!loadedImages[1] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  {heroProducts[1]?.image ? (
                    <img 
                      src={`${heroProducts[1].image}?w=500&q=60`} 
                      alt={heroProducts[1].title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onLoad={() => handleImageLoad(1)}
                      style={{filter: loadedImages[1] ? 'none' : 'blur(10px)'}}
                    />
                  ) : (
                    <p className="text-gray-500 text-xs">No image</p>
                  )}
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">ULTIMATE</h2>
              <h3 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-4 tracking-wider">SALE</h3>
              <p className="text-gray-600 mb-6 text-sm uppercase tracking-wider">New Collection</p>
              <button onClick={() => router.push('/shoppage')} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition-colors shadow-sm">
                SHOP NOW
              </button>
            </div>

            {/* Right Side - Two Images Stacked */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transform hover:shadow-md transition-all duration-300 flex-1">
                <div className="h-full bg-gray-100 flex items-center justify-center relative min-h-60">
                  {!loadedImages[2] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  {heroProducts[2]?.image ? (
                    <img 
                      src={`${heroProducts[2].image}?w=400&q=60`} 
                      alt={heroProducts[2].title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onLoad={() => handleImageLoad(2)}
                      style={{filter: loadedImages[2] ? 'none' : 'blur(10px)'}}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">No image</p>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transform hover:shadow-md transition-all duration-300 flex-1">
                <div className="h-full bg-gray-100 flex items-center justify-center relative min-h-60">
                  {!loadedImages[3] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  {heroProducts[3]?.image ? (
                    <img 
                      src={`${heroProducts[3].image}?w=400&q=60`} 
                      alt={heroProducts[3].title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onLoad={() => handleImageLoad(3)}
                      style={{filter: loadedImages[3] ? 'none' : 'blur(10px)'}}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">No image</p>
                  )}
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
              <button onClick={() => router.push('/shoppage')} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition-colors shadow-sm">
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
            <div className="relative w-full">
              {dealProducts.length > 0 ? (
                <>
                  <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="aspect-video w-full bg-gray-100 flex items-center justify-center relative">
                      {!loadedImages[`deal-${currentSlide}`] && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10"></div>
                      )}
                      {dealProducts[currentSlide]?.image && (
                        <img 
                          src={`${dealProducts[currentSlide].image}?w=600&q=75`} 
                          alt={dealProducts[currentSlide].title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onLoad={() => handleImageLoad(`deal-${currentSlide}`)}
                        />
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{dealProducts[currentSlide]?.title}</h3>
                      <p className="text-orange-500 font-bold mt-2 text-lg">₹{dealProducts[currentSlide]?.price}</p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
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
                </>
              ) : (
                <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-lg"></div>
              )}
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
              <ProductCard key={product.public_product_id} product={product} />
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
        <button onClick={() => router.push('/shoppage')} className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors">
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