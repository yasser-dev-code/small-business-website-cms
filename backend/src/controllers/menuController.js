import MenuItem from '../models/MenuItem.js';

export async function listPublic(req, res, next) {
  try {
    const items = await MenuItem.find({ published: true }).sort({ category: 1, order: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function listAll(req, res, next) {
  try {
    const items = await MenuItem.find().sort({ category: 1, order: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    res.json({ message: 'Menu item deleted.' });
  } catch (err) {
    next(err);
  }
}
