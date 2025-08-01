import 'dotenv/config';
import {
    integer,
    pgTable,
    varchar,
    boolean,
    text,
    timestamp, pgEnum,
} from "drizzle-orm/pg-core";
import {InferSelectModel} from "drizzle-orm";

export const postStatusEnum = pgEnum("postStatus", ["draft", "published", "unpublished", "scheduled"]);

export const postsTable = pgTable("posts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }),
    subTitle: varchar({ length: 255 }),
    slug: varchar({ length: 255 }),
    content: text(),
    status: postStatusEnum().default("draft").notNull(),
    broadcastId: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
    scheduledAt: timestamp(),
    publishedAt: timestamp(),
});

export const kindeUsersTable = pgTable("kinde_users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    kindeId: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull(),
    firstName: varchar({ length: 255 }),
    lastName: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const resendContactsTable = pgTable("resend_contacts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    resendId: varchar({ length: 255 }).notNull().unique(),
    audienceId: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    firstName: varchar({ length: 255 }),
    lastName: varchar({ length: 255 }),
    unsubscribed: boolean().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export type Post = InferSelectModel<typeof postsTable>;
// export type KindeUser = InferSelectModel<typeof kindeUsersTable>;
// export type ResendContact = InferSelectModel<typeof resendContactsTable>;
