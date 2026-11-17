import BlogPost from '../models/BlogPost.js';

export async function listPublic(req, res, next) {
  try {
    const posts = await BlogPost.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

export async function getBySlug(req, res, next) {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) return res.status(404).json({ message: 'Article not found.' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function listAll(req, res, next) {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const base = BlogPost.slugify(req.body.title || 'untitled');
    let slug = base;
    let n = 1;
    while (await BlogPost.exists({ slug })) {
      n += 1;
      slug = `${base}-${n}`;
    }
    const post = await BlogPost.create({ ...req.body, slug });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const payload = { ...req.body };
    if (payload.title && !payload.slug) {
      const base = BlogPost.slugify(payload.title);
      let slug = base;
      let n = 1;
      while (await BlogPost.exists({ slug, _id: { $ne: req.params.id } })) {
        n += 1;
        slug = `${base}-${n}`;
      }
      payload.slug = slug;
    }
    const post = await BlogPost.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });
    if (!post) return res.status(404).json({ message: 'Article not found.' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Article not found.' });
    res.json({ message: 'Article deleted.' });
  } catch (err) {
    next(err);
  }
}
