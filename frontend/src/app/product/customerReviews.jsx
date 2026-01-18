"use client";

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this, or use standard textarea
import { createReview } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CustomerReviews({ productId, reviews = [] }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createReview({
        product_id: productId,
        rating: rating,
        comment: comment
      });

      // Clear form and refresh page to show new review
      setComment("");
      setRating(5);
      alert("Review submitted successfully!");
      router.refresh();
    } catch (err) {
      if (err.message.includes("already reviewed")) {
        setError("You have already reviewed this product.");
      } else if (err.message.includes("Unauthorized")) {
        setError("Please login to write a review.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count) => {
    return (
      <div className="flex items-center gap-0.5 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-lg">
            {i < count ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Customer Reviews</h2>
        <div className="flex items-center gap-3">
          <div className="flex text-yellow-500 text-2xl">
             {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(averageRating) ? "★" : "☆"}</span>
             ))}
          </div>
          <span className="text-2xl font-bold text-gray-800">{averageRating}</span>
          <span className="text-gray-600">out of 5 ({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="flex gap-8 flex-col md:flex-row">

        {/* LEFT: WRITE REVIEW FORM */}
        <div className="w-full md:w-1/3 shrink-0">
          <Card className="bg-gray-50 border shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Write a Review</h3>

              {error && (
                <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating Input */}
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex gap-1 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Input */}
                <div>
                  <label className="block text-sm font-medium mb-1">Review</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white hover:bg-gray-800"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: REVIEWS LIST */}
        <div className="flex-1 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review, index) => (
              <Card key={index} className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">
                        {review.user || "Anonymous"}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-700 leading-relaxed mt-2">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}