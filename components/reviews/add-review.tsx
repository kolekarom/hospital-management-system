import { useState } from 'react';
import { uploadJSONToIPFS } from '@/utils/pinata';

interface ReviewData {
  doctorId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  appointmentId?: string;
  isVerifiedPatient: boolean;
}

interface AddReviewProps {
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  onSuccess?: (reviewHash: string) => void;
}

export default function AddReview({
  doctorId,
  doctorName,
  appointmentId,
  onSuccess
}: AddReviewProps) {
  const [review, setReview] = useState<ReviewData>({
    doctorId,
    patientName: '',
    rating: 0,
    comment: '',
    date: new Date().toISOString(),
    appointmentId,
    isVerifiedPatient: !!appointmentId
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (review.rating === 0) {
      setMessage('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await uploadJSONToIPFS(review);
      if (!result.success) {
        throw new Error('Failed to submit review');
      }

      setMessage('Review submitted successfully!');
      onSuccess?.(result.pinataUrl || '');

      // Reset form
      setReview({
        doctorId,
        patientName: '',
        rating: 0,
        comment: '',
        date: new Date().toISOString(),
        appointmentId,
        isVerifiedPatient: !!appointmentId
      });

    } catch (err) {
      const error = err as Error;
      setMessage('Error submitting review: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStar = (position: number) => {
    const filled = position <= (hoveredStar || review.rating);
    return (
      <svg
        className={`w-8 h-8 cursor-pointer ${
          filled ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onMouseEnter={() => setHoveredStar(position)}
        onMouseLeave={() => setHoveredStar(0)}
        onClick={() => setReview({ ...review, rating: position })}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Review Dr. {doctorName}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!appointmentId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              required
              value={review.patientName}
              onChange={(e) =>
                setReview({ ...review, patientName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((num) => renderStar(num))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            required
            value={review.comment}
            onChange={(e) =>
              setReview({ ...review, comment: e.target.value })
            }
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Share your experience with the doctor"
          />
        </div>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.includes('Error')
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
