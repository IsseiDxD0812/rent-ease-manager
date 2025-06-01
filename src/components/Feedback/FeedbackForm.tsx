
import React, { useState } from 'react';
import { Star, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

interface FeedbackData {
  id: string;
  customerName: string;
  equipmentId: string;
  equipmentName: string;
  rating: number;
  comment: string;
  date: string;
}

const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock equipment list (in real app, this would come from context or API)
  const availableEquipment = [
    { id: '1', name: 'Excavator CAT 320D' },
    { id: '2', name: 'Forklift Toyota 8FGU25' },
    { id: '3', name: 'Crane Liebherr LTM 1050' },
    { id: '4', name: 'Bulldozer CAT D6T' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipment || rating === 0 || !comment.trim()) {
      toast({
        title: "Incomplete Information",
        description: "Please select equipment, provide a rating, and add a comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const feedback: FeedbackData = {
        id: Date.now().toString(),
        customerName: user?.name || 'Anonymous',
        equipmentId: selectedEquipment,
        equipmentName: availableEquipment.find(eq => eq.id === selectedEquipment)?.name || '',
        rating,
        comment,
        date: new Date().toISOString(),
      };

      // Store in localStorage for demo (in real app, this would be sent to API)
      const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
      existingFeedback.push(feedback);
      localStorage.setItem('feedback', JSON.stringify(existingFeedback));

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      });

      // Reset form
      setRating(0);
      setComment('');
      setSelectedEquipment('');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          className="transition-all duration-200 hover:scale-110"
        >
          <Star
            className={`h-8 w-8 ${
              star <= (hoveredRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            } transition-colors duration-200`}
          />
        </button>
      ))}
      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
        {rating > 0 ? `${rating} out of 5 stars` : 'No rating selected'}
      </span>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-white/20 dark:border-gray-700/20">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">Share Your Experience</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Which equipment would you like to review?
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white transition-all duration-300"
            >
              <option value="">Select equipment...</option>
              {availableEquipment.map((equipment) => (
                <option key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              How would you rate your experience?
            </label>
            <StarRating />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Tell us about your experience
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 resize-none"
              placeholder="Share your thoughts about the equipment quality, service, or overall experience..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !selectedEquipment || rating === 0 || !comment.trim()}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                <span>Submit Feedback</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
