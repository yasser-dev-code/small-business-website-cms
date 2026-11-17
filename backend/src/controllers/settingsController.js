import RestaurantSettings from '../models/RestaurantSettings.js';

async function getOrCreate() {
  let doc = await RestaurantSettings.findOne().sort({ createdAt: 1 });
  if (!doc) doc = await RestaurantSettings.create({ name: 'Maison Gourmet' });
  return doc;
}

export async function getSettings(req, res, next) {
  try {
    res.json(await getOrCreate());
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const doc = await getOrCreate();
    const fields = ['name', 'tagline', 'address', 'phone', 'email', 'openingHours', 'social', 'aboutTitle', 'aboutText', 'aboutImage'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) doc[f] = req.body[f];
    });
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
