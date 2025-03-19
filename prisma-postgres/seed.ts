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

async function main() {
    await prisma.song.deleteMany();
    await prisma.composerArtist.deleteMany();
    await prisma.album.deleteMany();
    await prisma.productionCountry.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.concertHall.deleteMany();

    const countriesData: Omit<ProductionCountry, 'id'>[] = [
        { name: "Россия", country_code: "RU" },
        { name: "США", country_code: "US" },
        { name: "Канада", country_code: "CA" },
        { name: "Великобритания", country_code: "GB" },
    ];
    const countries: ProductionCountry[] = await Promise.all(
        countriesData.map((country) => prisma.productionCountry.create({ data: country }))
    );

    const albumsData: Omit<Album, 'id'>[] = [
        { name: "Лунный свет", release_date: new Date("1990-01-01") },
        { name: "Звездный путь", release_date: new Date("1992-01-01") },
        { name: "Ночная тишина", release_date: new Date("1995-01-01") },
        { name: "Rock Legends", release_date: new Date("1985-09-01") },
        { name: "Pop Sensation", release_date: new Date("2000-06-01") },
        { name: "Electro Vibes", release_date: new Date("2008-04-01") },
        { name: "Golden Hits", release_date: new Date("2010-11-01") },
        { name: "Современная классика", release_date: new Date("2015-01-01") },
    ];
    const albums: Album[] = await Promise.all(
        albumsData.map((album) => prisma.album.create({ data: album }))
    );

    const genresData: Omit<Genre, 'id'>[] = [
        { name: "Рок", description: "Классический рок" },
        { name: "Поп", description: "Поп-музыка" },
        { name: "Инди", description: "Независимая музыка" },
        { name: "Электроника", description: "Электронная музыка" },
    ];
    const genres: Genre[] = await Promise.all(
        genresData.map((genre) => prisma.genre.create({ data: genre }))
    );

    const hallsData: Omit<ConcertHall, 'id'>[] = [
        { name: "Крокус Сити Холл", location: "Москва", capacity: 5000 },
        { name: "Олимпийский", location: "Санкт-Петербург", capacity: 4000 },
        { name: "Concert Hall X", location: "Новосибирск", capacity: 3000 },
        { name: "The O2", location: "Лондон", capacity: 25000 },
        { name: "Hollywood Bowl", location: "Лос-Анджелес", capacity: 18000 },
        { name: "Moscow International House of Music", location: "Москва", capacity: 3500 },
        { name: "Royal Festival Hall", location: "Лондон", capacity: 5000 },
        { name: "Berlin Philharmonie", location: "Берлин", capacity: 2000 },
    ];
    const halls: ConcertHall[] = await Promise.all(
        hallsData.map((hall) => prisma.concertHall.create({ data: hall }))
    );

    const artistsData: Omit<ComposerArtist, 'id'>[] = [
        { name: "Алиса", birth_date: new Date("1975-05-10"), country_id: countries[0].id },
        { name: "ДДТ", birth_date: new Date("1968-03-22"), country_id: countries[0].id },
        { name: "Сплин", birth_date: new Date("1974-10-01"), country_id: countries[0].id },
        { name: "Coldplay", birth_date: new Date("1977-01-01"), country_id: countries[3].id },
        { name: "Imagine Dragons", birth_date: new Date("1984-08-05"), country_id: countries[1].id },
        { name: "Maroon 5", birth_date: new Date("1977-01-01"), country_id: countries[1].id },
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
        },
        {
            title: "Звезды на небе",
            releaseDate: new Date("1992-07-22"),
            albumId: albums[1].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[1].id,
        },
        {
            title: "Ночной дождь",
            releaseDate: new Date("1998-11-05"),
            albumId: albums[2].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[2].id,
        },
        {
            title: "Ветер перемен",
            releaseDate: new Date("2003-03-15"),
            albumId: albums[3].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[3].id,
            genreId: genres[1].id,
            concertHallId: halls[3].id,
        },
        {
            title: "Летний дождь",
            releaseDate: new Date("2005-06-20"),
            albumId: albums[4].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[1].id,
            genreId: genres[1].id,
            concertHallId: halls[4].id,
        },
        {
            title: "Electric Heart",
            releaseDate: new Date("2008-09-12"),
            albumId: albums[5].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[1].id,
            genreId: genres[3].id,
            concertHallId: halls[5].id,
        },
        {
            title: "Golden Days",
            releaseDate: new Date("2010-05-05"),
            albumId: albums[6].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[1].id,
            genreId: genres[1].id,
            concertHallId: halls[6].id,
        },
        {
            title: "Современная мечта",
            releaseDate: new Date("2012-12-12"),
            albumId: albums[7].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[7].id,
        },
        {
            title: "Пробуждение",
            releaseDate: new Date("2013-04-18"),
            albumId: albums[0].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[0].id,
        },
        {
            title: "Светлая дорога",
            releaseDate: new Date("2014-08-30"),
            albumId: albums[1].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[3].id,
            genreId: genres[2].id,
            concertHallId: halls[1].id,
        },
        {
            title: "Под звездами",
            releaseDate: new Date("2015-11-11"),
            albumId: albums[2].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[0].id,
            genreId: genres[1].id,
            concertHallId: halls[2].id,
        },
        {
            title: "Dream Away",
            releaseDate: new Date("2016-02-14"),
            albumId: albums[3].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[1].id,
            genreId: genres[3].id,
            concertHallId: halls[3].id,
        },
        {
            title: "Morning Light",
            releaseDate: new Date("2017-07-07"),
            albumId: albums[4].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[2].id,
            genreId: genres[1].id,
            concertHallId: halls[4].id,
        },
        {
            title: "Сердце города",
            releaseDate: new Date("2018-03-03"),
            albumId: albums[5].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[5].id,
        },
        {
            title: "Новый рассвет",
            releaseDate: new Date("2019-10-10"),
            albumId: albums[6].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[1].id,
            genreId: genres[2].id,
            concertHallId: halls[6].id,
        },
        {
            title: "Огонь и лёд",
            releaseDate: new Date("2020-01-01"),
            albumId: albums[7].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[3].id,
            genreId: genres[0].id,
            concertHallId: halls[7].id,
        },
        {
            title: "Skyline",
            releaseDate: new Date("2021-06-15"),
            albumId: albums[0].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[2].id,
            genreId: genres[1].id,
            concertHallId: halls[0].id,
        },
        {
            title: "Echoes",
            releaseDate: new Date("2022-09-09"),
            albumId: albums[1].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[1].id,
            genreId: genres[3].id,
            concertHallId: halls[1].id,
        },
        {
            title: "Тихий океан",
            releaseDate: new Date("2023-04-04"),
            albumId: albums[2].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[2].id,
        },
        {
            title: "Last Night",
            releaseDate: new Date("2023-11-11"),
            albumId: albums[3].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[3].id,
            genreId: genres[0].id,
            concertHallId: halls[3].id,
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
