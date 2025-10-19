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

export const game = pgTable('games', {
	id: serial("id").primaryKey(),
	user_id: integer("user_id").notNull().references(() => user.id),
	top_player: varchar("top_player").notNull(),
	bottom_player: varchar("bottom_player").notNull(),
	winner: varchar("winner"),
	top_score: integer("top_score").notNull().default(0),
	bottom_score: integer("bottom_score").notNull().default(0),
	rows: integer("rows").notNull(),
	columns: integer("columns").notNull(),
	multiple: integer("multiple").notNull(),
	skill_level: integer("skill_level").notNull(),		
})
//   id SERIAL,
//   user_id INTEGER,
//   top_player VARCHAR(1),
//   bottom_player VARCHAR(1),
//   winner VARCHAR(1),
//   top_score INTEGER,
//   bottom_score INTEGER,
//   rows INTEGER,
//   columns INTEGER,
//   multiple INTEGER,
//   skill_level INTEGER,

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
