import Homepage from '../models/Homepage.js';

async function getOrCreate() {
  let doc = await Homepage.findOne().sort({ createdAt: 1 });
  if (!doc) {
    doc = await Homepage.create({
      headline: 'Welcome to Maison Gourmet',
      subtitle: 'A modern French dining experience',
      introTitle: 'Our Story',
      introText: 'Seasonal French cuisine crafted with passion.',
      ctaText: 'View Menu',
      ctaLink: '/menu'
    });
  }
  return doc;
}

export async function getHomepage(req, res, next) {
  try {
    res.json(await getOrCreate());
  } catch (err) {
    next(err);
  }
}

export async function updateHomepage(req, res, next) {
  try {
    const doc = await getOrCreate();
    const fields = ['headline', 'subtitle', 'heroImage', 'introTitle', 'introText', 'ctaText', 'ctaLink'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) doc[f] = req.body[f];
    });
    if (req.body.seo) doc.seo = { ...doc.seo, ...req.body.seo };
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
