import env from '../config/env.js';
import Admin from '../models/Admin.js';
import Homepage from '../models/Homepage.js';
import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';
import MenuItem from '../models/MenuItem.js';
import RestaurantSettings from '../models/RestaurantSettings.js';

const img = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export async function seedData() {
  await Promise.all([
    Admin.deleteMany({}), Homepage.deleteMany({}), Service.deleteMany({}),
    BlogPost.deleteMany({}), MenuItem.deleteMany({}), RestaurantSettings.deleteMany({})
  ]);

  await Admin.create({
    name: env.demoAdminName,
    email: env.demoAdminEmail,
    password: env.demoAdminPassword
  });

  await Homepage.create({
    headline: 'Maison Gourmet',
    subtitle: 'Refined French cuisine in the heart of the city',
    heroImage: img('photo-1414235077428-338989a2e8c0', 1800),
    introTitle: 'A Table Set With Passion',
    introText:
      'For over two decades, Maison Gourmet has celebrated the art of French gastronomy. Our kitchen marries time-honoured technique with the freshest seasonal produce, delivering an experience that feels both timeless and unmistakably modern.',
    ctaText: 'Explore Our Menu',
    ctaLink: '/menu',
    seo: {
      title: 'Maison Gourmet | Fine French Restaurant',
      description: 'Discover refined French cuisine, seasonal menus and warm hospitality at Maison Gourmet.'
    }
  });

  await RestaurantSettings.create({
    name: 'Maison Gourmet',
    tagline: 'Fine French Dining',
    address: '24 Rue de la Gastronomie, Paris 75008',
    phone: '+33 1 42 68 53 00',
    email: 'reservations@maisongourmet.com',
    openingHours: [
      { day: 'Monday', hours: 'Closed' },
      { day: 'Tuesday', hours: '12:00 - 14:30, 19:00 - 23:00' },
      { day: 'Wednesday', hours: '12:00 - 14:30, 19:00 - 23:00' },
      { day: 'Thursday', hours: '12:00 - 14:30, 19:00 - 23:00' },
      { day: 'Friday', hours: '12:00 - 14:30, 19:00 - 00:00' },
      { day: 'Saturday', hours: '18:00 - 00:00' },
      { day: 'Sunday', hours: '12:00 - 16:00' }
    ],
    social: {
      facebook: 'https://facebook.com/maisongourmet',
      instagram: 'https://instagram.com/maisongourmet',
      twitter: 'https://twitter.com/maisongourmet'
    },
    aboutTitle: 'Our Story',
    aboutText:
      'Founded in 2001 by Chef Elise Marchand, Maison Gourmet began as a small bistro with a big dream: to bring authentic French flavours to a modern audience. Today our team continues that legacy, sourcing from local farmers and crafting every dish by hand.',
    aboutImage: img('photo-1552566626-52f8b828add9', 1200)
  });

  await Service.create([
    { title: 'Fine Dining', description: 'An elegant multi-course tasting experience guided by our head chef, featuring seasonal French classics.', image: img('photo-1517248135467-4c7edcad34c4'), icon: 'utensils', featured: true, published: true, order: 1 },
    { title: 'Private Events', description: 'Host memorable celebrations in our private salon, with bespoke menus and dedicated service.', image: img('photo-1519671482749-fd09be7ccebf'), icon: 'party-popper', featured: true, published: true, order: 2 },
    { title: 'Wine Pairing', description: 'Curated pairings from our cellar of over 400 French and European vintages, selected by our sommelier.', image: img('photo-1510812431401-41d2bd2722f3'), icon: 'wine', featured: true, published: true, order: 3 },
    { title: 'Catering', description: 'Restaurant-quality catering for corporate gatherings and private occasions, delivered with care.', image: img('photo-1555244162-803834f70033'), icon: 'truck', featured: false, published: true, order: 4 }
  ]);

  await MenuItem.create([
    { name: 'French Onion Soup', description: 'Caramelised onions, rich beef broth, gratineed Gruyere crouton.', price: 12, category: 'Starters', image: img('photo-1547592166-23ac45744acd'), featured: true, published: true, order: 1 },
    { name: 'Escargots de Bourgogne', description: 'Burgundy snails baked with garlic, parsley and butter.', price: 15, category: 'Starters', image: img('photo-1625944230945-1b7dd3b949ab'), published: true, order: 2 },
    { name: 'Duck Confit', description: 'Slow-cooked duck leg, crispy skin, sarladaise potatoes.', price: 32, category: 'Mains', image: img('photo-1544025162-d76694265947'), featured: true, published: true, order: 1 },
    { name: 'Coq au Vin', description: 'Chicken braised in red wine with pearl onions and mushrooms.', price: 29, category: 'Mains', image: img('photo-1598515214211-89d3c73ae83b'), published: true, order: 2 },
    { name: 'Bouillabaisse', description: 'Provencal seafood stew with saffron broth and rouille.', price: 34, category: 'Mains', image: img('photo-1559847844-5315695dadae'), published: true, order: 3 },
    { name: 'Creme Brulee', description: 'Madagascar vanilla custard with a caramelised sugar crust.', price: 10, category: 'Desserts', image: img('photo-1470124182917-cc6e71b22ecc'), featured: true, published: true, order: 1 },
    { name: 'Tarte Tatin', description: 'Caramelised upside-down apple tart with creme fraiche.', price: 11, category: 'Desserts', image: img('photo-1568571780765-9276ac8b75a2'), published: true, order: 2 },
    { name: 'Chateau Bordeaux Glass', description: 'A full-bodied red from our sommelier selection.', price: 14, category: 'Drinks', image: img('photo-1510812431401-41d2bd2722f3'), published: true, order: 1 }
  ]);

  const posts = [
    {
      title: 'The Art of the Perfect French Onion Soup',
      excerpt: 'How patience and caramelisation transform humble onions into a bistro classic.',
      content: 'Few dishes capture the soul of French cooking like a properly made onion soup.\n\nThe secret lies in slowly caramelising the onions for nearly an hour, allowing their natural sugars to deepen into a rich amber. A good beef broth and a generous gratineed Gruyere crouton finish the dish.\n\nAt Maison Gourmet we have refined this recipe for over twenty years, and it remains a favourite of our guests every winter.',
      featuredImage: img('photo-1547592166-23ac45744acd'),
      tags: ['recipes', 'classics'], status: 'published', author: 'Chef Elise Marchand'
    },
    {
      title: 'Pairing Wine with Duck Confit',
      excerpt: 'Our sommelier shares guidance on matching rich, savoury dishes with the right glass.',
      content: 'Duck confit is rich, savoury and deeply satisfying, and it deserves a wine that can stand up to it.\n\nWe recommend a structured red from the South West of France, such as a Cahors or a good Bordeaux. The tannins cut through the fat while the dark fruit complements the crispy skin.\n\nVisit us and let our sommelier guide your pairing.',
      featuredImage: img('photo-1510812431401-41d2bd2722f3'),
      tags: ['wine', 'pairing'], status: 'published', author: 'Julien Roche, Sommelier'
    },
    {
      title: 'A Behind-the-Scenes Look at Our Kitchen',
      excerpt: 'Meet the team and discover the daily rhythm that keeps Maison Gourmet running.',
      content: 'Every morning at 7am our kitchen comes alive. Produce arrives from local markets, stocks begin to simmer, and the days menu takes shape.\n\nOur brigade combines veteran chefs with talented newcomers, all united by a commitment to craft. It is this energy that our guests feel the moment they sit down.',
      featuredImage: img('photo-1556910103-1c02745aae4d'),
      tags: ['culture', 'team'], status: 'published', author: 'Maison Gourmet'
    },
    {
      title: 'Seasonal Spring Menu Preview',
      excerpt: 'A first look at the fresh dishes arriving on our spring carte.',
      content: 'Spring brings asparagus, morels, young peas and lamb to our kitchen.\n\nThis draft post outlines the direction of our upcoming seasonal menu. We will publish it once the dishes are finalised.',
      featuredImage: img('photo-1466637574441-749b8f19452f'),
      tags: ['seasonal'], status: 'draft', author: 'Chef Elise Marchand'
    }
  ];

  for (const p of posts) {
    const slug = BlogPost.slugify(p.title);
    await BlogPost.create({ ...p, slug, publishedAt: p.status === 'published' ? new Date() : undefined });
  }

  return {
    admins: await Admin.countDocuments(),
    services: await Service.countDocuments(),
    menuItems: await MenuItem.countDocuments(),
    blogPosts: await BlogPost.countDocuments()
  };
}
