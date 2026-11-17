import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema(
  {
    headline: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    heroImage: { type: String, default: '' },
    introTitle: { type: String, default: '' },
    introText: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Homepage', homepageSchema);
