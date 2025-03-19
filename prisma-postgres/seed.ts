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
    datasourceUrl:  process.env.DATABASE_POSTGRES_URL,
});

async function main() {
    await prisma.song.deleteMany();
    await prisma.album.deleteMany();
    await prisma.composerArtist.deleteMany();
    await prisma.productionCountry.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.concertHall.deleteMany();

    const albumsData: Omit<Album, 'id'>[] = [
        { name: "Лунный свет" },
        { name: "Звездный путь" },
        { name: "Ночная тишина" },
        { name: "Rock Legends" },
        { name: "Pop Sensation" },
        { name: "Electro Vibes" },
        { name: "Golden Hits" },
        { name: "Современная классика" },
    ];
    const albums: Album[] = await Promise.all(
        albumsData.map((album) => prisma.album.create({ data: album }))
    );

    const artistsData: Omit<ComposerArtist, 'id'>[] = [
        { name: "Алиса" },
        { name: "ДДТ" },
        { name: "Сплин" },
        { name: "Coldplay" },
        { name: "Imagine Dragons" },
        { name: "Maroon 5" },
    ];
    const artists: ComposerArtist[] = await Promise.all(
        artistsData.map((artist) => prisma.composerArtist.create({ data: artist }))
    );

    const countriesData: Omit<ProductionCountry, 'id'>[] = [
        { name: "Россия" },
        { name: "США" },
        { name: "Канада" },
        { name: "Великобритания" },
    ];
    const countries: ProductionCountry[] = await Promise.all(
        countriesData.map((country) => prisma.productionCountry.create({ data: country }))
    );

    const genresData: Omit<Genre, 'id'>[] = [
        { name: "Рок" },
        { name: "Поп" },
        { name: "Инди" },
        { name: "Электроника" },
    ];
    const genres: Genre[] = await Promise.all(
        genresData.map((genre) => prisma.genre.create({ data: genre }))
    );

    const hallsData: Omit<ConcertHall, 'id'>[] = [
        { name: "Крокус Сити Холл", location: "Москва" },
        { name: "Олимпийский", location: "Санкт-Петербург" },
        { name: "Concert Hall X", location: "Новосибирск" },
        { name: "The O2", location: "Лондон" },
        { name: "Hollywood Bowl", location: "Лос-Анджелес" },
        { name: "Moscow International House of Music", location: "Москва" },
        { name: "Royal Festival Hall", location: "Лондон" },
        { name: "Berlin Philharmonie", location: "Берлин" },
    ];
    const halls: ConcertHall[] = await Promise.all(
        hallsData.map((hall) => prisma.concertHall.create({ data: hall }))
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
