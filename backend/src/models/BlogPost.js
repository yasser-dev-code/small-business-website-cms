import mongoose from 'mongoose';

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    author: { type: String, default: 'Maison Gourmet' },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

blogPostSchema.pre('validate', function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  if (this.status === 'published' && !this.publishedAt) this.publishedAt = new Date();
  if (!this.seo.title && this.title) this.seo.title = this.title;
  if (!this.seo.description) this.seo.description = this.excerpt || this.title;
  next();
});

blogPostSchema.statics.slugify = slugify;

export default mongoose.model('BlogPost', blogPostSchema);
