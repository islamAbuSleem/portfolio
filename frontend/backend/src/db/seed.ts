import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log('Seeding database...');

  // Clear existing data (Optional, but good for idempotent seeds)
  // await db.delete(schema.stats);
  // await db.delete(schema.projects);
  // await db.delete(schema.experiences);
  // await db.delete(schema.skills);

  // Seed Stats
  await db.insert(schema.stats).values([
    { label: 'Years Experience', value: 10, suffix: '+' },
    { label: 'Projects Completed', value: 50, suffix: '+' },
    { label: 'Happy Clients', value: 30, suffix: '+' },
  ]);

  // Seed Projects
  await db.insert(schema.projects).values([
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with real-time inventory management and payment integration.',
      techStack: ['Vue.js', 'Node.js', 'PostgreSQL'],
      viewLink: '#',
      githubLink: '#',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time analytics platform with interactive visualizations and data-driven insights.',
      techStack: ['React', 'D3.js', 'AWS'],
      viewLink: '#',
      githubLink: '#',
    },
    {
      title: 'Configuration Management',
      description: 'Enterprise-grade configuration management system with version control and deployment automation.',
      techStack: ['Go', 'Kubernetes', 'Docker'],
      viewLink: '#',
      githubLink: '#',
    },
    {
      title: 'Real-time Chat Application',
      description: 'Scalable chat platform with WebSocket support, message encryption, and user presence.',
      techStack: ['Socket.io', 'Redis', 'MongoDB'],
      viewLink: '#',
      githubLink: '#',
    },
  ]);

  // Seed Experiences
  await db.insert(schema.experiences).values([
    {
      role: 'Senior Software Engineer',
      company: 'Tech Corp',
      period: '2022 - Present',
      description: 'Led development of microservices architecture serving 1M+ users. Mentored junior developers and implemented DevOps best practices.',
      technologies: ['TypeScript', 'Node.js', 'Kubernetes', 'AWS'],
      order: 1,
    },
    {
      role: 'Full Stack Engineer',
      company: 'StartupXYZ',
      period: '2019 - 2022',
      description: 'Built scalable web applications from scratch. Implemented real-time features and optimized database queries resulting in 60% performance improvement.',
      technologies: ['Vue.js', 'React', 'PostgreSQL', 'Redis'],
      order: 2,
    },
    {
      role: 'Junior Developer',
      company: 'Web Solutions Inc',
      period: '2017 - 2019',
      description: 'Developed frontend components and backend APIs. Improved code quality and test coverage through implementation of best practices.',
      technologies: ['JavaScript', 'HTML/CSS', 'REST APIs', 'Git'],
      order: 3,
    },
  ]);

  // Seed Skills
  await db.insert(schema.skills).values([
    {
      category: 'Frontend',
      skillsList: ['Vue.js / Nuxt', 'React / Next.js', 'TypeScript', 'Tailwind CSS', 'State Management'],
    },
    {
      category: 'Backend',
      skillsList: ['Node.js / Express', 'Python / Django', 'Go / Rust', 'RESTful APIs', 'GraphQL'],
    },
    {
      category: 'DevOps & Tools',
      skillsList: ['Docker / Kubernetes', 'AWS / GCP / Azure', 'CI/CD Pipelines', 'Git / GitHub', 'Monitoring & Logging'],
    },
  ]);

  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
