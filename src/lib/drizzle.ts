import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
    integer,
    pgTable,
    varchar,
    text,
    timestamp, pgEnum,
} from "drizzle-orm/pg-core";
import {InferSelectModel} from "drizzle-orm";


export const postStatusEnum = pgEnum("postStatus", ["draft", "published", "unpublished", "scheduled"]);

export const settingsTable = pgTable("settings", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // codeHighlightTheme: varchar({ length: 255 }).default("github").notNull(),
    publicationName: varchar({ length: 255 }).default("IndiePubStack_").notNull(),
    // subscribeCtaText: text().default("Subscribe to receive the latest updates").notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
});

export const postsTable = pgTable("posts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }),
    subTitle: varchar({ length: 255 }),
    slug: varchar({ length: 255 }).unique(),
    content: text(),
    status: postStatusEnum().default("draft").notNull(),
    broadcastId: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
    scheduledAt: timestamp(),
    publishedAt: timestamp(),
});

// TODO: add tables for kinde users, resend contacts
export const subscribersTable = pgTable("subscribers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    kindeId: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    resendContactId: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
});

export type Post = InferSelectModel<typeof postsTable>;

export const db = drizzle(process.env.DATABASE_URL!);