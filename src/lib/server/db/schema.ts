import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
	// id: text('id').primaryKey(),
	// age: integer('age')
	id: serial("id").primaryKey(),
	first_name: varchar("first_name"),
	last_name: varchar("last_name"),
	email: varchar("email"),  //.uniqueIndex(),
	password: varchar("password"),

//   first_name: text("first_name", { length: 255 }).notNull(),
//   last_name: text("last_name", { length: 255 }).notNull(),
//   email: text("email", { length: 255 }).notNull(),
//   password: text("password", { length: 255 }).notNull(),
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
