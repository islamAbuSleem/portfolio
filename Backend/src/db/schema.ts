import { pgTable, uuid, serial, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users (Admin)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// Projects
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  techStack: jsonb('tech_stack').$type<string[]>().notNull(), // Store as JSON array
  repoUrl: text('repo_url'),
  liveUrl: text('live_url'),
  imageUrls: jsonb('image_urls').$type<string[]>(),
  year: integer('year'),
  category: text('category'), // e.g., "Web App", "Mobile", "Open Source"
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  yearIdx: index('projects_year_idx').on(table.year),
  categoryIdx: index('projects_category_idx').on(table.category),
  createdAtIdx: index('projects_created_at_idx').on(table.createdAt),
}));

// Experiences
export const experiences = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  company: text('company').notNull(),
  role: text('role').notNull(),
  period: text('period').notNull(), // e.g., "2023 - Present"
  description: text('description').notNull(),
  technologies: text('technologies').array().notNull(),
  order: integer('order').default(0), // For display ordering
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  orderIdx: index('experiences_order_idx').on(table.order),
}));

// Skills
export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category').notNull(), // e.g., "Frontend", "Backend", "Tools"
  level: text('level'), // e.g., "Expert", "Intermediate"
  icon: text('icon'), // icon name or url
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('skills_category_idx').on(table.category),
}));

// Messages (Contact Form)
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  isReadIdx: index('messages_is_read_idx').on(table.isRead),
  createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
  emailIdx: index('messages_email_idx').on(table.email),
}));

// Profile (Personal Information)
export const profile = pgTable('profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  title: text('title').notNull(), // e.g., "Senior Software Engineer"
  tagline: text('tagline'), // Short catchy phrase
  bio: text('bio').notNull(), // Markdown supported
  location: text('location'),
  email: text('email'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  resumeUrl: text('resume_url'), // PDF upload
  website: text('website'),
  socialLinks: jsonb('social_links').$type<{
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    dev?: string;
  }>(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  metaKeywords: text('meta_keywords'),
  themeColor: text('theme_color').default('#3b82f6'),
  showResume: boolean('show_resume').default(true),
  showContact: boolean('show_contact').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('profile_email_idx').on(table.email),
}));
