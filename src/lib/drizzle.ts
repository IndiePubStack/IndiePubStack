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

export const subscribersTable = pgTable("subscribers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    kindeId: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    resendContactId: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
});

export const kindeUsersTable = pgTable("kinde_users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    kindeId: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    firstName: varchar({ length: 255 }),
    lastName: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});

export const resendContactsTable = pgTable("resend_contacts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    resendId: varchar({ length: 255 }).notNull().unique(),
    audienceId: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    firstName: varchar({ length: 255 }),
    lastName: varchar({ length: 255 }),
    unsubscribed: boolean().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});

export type Post = InferSelectModel<typeof postsTable>;
export type KindeUser = InferSelectModel<typeof kindeUsersTable>;
export type ResendContact = InferSelectModel<typeof resendContactsTable>;

export const db = drizzle(process.env.DATABASE_URL!);
