import mongoose from 'mongoose';

const openingHourSchema = new mongoose.Schema(
  { day: { type: String, required: true }, hours: { type: String, required: true } },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: 'Maison Gourmet' },
    tagline: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    openingHours: { type: [openingHourSchema], default: [] },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },
    aboutTitle: { type: String, default: '' },
    aboutText: { type: String, default: '' },
    aboutImage: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('RestaurantSettings', settingsSchema);
