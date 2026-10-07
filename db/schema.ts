import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const configuration = sqliteTable('site_configuration', {
  id: integer('id').primaryKey(),
  value: text('value').notNull(),
  revision: integer('revision').notNull().default(1),
  updatedAt: integer('updated_at').notNull(),
});
export const sessions = sqliteTable('admin_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  expiresAt: integer('expires_at').notNull(),
  credentialVersion: text('credential_version').notNull(),
});
export const attempts = sqliteTable('admin_attempts', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  expiresAt: integer('expires_at').notNull(),
});
