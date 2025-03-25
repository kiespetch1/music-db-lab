-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "createdAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "composers_artists" ADD COLUMN     "createdAt" TIMESTAMP(3),
ALTER COLUMN "birth_date" SET DEFAULT '1970-01-01T00:00:00.000Z';

-- AlterTable
ALTER TABLE "concert_hall" ADD COLUMN     "createdAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "genre" ADD COLUMN     "createdAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "production_countries" ADD COLUMN     "createdAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "createdAt" TIMESTAMP(3);
