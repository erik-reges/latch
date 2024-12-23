CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"model" text NOT NULL,
	"max_speed" integer NOT NULL,
	"max_weight" numeric NOT NULL,
	"length" numeric NOT NULL,
	"manufacturer" text NOT NULL,
	"year_manufactured" integer NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"last_maintenance_date" text,
	"next_maintenance_date" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
