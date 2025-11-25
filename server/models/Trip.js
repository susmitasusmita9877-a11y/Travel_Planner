// server/models/Trip.js - Add new fields
const tripSchema = new mongoose.Schema({
  // ... existing fields
  itinerary: [{
    day: Number,
    activities: [{
      time: String,
      title: String,
      location: String,
      description: String,
      duration: String
    }]
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  collaborators: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'editor' }
  }]
}, { timestamps: true });