import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// Shared column factories (one fresh builder per table — same schema, no duplication).
const serialId = () => serial("id").primaryKey();

const createdAtColumn = () =>
  timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

const updatedAtColumn = () =>
  timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();

const dayColumn = () => text("day").notNull();

const userIdColumn = () =>
  integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" });

const azkarIdColumn = () =>
  integer("azkar_id")
    .notNull()
    .references(() => azkar.id, { onDelete: "cascade" });

// ---------- Auth ----------
export const users = pgTable("users", {
  id: serialId(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAtColumn(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: serialId(),
    userId: userIdColumn(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAtColumn(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

// ---------- Content ----------
export const azkarCategories = pgTable("azkar_categories", {
  id: serialId(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleArabic: text("title_arabic").notNull(),
  description: text("description").notNull(),
  descriptionArabic: text("description_arabic"),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const azkar = pgTable(
  "azkar",
  {
    id: serialId(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => azkarCategories.id, { onDelete: "cascade" }),
    arabic: text("arabic").notNull(),
    transliteration: text("transliteration").notNull(),
    translation: text("translation").notNull(),
    repeatCount: integer("repeat_count").notNull().default(1),
    reference: text("reference").notNull().default(""),
    virtue: text("virtue"),
    virtueArabic: text("virtue_arabic"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("azkar_category_idx").on(t.categoryId)],
);

// ---------- User activity ----------
export const azkarProgress = pgTable(
  "azkar_progress",
  {
    id: serialId(),
    userId: userIdColumn(),
    azkarId: azkarIdColumn(),
    categorySlug: text("category_slug").notNull(),
    day: dayColumn(), // YYYY-MM-DD in the user's timezone
    count: integer("count").notNull().default(0),
    completed: boolean("completed").notNull().default(false),
    updatedAt: updatedAtColumn(),
  },
  (t) => [
    uniqueIndex("azkar_progress_unique").on(t.userId, t.azkarId, t.day),
    index("azkar_progress_user_day_idx").on(t.userId, t.day),
  ],
);

export const dailyCompletions = pgTable(
  "daily_completions",
  {
    id: serialId(),
    userId: userIdColumn(),
    categorySlug: text("category_slug").notNull(),
    day: dayColumn(),
    completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("daily_completions_unique").on(t.userId, t.categorySlug, t.day),
    index("daily_completions_user_idx").on(t.userId, t.day),
  ],
);

export const favorites = pgTable(
  "favorites",
  {
    id: serialId(),
    userId: userIdColumn(),
    azkarId: azkarIdColumn(),
    createdAt: createdAtColumn(),
  },
  (t) => [uniqueIndex("favorites_unique").on(t.userId, t.azkarId)],
);

export const tasbihSessions = pgTable(
  "tasbih_sessions",
  {
    id: serialId(),
    userId: userIdColumn(),
    phrase: text("phrase").notNull(),
    phraseArabic: text("phrase_arabic").notNull(),
    count: integer("count").notNull(),
    target: integer("target").notNull(),
    day: dayColumn(),
    createdAt: createdAtColumn(),
  },
  (t) => [index("tasbih_sessions_user_idx").on(t.userId)],
);

export const userSettings = pgTable("user_settings", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  timezone: text("timezone").notNull().default("UTC"),
  city: text("city"),
  country: text("country"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  calculationMethod: integer("calculation_method").notNull().default(3),
  language: text("language").notNull().default("en"),
  showTransliteration: boolean("show_transliteration").notNull().default(true),
  showTranslation: boolean("show_translation").notNull().default(true),
  arabicFontSize: integer("arabic_font_size").notNull().default(2),
  updatedAt: updatedAtColumn(),
});

export type User = typeof users.$inferSelect;
export type Azkar = typeof azkar.$inferSelect;
export type AzkarCategory = typeof azkarCategories.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type TasbihSession = typeof tasbihSessions.$inferSelect;
