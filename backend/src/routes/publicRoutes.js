import { Router } from 'express';
import * as homepage from '../controllers/homepageController.js';
import * as service from '../controllers/serviceController.js';
import * as blog from '../controllers/blogController.js';
import * as menu from '../controllers/menuController.js';
import * as settings from '../controllers/settingsController.js';

const router = Router();
router.get('/homepage', homepage.getHomepage);
router.get('/services', service.listPublic);
router.get('/services/:id', service.getOne);
router.get('/blog', blog.listPublic);
router.get('/blog/:slug', blog.getBySlug);
router.get('/menu', menu.listPublic);
router.get('/settings', settings.getSettings);
export default router;
