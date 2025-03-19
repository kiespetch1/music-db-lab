import { z } from "zod";

/*
  Схема для модели Album
  Модель в Prisma:
    model Album {
      id           Int      @id @default(autoincrement())
      name         String
      release_date DateTime @default(now())
      songs        Song[]
    }
  В схеме мы ожидаем ввод имени альбома и даты выпуска в формате yyyy-mm-dd.
*/
export const albumSchema = z.object({
    // id не передаётся при создании, поэтому его можно опустить или сделать опциональным
    name: z.string().min(1, { message: "Название альбома обязательно" }).max(50, { message: "Название альбома не может превышать 50 символов" }),
    release_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата выпуска должна быть в формате yyyy-mm-dd" })
        .refine((val) => {
            const year = parseInt(val.substring(0, 4), 10);
            return year >= 1700 && year <= 2025;
        }, { message: "Год выпуска должен быть от 1700 до 2025" }),
});

/*
  Схема для модели Song
  Модель в Prisma:
    model Song {
      id                  Int      @id @default(autoincrement())
      title               String
      releaseDate         DateTime
      albumId             Int
      composerArtistId    Int
      productionCountryId Int
      genreId             Int
      concertHallId       Int
      ...
    }
  Здесь ожидается название песни, дата релиза и числовые идентификаторы для всех внешних связей.
*/
export const songSchema = z.object({
    title: z.string().min(1, { message: "Название песни обязательно" }).max(50, { message: "Название песни не может превышать 50 символов" }),
    releaseDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата должна быть в формате yyyy-mm-dd" })
        .refine((val) => {
            const year = parseInt(val.substring(0, 4), 10);
            return year >= 1700 && year <= 2025;
        }, { message: "Год выпуска должен быть от 1700 до 2025" }),
    albumId: z.preprocess((val) => Number(val), z.number().min(1, { message: "Album ID должен быть от 1 до 100" }).max(100, { message: "Album ID должен быть от 1 до 100" })),
    composerArtistId: z.preprocess((val) => Number(val), z.number().min(1, { message: "ComposerArtist ID должен быть от 1 до 100" }).max(100, { message: "ComposerArtist ID должен быть от 1 до 100" })),
    productionCountryId: z.preprocess((val) => Number(val), z.number().min(1, { message: "ProductionCountry ID должен быть от 1 до 100" }).max(100, { message: "ProductionCountry ID должен быть от 1 до 100" })),
    genreId: z.preprocess((val) => Number(val), z.number().min(1, { message: "Genre ID должен быть от 1 до 100" }).max(100, { message: "Genre ID должен быть от 1 до 100" })),
    concertHallId: z.preprocess((val) => Number(val), z.number().min(1, { message: "ConcertHall ID должен быть от 1 до 100" }).max(100, { message: "ConcertHall ID должен быть от 1 до 100" })),
});

/*
  Схема для модели Genre
  Модель в Prisma:
    model Genre {
      id          Int    @id @default(autoincrement())
      name        String
      description String @default("")
      songs       Song[]
    }
*/
export const genreSchema = z.object({
    name: z.string().min(1, { message: "Название жанра обязательно" }).max(20, { message: "Название жанра не может превышать 20 символов" }),
    description: z.string().min(1, { message: "Описание жанра обязательно" }).max(200, { message: "Описание жанра не может превышать 200 символов" }),
});

/*
  Схема для модели ComposerArtist
  Модель в Prisma:
    model ComposerArtist {
      id         Int      @id @default(autoincrement())
      name       String
      birth_date DateTime @default(dbgenerated("'1970-01-01T00:00:00.000Z'"))
      country_id Int      @default(1)
      songs      Song[]
      country    ProductionCountry @relation(fields: [country_id], references: [id])
    }
*/
export const composerArtistSchema = z.object({
    name: z.string().min(1, { message: "Имя композитора/исполнителя обязательно" }).max(50, { message: "Имя не может превышать 50 символов" }),
    birth_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата рождения должна быть в формате yyyy-mm-dd" })
        .refine((val) => {
            const year = parseInt(val.substring(0, 4), 10);
            return year >= 1700 && year <= 2025;
        }, { message: "Год рождения должен быть от 1700 до 2025" }),
    country_id: z.preprocess((val) => Number(val), z.number().min(1, { message: "Country ID должен быть от 1 до 30" }).max(30, { message: "Country ID должен быть от 1 до 30" })),
});

/*
  Схема для модели ProductionCountry
  Модель в Prisma:
    model ProductionCountry {
      id             Int              @id @default(autoincrement())
      name           String
      country_code   String           @default("N/A")
      songs          Song[]
      ComposerArtist ComposerArtist[]
    }
*/
export const productionCountrySchema = z.object({
    name: z.string().min(1, { message: "Название страны обязательно" }).max(20, { message: "Название страны не может превышать 20 символов" }),
    country_code: z.string().min(1, { message: "Код страны обязателен" }).max(5, { message: "Код страны не может превышать 5 символов" }),
});

/*
  Схема для модели ConcertHall
  Модель в Prisma:
    model ConcertHall {
      id       Int    @id @default(autoincrement())
      name     String
      location String
      capacity Int    @default(100)
      songs    Song[]
    }
*/
export const concertHallSchema = z.object({
    name: z.string().min(1, { message: "Название зала обязательно" }).max(50, { message: "Название зала не может превышать 50 символов" }),
    location: z.string().min(1, { message: "Местоположение обязательно" }).max(50, { message: "Местоположение не может превышать 50 символов" }),
    capacity: z.preprocess((val) => Number(val), z.number().min(10, { message: "Вместимость должна быть не менее 10" }).max(100000, { message: "Вместимость не может превышать 100000" })),
});
