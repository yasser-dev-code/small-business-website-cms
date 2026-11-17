import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, default: '' },
    url: { type: String, required: true },
    mimetype: { type: String, default: '' },
    size: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
