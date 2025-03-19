-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "release_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "composers_artists" ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL DEFAULT '1970-01-01T00:00:00.000Z',
ADD COLUMN     "country_id" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "concert_hall" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "genre" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "production_countries" ADD COLUMN     "country_code" TEXT NOT NULL DEFAULT 'N/A';

-- AddForeignKey
ALTER TABLE "composers_artists" ADD CONSTRAINT "composers_artists_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "production_countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
