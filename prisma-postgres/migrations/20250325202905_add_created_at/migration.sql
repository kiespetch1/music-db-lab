-- Добавляем поле createdAt как опциональное во всех таблицах

-- Таблица albums
ALTER TABLE "albums"
    ADD COLUMN "createdAt" TIMESTAMP(3);
UPDATE "albums" SET "createdAt" = '2025-03-01T00:00:00.000Z' WHERE "createdAt" IS NULL;

-- Таблица songs
ALTER TABLE "songs"
    ADD COLUMN "createdAt" TIMESTAMP(3);
UPDATE "songs" SET "createdAt" = '2025-03-01T00:00:00.000Z' WHERE "createdAt" IS NULL;

-- Таблица composers_artists
ALTER TABLE "composers_artists"
    ADD COLUMN "createdAt" TIMESTAMP(3);
UPDATE "composers_artists" SET "createdAt" = '2025-03-01T00:00:00.000Z' WHERE "createdAt" IS NULL;

-- Таблица production_countries
ALTER TABLE "production_countries"
    ADD COLUMN "createdAt" TIMESTAMP(3);
UPDATE "production_countries" SET "createdAt" = '2025-03-01T00:00:00.000Z' WHERE "createdAt" IS NULL;

-- Таблица genre
ALTER TABLE "genre"
    ADD COLUMN "createdAt" TIMESTAMP(3);
UPDATE "genre" SET "createdAt" = '2025-03-01T00:00:00.000Z' WHERE "createdAt" IS NULL;

-- Таблица concert_hall
ALTER TABLE "concert_hall"
    ADD COLUMN "createdAt" TIMESTAMP(3);
UPDATE "concert_hall" SET "createdAt" = '2025-03-01T00:00:00.000Z' WHERE "createdAt" IS NULL;
