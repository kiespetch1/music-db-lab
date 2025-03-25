import {
    Album,
    ComposerArtist,
    ConcertHall,
    Genre,
    PrismaClient,
    ProductionCountry,
    Song,
} from '@prisma/client';

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_POSTGRES_URL,
});

const defaultCreatedAt = new Date("2025-03-01T00:00:00.000Z");

async function main() {

    if (await prisma.song.count() > 0) return;
    if (await prisma.composerArtist.count() > 0) return;
    if (await prisma.album.count() > 0) return;
    if (await prisma.productionCountry.count() > 0) return;
    if (await prisma.genre.count() > 0) return;
    if (await prisma.concertHall.count() > 0) return;

    const countriesData: Omit<ProductionCountry, 'id'>[] = [
        { name: "Россия", country_code: "RU", createdAt: defaultCreatedAt },
        { name: "США", country_code: "US", createdAt: defaultCreatedAt },
        { name: "Канада", country_code: "CA", createdAt: defaultCreatedAt },
        { name: "Великобритания", country_code: "GB", createdAt: defaultCreatedAt },
    ];
    const countries: ProductionCountry[] = await Promise.all(
        countriesData.map((country) => prisma.productionCountry.create({ data: country }))
    );

    const albumsData: Omit<Album, 'id'>[] = [
        { name: "Лунный свет", release_date: new Date("1990-01-01"), createdAt: defaultCreatedAt },
        { name: "Звездный путь", release_date: new Date("1992-01-01"), createdAt: defaultCreatedAt },
        { name: "Ночная тишина", release_date: new Date("1995-01-01"), createdAt: defaultCreatedAt },
        { name: "Rock Legends", release_date: new Date("1985-09-01"), createdAt: defaultCreatedAt },
        { name: "Pop Sensation", release_date: new Date("2000-06-01"), createdAt: defaultCreatedAt },
        { name: "Electro Vibes", release_date: new Date("2008-04-01"), createdAt: defaultCreatedAt },
        { name: "Golden Hits", release_date: new Date("2010-11-01"), createdAt: defaultCreatedAt },
        { name: "Современная классика", release_date: new Date("2015-01-01"), createdAt: defaultCreatedAt },
    ];
    const albums: Album[] = await Promise.all(
        albumsData.map((album) => prisma.album.create({ data: album }))
    );

    const genresData: Omit<Genre, 'id'>[] = [
        { name: "Рок", description: "Классический рок", createdAt: defaultCreatedAt },
        { name: "Поп", description: "Поп-музыка", createdAt: defaultCreatedAt },
        { name: "Инди", description: "Независимая музыка", createdAt: defaultCreatedAt },
        { name: "Электроника", description: "Электронная музыка", createdAt: defaultCreatedAt },
    ];
    const genres: Genre[] = await Promise.all(
        genresData.map((genre) => prisma.genre.create({ data: genre }))
    );

    const hallsData: Omit<ConcertHall, 'id'>[] = [
        { name: "Крокус Сити Холл", location: "Москва", capacity: 5000, createdAt: defaultCreatedAt },
        { name: "Олимпийский", location: "Санкт-Петербург", capacity: 4000, createdAt: defaultCreatedAt },
        { name: "Concert Hall X", location: "Новосибирск", capacity: 3000, createdAt: defaultCreatedAt },
        { name: "The O2", location: "Лондон", capacity: 25000, createdAt: defaultCreatedAt },
        { name: "Hollywood Bowl", location: "Лос-Анджелес", capacity: 18000, createdAt: defaultCreatedAt },
        { name: "Moscow International House of Music", location: "Москва", capacity: 3500, createdAt: defaultCreatedAt },
        { name: "Royal Festival Hall", location: "Лондон", capacity: 5000, createdAt: defaultCreatedAt },
        { name: "Berlin Philharmonie", location: "Берлин", capacity: 2000, createdAt: defaultCreatedAt },
    ];
    const halls: ConcertHall[] = await Promise.all(
        hallsData.map((hall) => prisma.concertHall.create({ data: hall }))
    );

    const artistsData: Omit<ComposerArtist, 'id'>[] = [
        { name: "Алиса", birth_date: new Date("1975-05-10"), country_id: countries[0].id, createdAt: defaultCreatedAt },
        { name: "ДДТ", birth_date: new Date("1968-03-22"), country_id: countries[0].id, createdAt: defaultCreatedAt },
        { name: "Сплин", birth_date: new Date("1974-10-01"), country_id: countries[0].id, createdAt: defaultCreatedAt },
        { name: "Coldplay", birth_date: new Date("1977-01-01"), country_id: countries[3].id, createdAt: defaultCreatedAt },
        { name: "Imagine Dragons", birth_date: new Date("1984-08-05"), country_id: countries[1].id, createdAt: defaultCreatedAt },
        { name: "Maroon 5", birth_date: new Date("1977-01-01"), country_id: countries[1].id, createdAt: defaultCreatedAt },
    ];
    const artists: ComposerArtist[] = await Promise.all(
        artistsData.map((artist) => prisma.composerArtist.create({ data: artist }))
    );

    const songsData: Omit<Song, 'id'>[] = [
        {
            title: "Мы верим",
            releaseDate: new Date("1990-04-10"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[0].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Звезды на небе",
            releaseDate: new Date("1992-07-22"),
            albumId: albums[1].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[1].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Ночной дождь",
            releaseDate: new Date("1998-11-05"),
            albumId: albums[2].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[2].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Ветер перемен",
            releaseDate: new Date("2003-03-15"),
            albumId: albums[3].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[3].id,
            genreId: genres[1].id,
            concertHallId: halls[3].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Летний дождь",
            releaseDate: new Date("2005-06-20"),
            albumId: albums[4].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[1].id,
            genreId: genres[1].id,
            concertHallId: halls[4].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Electric Heart",
            releaseDate: new Date("2008-09-12"),
            albumId: albums[5].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[1].id,
            genreId: genres[3].id,
            concertHallId: halls[5].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Golden Days",
            releaseDate: new Date("2010-05-05"),
            albumId: albums[6].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[1].id,
            genreId: genres[1].id,
            concertHallId: halls[6].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Современная мечта",
            releaseDate: new Date("2012-12-12"),
            albumId: albums[7].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[7].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Пробуждение",
            releaseDate: new Date("2013-04-18"),
            albumId: albums[0].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[0].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Светлая дорога",
            releaseDate: new Date("2014-08-30"),
            albumId: albums[1].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[3].id,
            genreId: genres[2].id,
            concertHallId: halls[1].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Под звездами",
            releaseDate: new Date("2015-11-11"),
            albumId: albums[2].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[0].id,
            genreId: genres[1].id,
            concertHallId: halls[2].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Dream Away",
            releaseDate: new Date("2016-02-14"),
            albumId: albums[3].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[1].id,
            genreId: genres[3].id,
            concertHallId: halls[3].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Morning Light",
            releaseDate: new Date("2017-07-07"),
            albumId: albums[4].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[2].id,
            genreId: genres[1].id,
            concertHallId: halls[4].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Сердце города",
            releaseDate: new Date("2018-03-03"),
            albumId: albums[5].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[5].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Новый рассвет",
            releaseDate: new Date("2019-10-10"),
            albumId: albums[6].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[1].id,
            genreId: genres[2].id,
            concertHallId: halls[6].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Огонь и лёд",
            releaseDate: new Date("2020-01-01"),
            albumId: albums[7].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[3].id,
            genreId: genres[0].id,
            concertHallId: halls[7].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Skyline",
            releaseDate: new Date("2021-06-15"),
            albumId: albums[0].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[2].id,
            genreId: genres[1].id,
            concertHallId: halls[0].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Echoes",
            releaseDate: new Date("2022-09-09"),
            albumId: albums[1].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[1].id,
            genreId: genres[3].id,
            concertHallId: halls[1].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Тихий океан",
            releaseDate: new Date("2023-04-04"),
            albumId: albums[2].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[2].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Last Night",
            releaseDate: new Date("2023-11-11"),
            albumId: albums[3].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[3].id,
            genreId: genres[0].id,
            concertHallId: halls[3].id,
            createdAt: defaultCreatedAt,
        },
    ];

    for (const song of songsData) {
        await prisma.song.create({ data: song });
    }

    console.log("Сид для PostgreSQL завершён успешно!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
