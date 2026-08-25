import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_form_variant" AS ENUM('contact', 'application', 'lead', 'newsletter', 'breakfast');
  CREATE TYPE "public"."enum__pages_v_blocks_form_variant" AS ENUM('contact', 'application', 'lead', 'newsletter', 'breakfast');
  CREATE TYPE "public"."enum_alumni_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_faculty_status" AS ENUM('published', 'draft');
  CREATE TABLE "pages_blocks_compare_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"criterion" varchar,
  	"value_a" varchar,
  	"value_b" varchar
  );
  
  CREATE TABLE "pages_blocks_compare_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"column_a" varchar,
  	"column_b" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"meta" varchar
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_price_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"amount" varchar,
  	"period" varchar,
  	"detail" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_price_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"open_by_default" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"variant" "enum_pages_blocks_form_variant" DEFAULT 'contact',
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"criterion" varchar,
  	"value_a" varchar,
  	"value_b" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"column_a" varchar,
  	"column_b" varchar,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"meta" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_price_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"amount" varchar,
  	"period" varchar,
  	"detail" varchar,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_price_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"open_by_default" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"variant" "enum__pages_v_blocks_form_variant" DEFAULT 'contact',
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "alumni" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"program_slug" varchar,
  	"current_employer" varchar NOT NULL,
  	"city" varchar,
  	"photo_id" integer,
  	"order" numeric DEFAULT 0,
  	"status" "enum_alumni_status" DEFAULT 'published' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "alumni_locales" (
  	"class_of" varchar NOT NULL,
  	"program" varchar NOT NULL,
  	"current_role" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faculty_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "faculty_programs_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "faculty" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"parallel_employer" varchar NOT NULL,
  	"city" varchar,
  	"photo_id" integer,
  	"order" numeric DEFAULT 0,
  	"status" "enum_faculty_status" DEFAULT 'published' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faculty_locales" (
  	"subject" varchar NOT NULL,
  	"parallel_role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "alumni_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faculty_id" integer;
  ALTER TABLE "pages_blocks_compare_table_rows" ADD CONSTRAINT "pages_blocks_compare_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_compare_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_table" ADD CONSTRAINT "pages_blocks_compare_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_items" ADD CONSTRAINT "pages_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_grid_items" ADD CONSTRAINT "pages_blocks_price_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_price_grid" ADD CONSTRAINT "pages_blocks_price_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_items" ADD CONSTRAINT "pages_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion" ADD CONSTRAINT "pages_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form" ADD CONSTRAINT "pages_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_table_rows" ADD CONSTRAINT "_pages_v_blocks_compare_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_compare_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_table" ADD CONSTRAINT "_pages_v_blocks_compare_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_items" ADD CONSTRAINT "_pages_v_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_grid_items" ADD CONSTRAINT "_pages_v_blocks_price_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_price_grid" ADD CONSTRAINT "_pages_v_blocks_price_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_items" ADD CONSTRAINT "_pages_v_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion" ADD CONSTRAINT "_pages_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form" ADD CONSTRAINT "_pages_v_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alumni" ADD CONSTRAINT "alumni_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alumni_locales" ADD CONSTRAINT "alumni_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alumni"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty_programs" ADD CONSTRAINT "faculty_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty_programs_locales" ADD CONSTRAINT "faculty_programs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faculty_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty" ADD CONSTRAINT "faculty_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faculty_locales" ADD CONSTRAINT "faculty_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_compare_table_rows_order_idx" ON "pages_blocks_compare_table_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_table_rows_parent_id_idx" ON "pages_blocks_compare_table_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_table_rows_locale_idx" ON "pages_blocks_compare_table_rows" USING btree ("_locale");
  CREATE INDEX "pages_blocks_compare_table_order_idx" ON "pages_blocks_compare_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_table_parent_id_idx" ON "pages_blocks_compare_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_table_path_idx" ON "pages_blocks_compare_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_compare_table_locale_idx" ON "pages_blocks_compare_table" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_items_order_idx" ON "pages_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_items_parent_id_idx" ON "pages_blocks_steps_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_items_locale_idx" ON "pages_blocks_steps_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_locale_idx" ON "pages_blocks_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_price_grid_items_order_idx" ON "pages_blocks_price_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_price_grid_items_parent_id_idx" ON "pages_blocks_price_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_price_grid_items_locale_idx" ON "pages_blocks_price_grid_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_price_grid_order_idx" ON "pages_blocks_price_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_price_grid_parent_id_idx" ON "pages_blocks_price_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_price_grid_path_idx" ON "pages_blocks_price_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_price_grid_locale_idx" ON "pages_blocks_price_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_items_order_idx" ON "pages_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_items_parent_id_idx" ON "pages_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_items_locale_idx" ON "pages_blocks_accordion_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_accordion_order_idx" ON "pages_blocks_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_parent_id_idx" ON "pages_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_path_idx" ON "pages_blocks_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_accordion_locale_idx" ON "pages_blocks_accordion" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_order_idx" ON "pages_blocks_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_parent_id_idx" ON "pages_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_path_idx" ON "pages_blocks_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_locale_idx" ON "pages_blocks_form" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_compare_table_rows_order_idx" ON "_pages_v_blocks_compare_table_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_table_rows_parent_id_idx" ON "_pages_v_blocks_compare_table_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_table_rows_locale_idx" ON "_pages_v_blocks_compare_table_rows" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_compare_table_order_idx" ON "_pages_v_blocks_compare_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_table_parent_id_idx" ON "_pages_v_blocks_compare_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_table_path_idx" ON "_pages_v_blocks_compare_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_compare_table_locale_idx" ON "_pages_v_blocks_compare_table" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_steps_items_order_idx" ON "_pages_v_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_items_parent_id_idx" ON "_pages_v_blocks_steps_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_items_locale_idx" ON "_pages_v_blocks_steps_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_locale_idx" ON "_pages_v_blocks_steps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_price_grid_items_order_idx" ON "_pages_v_blocks_price_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_price_grid_items_parent_id_idx" ON "_pages_v_blocks_price_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_price_grid_items_locale_idx" ON "_pages_v_blocks_price_grid_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_price_grid_order_idx" ON "_pages_v_blocks_price_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_price_grid_parent_id_idx" ON "_pages_v_blocks_price_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_price_grid_path_idx" ON "_pages_v_blocks_price_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_price_grid_locale_idx" ON "_pages_v_blocks_price_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_items_order_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_items_parent_id_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_items_locale_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_accordion_order_idx" ON "_pages_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_parent_id_idx" ON "_pages_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_path_idx" ON "_pages_v_blocks_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_accordion_locale_idx" ON "_pages_v_blocks_accordion" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_order_idx" ON "_pages_v_blocks_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_parent_id_idx" ON "_pages_v_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_path_idx" ON "_pages_v_blocks_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_locale_idx" ON "_pages_v_blocks_form" USING btree ("_locale");
  CREATE INDEX "alumni_photo_idx" ON "alumni" USING btree ("photo_id");
  CREATE INDEX "alumni_updated_at_idx" ON "alumni" USING btree ("updated_at");
  CREATE INDEX "alumni_created_at_idx" ON "alumni" USING btree ("created_at");
  CREATE UNIQUE INDEX "alumni_locales_locale_parent_id_unique" ON "alumni_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faculty_programs_order_idx" ON "faculty_programs" USING btree ("_order");
  CREATE INDEX "faculty_programs_parent_id_idx" ON "faculty_programs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "faculty_programs_locales_locale_parent_id_unique" ON "faculty_programs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faculty_photo_idx" ON "faculty" USING btree ("photo_id");
  CREATE INDEX "faculty_updated_at_idx" ON "faculty" USING btree ("updated_at");
  CREATE INDEX "faculty_created_at_idx" ON "faculty" USING btree ("created_at");
  CREATE UNIQUE INDEX "faculty_locales_locale_parent_id_unique" ON "faculty_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alumni_fk" FOREIGN KEY ("alumni_id") REFERENCES "public"."alumni"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faculty_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_alumni_id_idx" ON "payload_locked_documents_rels" USING btree ("alumni_id");
  CREATE INDEX "payload_locked_documents_rels_faculty_id_idx" ON "payload_locked_documents_rels" USING btree ("faculty_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_compare_table_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_compare_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_price_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_price_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_accordion_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_accordion" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_compare_table_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_compare_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_steps_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_price_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_price_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_accordion_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_accordion" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alumni" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alumni_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faculty_programs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faculty_programs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faculty" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faculty_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_compare_table_rows" CASCADE;
  DROP TABLE "pages_blocks_compare_table" CASCADE;
  DROP TABLE "pages_blocks_steps_items" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_price_grid_items" CASCADE;
  DROP TABLE "pages_blocks_price_grid" CASCADE;
  DROP TABLE "pages_blocks_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_accordion" CASCADE;
  DROP TABLE "pages_blocks_form" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_table_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_table" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_items" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_price_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_price_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_form" CASCADE;
  DROP TABLE "alumni" CASCADE;
  DROP TABLE "alumni_locales" CASCADE;
  DROP TABLE "faculty_programs" CASCADE;
  DROP TABLE "faculty_programs_locales" CASCADE;
  DROP TABLE "faculty" CASCADE;
  DROP TABLE "faculty_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_alumni_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faculty_fk";
  
  DROP INDEX "payload_locked_documents_rels_alumni_id_idx";
  DROP INDEX "payload_locked_documents_rels_faculty_id_idx";
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN "api_key";
  ALTER TABLE "users" DROP COLUMN "api_key_index";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "alumni_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faculty_id";
  DROP TYPE "public"."enum_pages_blocks_form_variant";
  DROP TYPE "public"."enum__pages_v_blocks_form_variant";
  DROP TYPE "public"."enum_alumni_status";
  DROP TYPE "public"."enum_faculty_status";`)
}
