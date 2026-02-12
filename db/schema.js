import {
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const cardTypeEnum = pgEnum("card_type", ["income", "expense"]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  "food",
  "fixed",
  "other",
]);
export const planEnum = pgEnum("user_plan", ["free", "pro"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password"),
  googleId: text("google_id"),
  photo: text("photo"),
  plan: planEnum("plan").default("free").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: cardTypeEnum("type").default("expense").notNull(),
  category: expenseCategoryEnum("category"),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
