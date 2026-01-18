"use client"
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, Package, Award, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import { fetchProductById, addToCart, addToWishlist, removeFromWishlist } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      date: 'Jan 15, 2026',
      comment: 'Absolutely love this product! The quality is exceptional and it arrived in perfect condition.',
      verified: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      rating: 4,
      date: 'Jan 10, 2026',
      comment: 'Great product! Sturdy and well-made. Only wish it came in more color options.',
      verified: true,
    },
    {
      id: 3,
      name: 'Emma Williams',
      rating: 5,
      date: 'Jan 5, 2026',
      comment: 'Perfect gift for my eco-conscious friend. She absolutely loved it! Fast shipping too.',
      verified: true,
    }
  ]);
  const [newComment, setNewComment] = useState({ name: '', rating: 5, comment: '' });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!product) return;
    
    setCartLoading(true);
    try {
      await addToCart(product.public_product_id, quantity);
      alert("Added to cart successfully!");
      setQuantity(1);
    } catch (error) {
      if (error.message.includes("Unauthorized")) {
        if (confirm("You need to log in to add items. Go to login?")) {
          router.push("/sign-in/login");
        }
      } else {
        alert(error.message);
      }
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    const newWishlistState = !isFavorite;
    setIsFavorite(newWishlistState);
    setWishlistLoading(true);

    try {
      if (newWishlistState) {
        await addToWishlist(product.public_product_id);
      } else {
        await removeFromWishlist(product.public_product_id);
      }
    } catch (error) {
      setIsFavorite(!newWishlistState);
      
      if (error.message.includes("Unauthorized")) {
        if (confirm("You need to log in to use wishlist. Go to login?")) {
          router.push("/sign-in/login");
        }
      } else {
        alert(error.message);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`}
      />
    ));
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.name.trim() || !newComment.comment.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setSubmittingComment(true);
    
    try {
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      
      const comment = {
        id: comments.length + 1,
        name: newComment.name,
        rating: newComment.rating,
        date: dateStr,
        comment: newComment.comment,
        verified: false,
      };

      setComments([comment, ...comments]);
      setNewComment({ name: '', rating: 5, comment: '' });
      alert("Thank you for your review!");
    } catch (error) {
      alert("Failed to submit review");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6]">
        <Navbar />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6]">
        <Navbar />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error || "Product not found"}</p>
            <button 
              onClick={() => router.push('/shoppage')}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a onClick={() => router.push('/')} className="hover:text-gray-900 transition-colors cursor-pointer">Home</a>
            <span>/</span>
            <a onClick={() => router.push('/shoppage')} className="hover:text-gray-900 transition-colors cursor-pointer">Shop</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 group">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-500">No image</p>
                )}
              </div>
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {renderStars(4)}
                </div>
                <span className="text-sm text-gray-600">(124 reviews)</span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-orange-500">₹{product.price}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
              <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                {product.category}
              </span>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button onClick={decrementQuantity} className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button onClick={incrementQuantity} className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartLoading ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <Truck className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders above ₹500</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% secure transaction</p>
                </div>
              </div>
              <div className="flex gap-3">
                <RotateCcw className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Award className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Quality Assured</p>
                  <p className="text-xs text-gray-600">Premium handcrafted items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

          {/* Add Review Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Share Your Review</h3>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={newComment.rating}
                    onChange={(e) => setNewComment({ ...newComment, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={newComment.comment}
                  onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Share your experience with this product..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingComment}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {submittingComment ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{comments.length}</span> reviews
              </p>
            </div>

            {comments.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.date}</span>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
