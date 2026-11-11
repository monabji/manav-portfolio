import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const configuration = sqliteTable('site_configuration', {
  id: integer('id').primaryKey(),
  value: text('value').notNull(),
  revision: integer('revision').notNull().default(1),
  updatedAt: integer('updated_at').notNull(),
});
