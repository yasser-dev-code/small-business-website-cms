import BlogPost from '../models/BlogPost.js';
import Service from '../models/Service.js';
import MenuItem from '../models/MenuItem.js';
import Media from '../models/Media.js';

export async function stats(req, res, next) {
  try {
    const [publishedArticles, draftArticles, services, menuItems, mediaCount, recentPosts] = await Promise.all([
      BlogPost.countDocuments({ status: 'published' }),
      BlogPost.countDocuments({ status: 'draft' }),
      Service.countDocuments(),
      MenuItem.countDocuments(),
      Media.countDocuments(),
      BlogPost.find().sort({ updatedAt: -1 }).limit(5).select('title status updatedAt slug')
    ]);
    res.json({
      publishedArticles,
      draftArticles,
      services,
      menuItems,
      mediaCount,
      recentPosts
    });
  } catch (err) {
    next(err);
  }
}
