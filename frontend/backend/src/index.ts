import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { db } from './db/index.js';
import * as schema from './db/schema.js';
import { asc, eq } from 'drizzle-orm';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Auth Middleware for Admin Routes
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const secret = req.headers['x-admin-secret'];
  if (secret === process.env.ADMIN_API_SECRET) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// --- Public Routes ---

// Fetch all portfolio data
app.get('/api/portfolio-data', async (req, res) => {
  try {
    const [stats, projects, experiences, skills] = await Promise.all([
      db.select().from(schema.stats),
      db.select().from(schema.projects).orderBy(schema.projects.createdAt),
      db.select().from(schema.experiences).orderBy(asc(schema.experiences.order)),
      db.select().from(schema.skills),
    ]);

    res.json({ stats, projects, experiences, skills });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.insert(schema.inquiries).values({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- Admin Routes (Protected) ---

// Get all inquiries
app.get('/api/admin/inquiries', adminAuth, async (req, res) => {
  try {
    const allInquiries = await db.select().from(schema.inquiries).orderBy(schema.inquiries.createdAt);
    res.json(allInquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Update inquiry status
app.patch('/api/admin/inquiries/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.update(schema.inquiries)
      .set({ status })
      .where(eq(schema.inquiries.id, id));

    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// CRUD for Projects, Stats, etc. can be added here...

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
