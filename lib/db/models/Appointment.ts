import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['Consultation', 'Follow-up', 'Check-up', 'Emergency', 'Video'],
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'],
    default: 'Scheduled'
  },
  notes: String,
  symptoms: [String],
  fee: {
    amount: Number,
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' }
  },
  reminders: [{
    type: { type: String, enum: ['SMS', 'Email'] },
    sentAt: Date,
    status: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
