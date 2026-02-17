CREATE TABLE IF NOT EXISTS "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"title" text NOT NULL,
	"tagline" text,
	"bio" text NOT NULL,
	"location" text,
	"email" text,
	"phone" text,
	"avatar_url" text,
	"resume_url" text,
	"website" text,
	"social_links" jsonb,
	"seo_title" text,
	"seo_description" text,
	"seo_image" text,
	"meta_keywords" text,
	"theme_color" text DEFAULT '#3b82f6',
	"show_resume" boolean DEFAULT true,
	"show_contact" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_email_idx" ON "profile" ("email");