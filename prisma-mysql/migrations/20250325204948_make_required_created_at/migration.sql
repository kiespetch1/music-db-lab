/*
  Warnings:

  - Made the column `createdAt` on table `albums` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `composers_artists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `concert_hall` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `genre` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `production_countries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `songs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "albums" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "composers_artists" ALTER COLUMN "birth_date" SET DEFAULT '1970-01-01T00:00:00.000Z',
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "concert_hall" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "genre" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "production_countries" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "songs" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
