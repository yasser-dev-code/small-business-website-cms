import fs from 'fs';
import path from 'path';
import Media from '../models/Media.js';
import { uploadRoot } from '../middleware/upload.js';

export async function uploadMedia(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided.' });
    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
}

export async function listMedia(req, res, next) {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found.' });
    const filePath = path.join(uploadRoot, media.filename);
    fs.promises.unlink(filePath).catch(() => {});
    res.json({ message: 'Media deleted.' });
  } catch (err) {
    next(err);
  }
}
