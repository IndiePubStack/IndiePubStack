CREATE TYPE "public"."postStatus" AS ENUM('draft', 'published', 'unpublished', 'scheduled');--> statement-breakpoint
CREATE TABLE "kinde_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "kinde_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"kindeId" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(255),
	"lastName" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kinde_users_kindeId_unique" UNIQUE("kindeId")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255),
	"subTitle" varchar(255),
	"slug" varchar(255),
	"content" text,
	"status" "postStatus" DEFAULT 'draft' NOT NULL,
	"broadcastId" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"scheduledAt" timestamp,
	"publishedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "resend_contacts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "resend_contacts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"resendId" varchar(255) NOT NULL,
	"audienceId" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(255),
	"lastName" varchar(255),
	"unsubscribed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resend_contacts_resendId_unique" UNIQUE("resendId")
);
