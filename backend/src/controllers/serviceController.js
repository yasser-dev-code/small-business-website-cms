import Service from '../models/Service.js';

export async function listPublic(req, res, next) {
  try {
    const services = await Service.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function listAll(req, res, next) {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json({ message: 'Service deleted.' });
  } catch (err) {
    next(err);
  }
}
