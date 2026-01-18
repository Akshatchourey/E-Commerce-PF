"use client"
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, Package, Award, Check } from 'lucide-react';
import Navbar from '@/components/navbar/navbar';
import { fetchProducts } from '@/lib/api';

export default function CraftedRootsProduct() {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = ['Main View', 'Side View', 'Detail View', 'Back View'];

  const recommendations = [
    { id: 1, name: 'Handwoven Basket', price: '$45.99', rating: 5, discount: '15% OFF' },
    { id: 2, name: 'Ceramic Mug Set', price: '$34.99', rating: 4.5, discount: '20% OFF' },
    { id: 3, name: 'Wooden Coasters', price: '$18.99', rating: 5, discount: '10% OFF' },
    { id: 4, name: 'Macrame Wall Hanging', price: '$67.99', rating: 4.8, discount: '25% OFF' }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      date: 'Jan 10, 2025',
      comment: 'Absolutely love this jute bag! The quality is exceptional and it\'s so versatile. Perfect for daily use.',
      verified: true,
      helpful: 24
    },
    {
      id: 2,
      name: 'Michael Chen',
      rating: 4,
      date: 'Jan 5, 2025',
      comment: 'Great product! Sturdy and well-made. Only wish it came in more color options.',
      verified: true,
      helpful: 18
    },
    {
      id: 3,
      name: 'Emma Williams',
      rating: 5,
      date: 'Dec 28, 2024',
      comment: 'Perfect gift for my eco-conscious friend. She absolutely loved it! Fast shipping too.',
      verified: true,
      helpful: 31
    }
  ];

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      
    <Navbar/>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">Home</a>
            <span>/</span>
            <a href="#" className="hover:text-gray-900 transition-colors">Shop</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Jute Bag</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 group">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-lg font-medium">{productImages[selectedImage]}</p>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              {/* Discount Badge */}
              <div className="absolute top-6 left-6 bg-orange-500 text-white px-4 py-2 rounded font-bold shadow-md">
                29% OFF
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg shadow-sm overflow-hidden border transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-2 border-gray-900 shadow-md' 
                      : 'border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <p className="text-xs text-gray-500 font-semibold">{index + 1}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">JUTE BAG</h1>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(5)}
                </div>
                <span className="text-gray-600 font-medium">(248 reviews)</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">In Stock</span>
              </div>
              
              <div className="flex items-baseline gap-3 mb-6">
                <h3 className="text-4xl font-bold text-gray-900">$200</h3>
                <span className="text-xl text-gray-400 line-through">$280</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-bold text-lg text-gray-900 mb-3 uppercase tracking-wide">Description</h4>
              <p className="text-gray-600 leading-relaxed text-base">
                Handcrafted jute bag made from 100% natural, sustainable materials. Perfect for daily use, 
                shopping, or as an eco-friendly gift. Each bag is carefully woven by skilled artisans, 
                ensuring durability and unique character. Features reinforced handles and spacious interior.
              </p>
            </div>

            {/* Selection Box */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 space-y-6 shadow-sm">
              {/* Quantity and Cart Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-gray-100 rounded-full px-6 py-3 border border-gray-300">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-gray-200 rounded-full transition-all duration-300"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <span className="text-2xl font-semibold px-6 text-gray-900 min-w-[4ch] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-gray-200 rounded-full transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full py-4 px-8 flex items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md">
                  <ShoppingCart className="w-5 h-5" />
                  ADD TO CART
                </button>
              </div>

              <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold rounded-full py-4 transition-all duration-300 shadow-sm hover:shadow-md uppercase tracking-wide">
                Buy Now
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
              {[
                { icon: Truck, title: 'Free Shipping', desc: 'Orders over $50' },
                { icon: RotateCcw, title: '30-Day Returns', desc: 'Easy returns' },
                { icon: Shield, title: 'Quality Assured', desc: 'Premium crafted' },
                { icon: Package, title: 'Secure Packaging', desc: 'Protected delivery' },
                { icon: Award, title: 'Handcrafted', desc: 'By skilled artisans' },
                { icon: Check, title: 'Eco-Friendly', desc: '100% natural' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="bg-gray-100 rounded-full p-3">
                    <feature.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">You May Also Like</h2>
            <p className="text-gray-600">Discover more handcrafted treasures</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 group">
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-sm font-medium">{product.name}</p>
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">
                    {product.discount}
                  </div>
                  <button className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 hover:fill-red-500" />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-xs text-gray-600">(4.8)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{product.price}</span>
                    <button className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-all duration-300">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Customer Reviews</h2>
            <p className="text-gray-600">See what our customers are saying</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-6xl font-bold text-gray-900 block">4.8</span>
                  <div className="flex justify-center mt-2">{renderStars(5)}</div>
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900">Excellent</p>
                  <p className="text-sm text-gray-600">Based on 248 reviews</p>
                </div>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg transition-all duration-300 font-semibold uppercase tracking-wide shadow-sm hover:shadow-md">
                Write a Review
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center font-bold text-gray-700 text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base">{review.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-600">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-3 py-1 rounded font-semibold mt-2">
                        <Check className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                    <span>👍</span>
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a202c] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </div>
  );
}