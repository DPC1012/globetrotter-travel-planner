CREATE TYPE "public"."activity_category" AS ENUM('sightseeing', 'food', 'adventure', 'culture', 'nightlife', 'transport', 'lodging', 'other');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"issuer" text,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"city_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category" "activity_category" DEFAULT 'other' NOT NULL,
	"duration_mins" integer DEFAULT 60 NOT NULL,
	"cost_cents" integer DEFAULT 0 NOT NULL,
	"image_url" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"region" text NOT NULL,
	"lat" real NOT NULL,
	"lng" real NOT NULL,
	"cost_index" integer DEFAULT 100 NOT NULL,
	"popularity" integer DEFAULT 50 NOT NULL,
	"image_url" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "stops" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"trip_id" text NOT NULL,
	"city_id" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"arrival_date" date NOT NULL,
	"departure_date" date NOT NULL,
	CONSTRAINT "stop_dates_check" CHECK ("stops"."arrival_date" <= "stops"."departure_date")
);
--> statement-breakpoint
CREATE TABLE "trip_activities" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"stop_id" text NOT NULL,
	"activity_id" text,
	"title" text NOT NULL,
	"category" "activity_category" DEFAULT 'other' NOT NULL,
	"duration_mins" integer DEFAULT 0 NOT NULL,
	"cost_cents" integer DEFAULT 0 NOT NULL,
	"date" date NOT NULL,
	"start_time" time,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"cover_image_url" text,
	"budget_cents" integer,
	"is_public" boolean DEFAULT false NOT NULL,
	"share_slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trip_dates_check" CHECK ("trips"."start_date" <= "trips"."end_date")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"phone" text,
	"city" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_saved_cities" (
	"user_id" text NOT NULL,
	"city_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_saved_cities_user_id_city_id_pk" PRIMARY KEY("user_id","city_id")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stops" ADD CONSTRAINT "stops_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stops" ADD CONSTRAINT "stops_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_stop_id_stops_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."stops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_saved_cities" ADD CONSTRAINT "user_saved_cities_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_saved_cities" ADD CONSTRAINT "user_saved_cities_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activities_city_category_idx" ON "activities" USING btree ("city_id","category");--> statement-breakpoint
CREATE INDEX "cities_country_region_idx" ON "cities" USING btree ("country","region");--> statement-breakpoint
CREATE INDEX "cities_name_idx" ON "cities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "stops_trip_idx" ON "stops" USING btree ("trip_id","position");--> statement-breakpoint
CREATE INDEX "stops_city_idx" ON "stops" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "trip_activities_stop_date_idx" ON "trip_activities" USING btree ("stop_id","date","position");--> statement-breakpoint
CREATE UNIQUE INDEX "trips_share_slug_uq" ON "trips" USING btree ("share_slug") WHERE "trips"."share_slug" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "trips_user_idx" ON "trips" USING btree ("user_id","start_date");