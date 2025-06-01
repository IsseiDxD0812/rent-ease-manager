
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FeedbackForm from '../components/Feedback/FeedbackForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, User, Calendar } from 'lucide-react';

interface FeedbackData {
  id: string;
  customerName: string;
  equipmentId: string;
  equipmentName: string;
  rating: number;
  comment: string;
  date: string;
}

const FeedbackPage = () => {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState<FeedbackData[]>([]);

  useEffect(() => {
    // Load feedback from localStorage
    const storedFeedback = localStorage.getItem('feedback');
    if (storedFeedback) {
      setFeedbackList(JSON.parse(storedFeedback));
    }
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      </div>
    );
  };

  const averageRating = feedbackList.length > 0 
    ? (feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbackList.length).toFixed(1)
    : 0;

  if (user?.role === 'Customer') {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Share Your Feedback
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Help us improve our equipment rental service by sharing your experience.
            </p>
          </div>
          
          <FeedbackForm />
        </div>
      </div>
    );
  }

  // Admin/Staff view
  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Customer Feedback
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor customer satisfaction and improve service quality.
        </p>
      </div>

      {/* Summary Stats */}
      {feedbackList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {feedbackList.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">{averageRating}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {Math.round((feedbackList.filter(f => f.rating >= 4).length / feedbackList.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Positive Reviews</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback List */}
      <div className="space-y-6">
        {feedbackList.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Customer Reviews
            </h2>
            <div className="grid gap-6">
              {feedbackList.map((feedback) => (
                <Card key={feedback.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-white">
                            {feedback.customerName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {feedback.equipmentName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {renderStars(feedback.rating)}
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(feedback.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {feedback.comment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Feedback Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Customer feedback will appear here once they start submitting reviews.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
