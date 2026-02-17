CREATE INDEX IF NOT EXISTS "experiences_order_idx" ON "experiences" ("order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_is_read_idx" ON "messages" ("is_read");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_created_at_idx" ON "messages" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_email_idx" ON "messages" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_year_idx" ON "projects" ("year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_category_idx" ON "projects" ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_created_at_idx" ON "projects" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "skills_category_idx" ON "skills" ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");