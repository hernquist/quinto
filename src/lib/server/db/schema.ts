import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
	id: serial("id").primaryKey(),
	username: varchar("username"),
	email: varchar("email"),  //.uniqueIndex(),
	password: varchar("password"),
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
