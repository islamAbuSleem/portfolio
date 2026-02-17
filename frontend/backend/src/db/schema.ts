import { pgTable, text, integer, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const inquiryStatusEnum = pgEnum('inquiry_status', ['new', 'read', 'archived']);

export const stats = pgTable('stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  label: text('label').notNull(),
  value: integer('value').notNull(),
  suffix: text('suffix').notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  techStack: text('tech_stack').array().notNull(),
  viewLink: text('view_link'),
  githubLink: text('github_link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const experiences = pgTable('experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  role: text('role').notNull(),
  company: text('company').notNull(),
  period: text('period').notNull(),
  description: text('description').notNull(),
  technologies: text('technologies').array().notNull(),
  order: integer('order').notNull(),
});

export const skills = pgTable('skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  category: text('category').notNull(),
  skillsList: text('skills_list').array().notNull(),
});

export const inquiries = pgTable('inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: inquiryStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
