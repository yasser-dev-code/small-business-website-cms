import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { createApp } from '../src/app.js';
import Admin from '../src/models/Admin.js';
import Service from '../src/models/Service.js';
import BlogPost from '../src/models/BlogPost.js';
import MenuItem from '../src/models/MenuItem.js';

let app;
let token;

beforeAll(async () => {
  await connectDB();
  app = createApp();
  await Promise.all([Admin.deleteMany({}), Service.deleteMany({}), BlogPost.deleteMany({}), MenuItem.deleteMany({})]);
  await Admin.create({ name: 'Test Admin', email: 'test@example.com', password: 'Password123!' });
  const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'Password123!' });
  token = res.body.token;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Health', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth', () => {
  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'Password123!' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.admin.email).toBe('test@example.com');
  });

  it('rejects invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('rejects malformed login body', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: '' });
    expect(res.status).toBe(400);
  });

  it('returns current admin with token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.body.admin.email).toBe('test@example.com');
  });

  it('blocks /me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Admin authorization', () => {
  it('blocks admin routes without a token', async () => {
    const res = await request(app).get('/api/admin/services');
    expect(res.status).toBe(401);
  });
});

describe('Service CRUD', () => {
  let id;
  it('creates a service', async () => {
    const res = await request(app).post('/api/admin/services').set('Authorization', 'Bearer ' + token)
      .send({ title: 'Fine Dining', description: 'Tasting menu', published: true });
    expect(res.status).toBe(201);
    id = res.body._id;
  });
  it('validates required fields', async () => {
    const res = await request(app).post('/api/admin/services').set('Authorization', 'Bearer ' + token).send({ title: '' });
    expect(res.status).toBe(400);
  });
  it('lists services publicly', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
  it('hides unpublished services publicly', async () => {
    await request(app).put('/api/admin/services/' + id).set('Authorization', 'Bearer ' + token).send({ published: false });
    const res = await request(app).get('/api/services');
    expect(res.body.find((s) => s._id === id)).toBeUndefined();
  });
  it('deletes a service', async () => {
    const res = await request(app).delete('/api/admin/services/' + id).set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
  });
});

describe('Blog CRUD and publishing', () => {
  let id;
  it('creates a draft article and generates a slug', async () => {
    const res = await request(app).post('/api/admin/blog').set('Authorization', 'Bearer ' + token)
      .send({ title: 'Hello World Article', content: 'Some content here', status: 'draft' });
    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('hello-world-article');
    id = res.body._id;
  });
  it('does not expose drafts publicly', async () => {
    const res = await request(app).get('/api/blog/hello-world-article');
    expect(res.status).toBe(404);
  });
  it('publishes the article', async () => {
    await request(app).put('/api/admin/blog/' + id).set('Authorization', 'Bearer ' + token).send({ status: 'published' });
    const res = await request(app).get('/api/blog/hello-world-article');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('published');
  });
  it('deletes the article', async () => {
    const res = await request(app).delete('/api/admin/blog/' + id).set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
  });
});

describe('Menu CRUD', () => {
  let id;
  it('creates a menu item', async () => {
    const res = await request(app).post('/api/admin/menu').set('Authorization', 'Bearer ' + token)
      .send({ name: 'Duck Confit', description: 'Crispy duck', price: 32, category: 'Mains' });
    expect(res.status).toBe(201);
    id = res.body._id;
  });
  it('validates price', async () => {
    const res = await request(app).post('/api/admin/menu').set('Authorization', 'Bearer ' + token)
      .send({ name: 'Bad', description: 'x', price: 'abc', category: 'Mains' });
    expect(res.status).toBe(400);
  });
  it('updates a menu item', async () => {
    const res = await request(app).put('/api/admin/menu/' + id).set('Authorization', 'Bearer ' + token).send({ price: 35 });
    expect(res.body.price).toBe(35);
  });
  it('lists menu publicly', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Homepage and Settings', () => {
  it('updates and reads homepage', async () => {
    await request(app).put('/api/admin/homepage').set('Authorization', 'Bearer ' + token).send({ headline: 'New Headline' });
    const res = await request(app).get('/api/homepage');
    expect(res.body.headline).toBe('New Headline');
  });
  it('updates and reads settings', async () => {
    await request(app).put('/api/admin/settings').set('Authorization', 'Bearer ' + token).send({ phone: '+33 1 00 00 00 00' });
    const res = await request(app).get('/api/settings');
    expect(res.body.phone).toBe('+33 1 00 00 00 00');
  });
  it('returns dashboard stats', async () => {
    const res = await request(app).get('/api/admin/stats').set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('publishedArticles');
  });
});

describe('Error handling', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
  it('returns 400 for bad ObjectId', async () => {
    const res = await request(app).get('/api/services/not-an-id');
    expect(res.status).toBe(400);
  });
});
