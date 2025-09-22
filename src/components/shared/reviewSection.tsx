import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, Calendar, Award, Users } from 'lucide-react';

const EnhancedReviewSection = () => {
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [courseProgress] = useState({ totalCompletedPercent: 95 });

    // Mock reviews data
    const [reviews] = useState([
        {
            user: { fullName: "Sarah Johnson", avatar: "SJ" },
            rating: 5,
            comment: "This course exceeded my expectations! The content is well-structured and the instructor explains complex concepts in a very understandable way. Highly recommended for anyone looking to advance their skills.",
            createdAt: "2024-01-15T10:30:00Z",
            helpful: 24
        },
        {
            user: { fullName: "Michael Chen", avatar: "MC" },
            rating: 4,
            comment: "Great course overall. The practical examples were very helpful. Only minor feedback would be to include more hands-on exercises in the middle sections.",
            createdAt: "2024-01-10T14:22:00Z",
            helpful: 18
        },
        {
            user: { fullName: "Emily Rodriguez", avatar: "ER" },
            rating: 5,
            comment: "Outstanding quality! The instructor's teaching style is engaging and the course materials are comprehensive. I've already started applying what I learned in my current projects.",
            createdAt: "2024-01-08T09:15:00Z",
            helpful: 31
        },
        {
            user: { fullName: "David Thompson", avatar: "DT" },
            rating: 4,
            comment: "Solid course with good content. The video quality is excellent and the pace is just right. Would love to see more advanced topics in a follow-up course.",
            createdAt: "2024-01-05T16:45:00Z",
            helpful: 12
        }
    ]);

    const handleAddReview = async () => {
        if (!userRating || !userComment.trim()) {
            alert('Please provide a rating and comment.');
            return;
        }
        setSubmittingReview(true);
        // Simulate API call
        setTimeout(() => {
            setSubmittingReview(false);
            setUserRating(0);
            setUserComment('');
        }, 2000);
    };

    const formatDate = (dateString : Date | string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length,
        percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
    }));

    return (
        <div className="bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Header with Rating Summary */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center">
                        <MessageCircle className="h-6 w-6 mr-3 text-blue-400" />
                        Student Reviews
                    </h3>
                    <div className="text-sm text-gray-300 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {reviews.length} reviews
                    </div>
                </div>

                {/* Rating Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Average Rating */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-2">
                            <span className="text-4xl font-bold text-white mr-3">
                                {averageRating.toFixed(1)}
                            </span>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-6 w-6 ${i < Math.floor(averageRating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-400'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Based on {reviews.length} student reviews
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {ratingDistribution.map(({ rating, count, percentage }) => (
                            <div key={rating} className="flex items-center space-x-3">
                                <span className="text-sm text-gray-300 w-8">
                                    {rating}★
                                </span>
                                <div className="flex-1 bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 w-8">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Review Form */}
            {courseProgress?.totalCompletedPercent >= 90 ? (
                <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-b border-white/10">
                    <div className="flex items-center mb-4">
                        <Award className="h-5 w-5 text-yellow-400 mr-2" />
                        <h4 className="text-lg font-semibold text-white">Share Your Experience</h4>
                    </div>

                    {/* Star Rating Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Rating
                        </label>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-all duration-200 transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setUserRating(star)}
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors duration-200 ${star <= (hoverRating || userRating)
                                                ? 'text-yellow-400 fill-current drop-shadow-lg'
                                                : 'text-gray-500 hover:text-yellow-300'
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-3 text-sm text-gray-400">
                                {userRating > 0 && (
                                    <>
                                        {userRating} star{userRating > 1 ? 's' : ''}
                                        {hoverRating > 0 && hoverRating !== userRating && ` (${hoverRating})`}
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Comment Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Review
                        </label>
                        <textarea
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            placeholder="Share your thoughts about this course. What did you like most? What could be improved?"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200 resize-none"
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                                Minimum 10 characters
                            </span>
                            <span className="text-xs text-gray-500">
                                {userComment.length}/500
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleAddReview}
                        disabled={submittingReview || !userRating || userComment.length < 10}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:shadow-none"
                    >
                        {submittingReview ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                Submitting Review...
                            </div>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </div>
            ) : (
                <div className="p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b border-orange-500/20">
                    <div className="flex items-center text-orange-300">
                        <Award className="h-5 w-5 mr-2" />
                        <p className="text-sm">
                            Complete at least 90% of the course to leave a review.
                            Current progress: {courseProgress?.totalCompletedPercent || 0}%
                        </p>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="max-h-96 overflow-y-auto">
                {reviews.length > 0 ? (
                    <div className="divide-y divide-white/10">
                        {reviews.map((review, index) => (
                            <div key={index} className="p-6 hover:bg-white/5 transition-colors duration-200">
                                <div className="flex items-start space-x-4">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                            {review.user.avatar}
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h5 className="font-semibold text-white text-lg">
                                                    {review.user.fullName}
                                                </h5>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < review.rating
                                                                        ? 'text-yellow-400 fill-current'
                                                                        : 'text-gray-500'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-400 flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {formatDate(review.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                            {review.comment}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between">
                                            <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                                                <ThumbsUp className="h-4 w-4" />
                                                <span>Helpful ({review.helpful})</span>
                                            </button>
                                            <div className="text-xs text-gray-500">
                                                {review.rating} out of 5 stars
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            {/* Load More Reviews */}
            {reviews.length > 3 && (
                <div className="p-4 border-t border-white/10 bg-gray-900/50">
                    <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                        Load More Reviews
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnhancedReviewSection;