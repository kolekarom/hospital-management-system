import { useState, useEffect } from 'react';
import BookAppointment from '../appointments/book-appointment';
import AddReview from '../reviews/add-review';

interface ProfileData {
  name: string;
  specialization?: string;
  qualification: string;
  experience: string;
  email: string;
  phone: string;
  bio: string;
  profileImageUrl?: string;
  licenseNumber?: string;
  address: string;
  department?: string;
  availability: Availability[];
}

interface Availability {
  day: string;
  slots: TimeSlot[];
}

interface TimeSlot {
  start: string;
  end: string;
  isBooked: boolean;
}

interface Review {
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedPatient: boolean;
}

interface PublicProfileProps {
  ipfsHash: string;
}

export default function PublicProfile({ ipfsHash }: PublicProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAppointment, setShowAppointment] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch profile data from IPFS
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);

        // TODO: Fetch reviews from a separate IPFS file or database
        // For now, using mock data
        setReviews([
          {
            patientName: 'John Doe',
            rating: 5,
            comment: 'Excellent doctor! Very thorough and caring.',
            date: '2025-03-20T10:00:00Z',
            isVerifiedPatient: true
          },
          // Add more mock reviews as needed
        ]);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [ipfsHash]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading profile: {error || 'Profile not found'}
      </div>
    );
  }

  const getAvailableSlots = () => {
    const today = new Date();
    const slots = [];
    
    // Get available slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const daySlots = profile.availability.find(a => a.day === dayOfWeek);
      if (daySlots) {
        const availableSlots = daySlots.slots.filter(s => !s.isBooked);
        if (availableSlots.length > 0) {
          slots.push({
            date: date.toISOString().split('T')[0],
            slots: availableSlots
          });
        }
      }
    }
    
    return slots;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-48 bg-indigo-600">
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/50">
            <div className="flex items-end space-x-4">
              <img
                src={profile.profileImageUrl || '/placeholder-avatar.png'}
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <div className="text-white pb-2">
                <h1 className="text-2xl font-bold">Dr. {profile.name}</h1>
                <p className="text-lg">{profile.specialization}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Professional Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-gray-500">Qualification</dt>
                  <dd>{profile.qualification}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Experience</dt>
                  <dd>{profile.experience} years</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Department</dt>
                  <dd>{profile.department}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">License Number</dt>
                  <dd>{profile.licenseNumber}</dd>
                </div>
              </dl>

              <h2 className="text-xl font-semibold mt-6 mb-4">Contact Information</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd>{profile.phone}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Address</dt>
                  <dd>{profile.address}</dd>
                </div>
              </dl>
            </div>

            {/* Right Column - Bio and Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 mb-6">{profile.bio}</p>

              <div className="space-y-4">
                <button
                  onClick={() => setShowAppointment(!showAppointment)}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="w-full py-2 px-4 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Write a Review
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Patient Reviews</h2>
              <div className="flex items-center">
                <div className="flex mr-2">{renderStars(Math.round(averageRating))}</div>
                <span className="text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.patientName}</span>
                      {review.isVerifiedPatient && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Patient
                        </span>
                      )}
                    </div>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      {showAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setShowAppointment(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <BookAppointment
              doctorId={ipfsHash}
              doctorName={profile.name}
              availableSlots={getAvailableSlots()}
              onSuccess={() => setShowAppointment(false)}
            />
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setShowReview(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AddReview
              doctorId={ipfsHash}
              doctorName={profile.name}
              onSuccess={() => {
                setShowReview(false);
                // TODO: Refresh reviews
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
