import { useState } from 'react';
import { uploadJSONToIPFS } from '@/utils/pinata';

interface AppointmentData {
  doctorId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  symptoms?: string;
  previousHistory?: string;
}

interface BookAppointmentProps {
  doctorId: string;
  doctorName: string;
  availableSlots: {
    date: string;
    slots: Array<{
      start: string;
      end: string;
    }>;
  }[];
  onSuccess?: (appointmentHash: string) => void;
}

export default function BookAppointment({
  doctorId,
  doctorName,
  availableSlots,
  onSuccess
}: BookAppointmentProps) {
  const [appointment, setAppointment] = useState<AppointmentData>({
    doctorId,
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    appointmentDate: '',
    timeSlot: '',
    reason: '',
    status: 'pending',
    symptoms: '',
    previousHistory: ''
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Upload appointment data to IPFS
      const appointmentData = {
        ...appointment,
        timestamp: new Date().toISOString()
      };

      const result = await uploadJSONToIPFS(appointmentData);
      if (!result.success) {
        throw new Error('Failed to save appointment');
      }

      setMessage('Appointment booked successfully! Please check your email for confirmation.');
      onSuccess?.(result.pinataUrl || '');

      // Reset form
      setAppointment({
        doctorId,
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        appointmentDate: '',
        timeSlot: '',
        reason: '',
        status: 'pending',
        symptoms: '',
        previousHistory: ''
      });
      setSelectedDate('');

    } catch (err) {
      const error = err as Error;
      setMessage('Error booking appointment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Book Appointment with Dr. {doctorName}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              required
              value={appointment.patientName}
              onChange={(e) =>
                setAppointment({ ...appointment, patientName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={appointment.patientEmail}
              onChange={(e) =>
                setAppointment({ ...appointment, patientEmail: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              required
              value={appointment.patientPhone}
              onChange={(e) =>
                setAppointment({ ...appointment, patientPhone: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Date
            </label>
            <select
              required
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setAppointment({
                  ...appointment,
                  appointmentDate: e.target.value,
                  timeSlot: ''
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Date</option>
              {availableSlots.map((slot) => (
                <option key={slot.date} value={slot.date}>
                  {new Date(slot.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Time
              </label>
              <select
                required
                value={appointment.timeSlot}
                onChange={(e) =>
                  setAppointment({ ...appointment, timeSlot: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Time</option>
                {availableSlots
                  .find((slot) => slot.date === selectedDate)
                  ?.slots.map((time, index) => (
                    <option
                      key={index}
                      value={`${time.start}-${time.end}`}
                    >{`${time.start} - ${time.end}`}</option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reason for Visit
          </label>
          <textarea
            required
            value={appointment.reason}
            onChange={(e) =>
              setAppointment({ ...appointment, reason: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Please describe your main concern"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Symptoms
          </label>
          <textarea
            value={appointment.symptoms}
            onChange={(e) =>
              setAppointment({ ...appointment, symptoms: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe any symptoms you are experiencing"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Previous Medical History
          </label>
          <textarea
            value={appointment.previousHistory}
            onChange={(e) =>
              setAppointment({ ...appointment, previousHistory: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Any relevant medical history, allergies, or ongoing medications"
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
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
