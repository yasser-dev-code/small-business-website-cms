import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { runValidation } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import * as homepage from '../controllers/homepageController.js';
import * as service from '../controllers/serviceController.js';
import * as blog from '../controllers/blogController.js';
import * as menu from '../controllers/menuController.js';
import * as settings from '../controllers/settingsController.js';
import * as media from '../controllers/mediaController.js';
import { stats } from '../controllers/dashboardController.js';

const router = Router();
router.use(requireAuth);

router.get('/stats', stats);

router.put('/homepage', homepage.updateHomepage);

router.get('/services', service.listAll);
router.post('/services', [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.')
], runValidation, service.create);
router.put('/services/:id', service.update);
router.delete('/services/:id', service.remove);

router.get('/blog', blog.listAll);
router.post('/blog', [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('content').trim().notEmpty().withMessage('Content is required.')
], runValidation, blog.create);
router.put('/blog/:id', blog.update);
router.delete('/blog/:id', blog.remove);

router.get('/menu', menu.listAll);
router.post('/menu', [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('price').isFloat({ min: 0 }).withMessage('A valid price is required.'),
  body('category').trim().notEmpty().withMessage('Category is required.')
], runValidation, menu.create);
router.put('/menu/:id', menu.update);
router.delete('/menu/:id', menu.remove);

router.put('/settings', settings.updateSettings);

router.get('/media', media.listMedia);
router.post('/media', upload.single('image'), media.uploadMedia);
router.delete('/media/:id', media.deleteMedia);

export default router;
