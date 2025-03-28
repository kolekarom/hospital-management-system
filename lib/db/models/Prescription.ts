import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: {
    primary: String,
    secondary: [String],
    notes: String
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
    quantity: Number
  }],
  tests: [{
    name: String,
    instructions: String,
    urgency: { type: String, enum: ['Routine', 'Urgent', 'Emergency'] }
  }],
  vitals: {
    bloodPressure: String,
    temperature: Number,
    pulse: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number
  },
  followUp: {
    required: { type: Boolean, default: false },
    date: Date,
    notes: String
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
