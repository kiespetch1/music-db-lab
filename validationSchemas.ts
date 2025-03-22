import { z } from "zod";

// Функция для проверки, что введённая дата не позже сегодняшней
const validateNotFutureDate = (val: string): boolean => {
    const inputDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate.getTime() <= today.getTime();
};

export const albumSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Название альбома обязательно" })
        .max(50, { message: "Название альбома не может превышать 50 символов" }),
    release_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Дата выпуска должна быть в формате yyyy-mm-dd",
        })
        .refine((val) => {
            const year = parseInt(val.substring(0, 4), 10);
            return year >= 1700 && year <= 2025;
        }, { message: "Год выпуска должен быть от 1700 до 2025" })
        .refine(validateNotFutureDate, {
            message: "Дата выпуска не может быть позже сегодняшней",
        }),
});

export const songSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Название песни обязательно" })
        .max(50, { message: "Название песни не может превышать 50 символов" }),
    releaseDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата должна быть в формате yyyy-mm-dd" })
        .refine((val) => {
            const year = parseInt(val.substring(0, 4), 10);
            return year >= 1700 && year <= 2025;
        }, { message: "Год выпуска должен быть от 1700 до 2025" })
        .refine(validateNotFutureDate, {
            message: "Дата релиза не может быть позже сегодняшней",
        }),
    albumId: z.preprocess(
        (val) => Number(val),
        z.number().min(1, { message: "Album ID должен быть от 1 до 100" }).max(100, { message: "Album ID должен быть от 1 до 100" })
    ),
    composerArtistId: z.preprocess(
        (val) => Number(val),
        z.number().min(1, { message: "ComposerArtist ID должен быть от 1 до 100" }).max(100, { message: "ComposerArtist ID должен быть от 1 до 100" })
    ),
    productionCountryId: z.preprocess(
        (val) => Number(val),
        z.number().min(1, { message: "ProductionCountry ID должен быть от 1 до 100" }).max(100, { message: "ProductionCountry ID должен быть от 1 до 100" })
    ),
    genreId: z.preprocess(
        (val) => Number(val),
        z.number().min(1, { message: "Genre ID должен быть от 1 до 100" }).max(100, { message: "Genre ID должен быть от 1 до 100" })
    ),
    concertHallId: z.preprocess(
        (val) => Number(val),
        z.number().min(1, { message: "ConcertHall ID должен быть от 1 до 100" }).max(100, { message: "ConcertHall ID должен быть от 1 до 100" })
    ),
});

export const composerArtistSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Имя композитора/исполнителя обязательно" })
        .max(50, { message: "Имя не может превышать 50 символов" }),
    birth_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Дата рождения должна быть в формате yyyy-mm-dd",
        })
        .refine((val) => {
            const year = parseInt(val.substring(0, 4), 10);
            return year >= 1700 && year <= 2025;
        }, { message: "Год рождения должен быть от 1700 до 2025" })
        .refine(validateNotFutureDate, {
            message: "Дата рождения не может быть позже сегодняшней",
        })
    ,
    country_id: z.preprocess(
        (val) => Number(val),
        z.number().min(1, { message: "Country ID должен быть от 1 до 30" }).max(30, { message: "Country ID должен быть от 1 до 30" })
    ),
});

export const genreSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Название жанра обязательно" })
        .max(20, { message: "Название жанра не может превышать 20 символов" }),
    description: z
        .string()
        .min(1, { message: "Описание жанра обязательно" })
        .max(200, { message: "Описание жанра не может превышать 200 символов" }),
});

export const productionCountrySchema = z.object({
    name: z
        .string()
        .min(1, { message: "Название страны обязательно" })
        .max(20, { message: "Название страны не может превышать 20 символов" }),
    country_code: z
        .string()
        .min(1, { message: "Код страны обязателен" })
        .max(5, { message: "Код страны не может превышать 5 символов" }),
});

export const concertHallSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Название зала обязательно" })
        .max(50, { message: "Название зала не может превышать 50 символов" }),
    location: z
        .string()
        .min(1, { message: "Местоположение обязательно" })
        .max(50, { message: "Местоположение не может превышать 50 символов" }),
    capacity: z.preprocess(
        (val) => Number(val),
        z.number().min(10, { message: "Вместимость должна быть не менее 10" }).max(100000, { message: "Вместимость не может превышать 100000" })
    ),
});
