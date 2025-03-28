import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  walletAddress: { type: String, unique: true },
  profileImage: String,
  emergencyContact: { type: String },
  residentialAddress: { type: String },
  experience: { type: Number },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  consultationFee: { 
    amount: Number,
    currency: { type: String, default: 'INR' }
  },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    slots: [{
      start: String,
      end: String
    }]
  }],
  ratings: [{
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    date: { type: Date, default: Date.now }
  }],
  statistics: {
    totalPatients: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    app: { type: Boolean, default: true }
  },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add any pre-save middleware here if needed
doctorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
