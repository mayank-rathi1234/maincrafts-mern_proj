/**
 * Optional helper: populates the database with a few sample
 * contacts and tasks so the Submissions/Dashboard pages aren't
 * empty on first run. Run with: npm run seed
 */
require('dotenv').config();
const connectDB = require('../config/db');
const Contact = require('../models/Contact');
const Task = require('../models/Task');

(async () => {
  await connectDB();

  await Contact.deleteMany({});
  await Task.deleteMany({});

  await Contact.create([
    { name: 'Priya Nair', email: 'priya@example.com', message: 'Loved the internship curriculum — when does the next cohort start?' },
    { name: 'Sam Okafor', email: 'sam@example.com', message: 'Interested in the App Development service for a small startup MVP.' },
  ]);

  await Task.create([
    { name: 'Wire contact form to the API', completed: true },
    { name: 'Wire submissions page to GET /api/contacts', completed: true },
    { name: 'Wire dashboard to /api/tasks CRUD', completed: false },
    { name: 'Deploy backend + frontend', completed: false },
  ]);

  console.log('✅ Seed data inserted');
  process.exit(0);
})();
