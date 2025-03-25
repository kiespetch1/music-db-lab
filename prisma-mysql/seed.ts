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
    datasourceUrl: process.env.DATABASE_MYSQL_URL,
});

const defaultCreatedAt = new Date("2025-03-01T00:00:00.000Z");

async function main() {
    if (await prisma.song.count() > 0) return;
    if (await prisma.composerArtist.count() > 0) return;
    if (await prisma.album.count() > 0) return;
    if (await prisma.productionCountry.count() > 0) return;
    if (await prisma.genre.count() > 0) return;
    if (await prisma.concertHall.count() > 0) return;

    const countriesData: Omit<ProductionCountry, "id">[] = [
        { name: "Россия", country_code: "RU", createdAt: defaultCreatedAt },
        { name: "США", country_code: "US", createdAt: defaultCreatedAt },
        { name: "Великобритания", country_code: "GB", createdAt: defaultCreatedAt },
        { name: "Германия", country_code: "DE", createdAt: defaultCreatedAt },
    ];

    const countries: ProductionCountry[] = await Promise.all(
        countriesData.map((country) =>
            prisma.productionCountry.create({ data: country })
        )
    );

    const albumsData: Omit<Album, "id">[] = [
        { name: "Группа крови", release_date: new Date("1986-01-01"), createdAt: defaultCreatedAt },
        { name: "Медведица", release_date: new Date("1990-01-01"), createdAt: defaultCreatedAt },
        { name: "Районы-кварталы", release_date: new Date("2000-01-01"), createdAt: defaultCreatedAt },
        { name: "Abbey Road", release_date: new Date("1969-09-26"), createdAt: defaultCreatedAt },
        { name: "A Night at the Opera", release_date: new Date("1975-11-21"), createdAt: defaultCreatedAt },
        { name: "Hybrid Theory", release_date: new Date("2000-10-24"), createdAt: defaultCreatedAt },
        { name: "Back in Black", release_date: new Date("1980-07-25"), createdAt: defaultCreatedAt },
        { name: "Золотая коллекция", release_date: new Date("2005-01-01"), createdAt: defaultCreatedAt },
        { name: "Heavy Metal 2", release_date: new Date("1999-01-01"), createdAt: defaultCreatedAt },
    ];

    const albums: Album[] = await Promise.all(
        albumsData.map((album) => prisma.album.create({ data: album }))
    );

    const artistsData: Omit<ComposerArtist, "id">[] = [
        { name: "Кино", birth_date: new Date("1962-01-01"), country_id: countries[0].id, createdAt: defaultCreatedAt },
        { name: "Мумий Тролль", birth_date: new Date("1975-01-01"), country_id: countries[0].id, createdAt: defaultCreatedAt },
        { name: "Звери", birth_date: new Date("1980-01-01"), country_id: countries[0].id, createdAt: defaultCreatedAt },
        { name: "The Beatles", birth_date: new Date("1940-01-01"), country_id: countries[2].id, createdAt: defaultCreatedAt },
        { name: "Queen", birth_date: new Date("1945-01-01"), country_id: countries[2].id, createdAt: defaultCreatedAt },
        { name: "Linkin Park", birth_date: new Date("1971-01-01"), country_id: countries[1].id, createdAt: defaultCreatedAt },
    ];

    const artists: ComposerArtist[] = await Promise.all(
        artistsData.map((artist) => prisma.composerArtist.create({ data: artist }))
    );

    const genresData: Omit<Genre, "id">[] = [
        { name: "Рок", description: "Классический рок", createdAt: defaultCreatedAt },
        { name: "Поп", description: "Поп-музыка", createdAt: defaultCreatedAt },
        { name: "Альтернатива", description: "Альтернативная музыка", createdAt: defaultCreatedAt },
        { name: "Электронная", description: "Электронная музыка", createdAt: defaultCreatedAt },
    ];

    const genres: Genre[] = await Promise.all(
        genresData.map((genre) => prisma.genre.create({ data: genre }))
    );

    const hallsData: Omit<ConcertHall, "id">[] = [
        { name: "Большой зал Филармонии", location: "Москва", capacity: 1500, createdAt: defaultCreatedAt },
        { name: "Концертный зал им. Чайковского", location: "Санкт-Петербург", capacity: 1200, createdAt: defaultCreatedAt },
        { name: "Олимпия", location: "Москва", capacity: 2000, createdAt: defaultCreatedAt },
        { name: "Royal Albert Hall", location: "Лондон", capacity: 5000, createdAt: defaultCreatedAt },
        { name: "Madison Square Garden", location: "Нью-Йорк", capacity: 20000, createdAt: defaultCreatedAt },
        { name: "Sydney Opera House", location: "Сидней", capacity: 5500, createdAt: defaultCreatedAt },
        { name: "Staples Center", location: "Лос-Анджелес", capacity: 19000, createdAt: defaultCreatedAt },
        { name: "The O2 Arena", location: "Лондон", capacity: 25000, createdAt: defaultCreatedAt },
    ];

    const halls: ConcertHall[] = await Promise.all(
        hallsData.map((hall) => prisma.concertHall.create({ data: hall }))
    );

    const songsData: Omit<Song, "id">[] = [
        {
            title: "Перемен",
            releaseDate: new Date("1986-03-01"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[0].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Скованные одной цепью",
            releaseDate: new Date("1988-05-15"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[1].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Медведица",
            releaseDate: new Date("1995-07-20"),
            albumId: albums[1].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[2].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Районы-кварталы",
            releaseDate: new Date("2000-01-10"),
            albumId: albums[2].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[0].id,
            genreId: genres[1].id,
            concertHallId: halls[3].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Группа крови",
            releaseDate: new Date("1987-02-10"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[4].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Hey Jude",
            releaseDate: new Date("1968-08-26"),
            albumId: albums[3].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[5].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Bohemian Rhapsody",
            releaseDate: new Date("1975-10-31"),
            albumId: albums[4].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[6].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "In the End",
            releaseDate: new Date("2001-10-09"),
            albumId: albums[5].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[1].id,
            genreId: genres[0].id,
            concertHallId: halls[7].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Пачка сигарет",
            releaseDate: new Date("1989-04-01"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[0].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Половинка",
            releaseDate: new Date("1997-11-11"),
            albumId: albums[1].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[1].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Всё, что в жизни есть",
            releaseDate: new Date("2002-03-15"),
            albumId: albums[2].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[0].id,
            genreId: genres[1].id,
            concertHallId: halls[2].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Let It Be",
            releaseDate: new Date("1970-03-06"),
            albumId: albums[3].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[3].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "We Will Rock You",
            releaseDate: new Date("1977-09-07"),
            albumId: albums[4].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[4].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Numb",
            releaseDate: new Date("2003-03-25"),
            albumId: albums[5].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[1].id,
            genreId: genres[0].id,
            concertHallId: halls[5].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Звезда по имени Солнце",
            releaseDate: new Date("1989-06-15"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[6].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Соло для гитары",
            releaseDate: new Date("1998-08-20"),
            albumId: albums[1].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[7].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Прости, моя любовь",
            releaseDate: new Date("2004-12-01"),
            albumId: albums[2].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[0].id,
            genreId: genres[1].id,
            concertHallId: halls[0].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Yesterday",
            releaseDate: new Date("1965-09-13"),
            albumId: albums[3].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[1].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Don't Stop Me Now",
            releaseDate: new Date("1979-01-26"),
            albumId: albums[4].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[2].id,
            createdAt: defaultCreatedAt,
        },
        {
            title: "Crawling",
            releaseDate: new Date("2000-10-24"),
            albumId: albums[5].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[1].id,
            genreId: genres[0].id,
            concertHallId: halls[3].id,
            createdAt: defaultCreatedAt,
        },
    ];

    for (const song of songsData) {
        await prisma.song.create({ data: song });
    }

    console.log("Сид для MySQL завершён успешно!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
