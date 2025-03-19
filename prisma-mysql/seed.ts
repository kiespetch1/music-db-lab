import {Album, ComposerArtist, ConcertHall, Genre, PrismaClient, ProductionCountry, Song} from '@prisma/client';

const prisma = new PrismaClient({
    datasourceUrl:  process.env.MYSQL_DB_POSTGRES_URL,
});

async function main() {
    await prisma.song.deleteMany();
    await prisma.album.deleteMany();
    await prisma.composerArtist.deleteMany();
    await prisma.productionCountry.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.concertHall.deleteMany();

    const albumsData: Omit<Album, "id">[] = [
        {name: "Группа крови"},
        {name: "Медведица"},
        {name: "Районы-кварталы"},
        {name: "Abbey Road"},
        {name: "A Night at the Opera"},
        {name: "Hybrid Theory"},
        {name: "Back in Black"},
        {name: "Золотая коллекция"},
        {name: "Heave Metal 2"},
    ];

    const albums: Album[] = await Promise.all(
        albumsData.map((album) => prisma.album.create({data: album}))
    );

    const artistsData: Omit<ComposerArtist, "id">[] = [
        {name: "Кино"},
        {name: "Мумий Тролль"},
        {name: "Звери"},
        {name: "The Beatles"},
        {name: "Queen"},
        {name: "Linkin Park"},
    ];

    const artists: ComposerArtist[] = await Promise.all(
        artistsData.map((artist) => prisma.composerArtist.create({data: artist}))
    );

    const countriesData: Omit<ProductionCountry, "id">[] = [
        {name: "Россия"},
        {name: "США"},
        {name: "Великобритания"},
        {name: "Германия"},
    ];

    const countries: ProductionCountry[] = await Promise.all(
        countriesData.map((country) => prisma.productionCountry.create({data: country}))
    );

    const genresData: Omit<Genre, "id">[] = [
        {name: "Рок"},
        {name: "Поп"},
        {name: "Альтернатива"},
        {name: "Электронная"},
    ];

    const genres = await Promise.all(
        genresData.map((genre) => prisma.genre.create({data: genre}))
    );

    const hallsData: Omit<ConcertHall, "id">[] = [
        { name: "Большой зал Филармонии", location: "Москва" },
        { name: "Концертный зал им. Чайковского", location: "Санкт-Петербург" },
        { name: "Олимпия", location: "Москва" },
        { name: "Royal Albert Hall", location: "Лондон" },
        { name: "Madison Square Garden", location: "Нью-Йорк" },
        { name: "Sydney Opera House", location: "Сидней" },
        { name: "Staples Center", location: "Лос-Анджелес" },
        { name: "The O2 Arena", location: "Лондон" },
    ];

    const halls: ConcertHall[] = await Promise.all(
        hallsData.map((hall) => prisma.concertHall.create({data: hall}))
    );

    const songsData: Omit<Song, "id">[] = [
        {
            title: "Перемен",
            releaseDate: new Date("1986-03-01"),
            albumId: albums[0].id, // "Группа крови"
            composerArtistId: artists[0].id, // "Кино"
            productionCountryId: countries[0].id, // "Россия"
            genreId: genres[0].id, // "Рок"
            concertHallId: halls[0].id,
        },
        {
            title: "Скованные одной цепью",
            releaseDate: new Date("1988-05-15"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[1].id,
        },
        {
            title: "Медведица",
            releaseDate: new Date("1995-07-20"),
            albumId: albums[1].id, // "Медведица"
            composerArtistId: artists[1].id, // "Мумий Тролль"
            productionCountryId: countries[0].id,
            genreId: genres[2].id, // "Альтернатива"
            concertHallId: halls[2].id,
        },
        {
            title: "Районы-кварталы",
            releaseDate: new Date("2000-01-10"),
            albumId: albums[2].id, // "Районы-кварталы"
            composerArtistId: artists[2].id, // "Звери"
            productionCountryId: countries[0].id,
            genreId: genres[1].id, // "Поп"
            concertHallId: halls[3].id,
        },
        {
            title: "Группа крови",
            releaseDate: new Date("1987-02-10"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[4].id,
        },
        {
            title: "Hey Jude",
            releaseDate: new Date("1968-08-26"),
            albumId: albums[3].id, // "Abbey Road"
            composerArtistId: artists[3].id, // "The Beatles"
            productionCountryId: countries[2].id, // "Великобритания"
            genreId: genres[0].id,
            concertHallId: halls[5].id,
        },
        {
            title: "Bohemian Rhapsody",
            releaseDate: new Date("1975-10-31"),
            albumId: albums[4].id, // "A Night at the Opera"
            composerArtistId: artists[4].id, // "Queen"
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[6].id,
        },
        {
            title: "In the End",
            releaseDate: new Date("2001-10-09"),
            albumId: albums[5].id, // "Hybrid Theory"
            composerArtistId: artists[5].id, // "Linkin Park"
            productionCountryId: countries[1].id, // "США"
            genreId: genres[0].id,
            concertHallId: halls[7].id,
        },
        {
            title: "Пачка сигарет",
            releaseDate: new Date("1989-04-01"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[0].id,
        },
        {
            title: "Половинка",
            releaseDate: new Date("1997-11-11"),
            albumId: albums[1].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[1].id,
        },
        {
            title: "Всё, что в жизни есть",
            releaseDate: new Date("2002-03-15"),
            albumId: albums[2].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[0].id,
            genreId: genres[1].id,
            concertHallId: halls[2].id,
        },
        {
            title: "Let It Be",
            releaseDate: new Date("1970-03-06"),
            albumId: albums[3].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[3].id,
        },
        {
            title: "We Will Rock You",
            releaseDate: new Date("1977-09-07"),
            albumId: albums[4].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[4].id,
        },
        {
            title: "Numb",
            releaseDate: new Date("2003-03-25"),
            albumId: albums[5].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[1].id,
            genreId: genres[0].id,
            concertHallId: halls[5].id,
        },
        {
            title: "Звезда по имени Солнце",
            releaseDate: new Date("1989-06-15"),
            albumId: albums[0].id,
            composerArtistId: artists[0].id,
            productionCountryId: countries[0].id,
            genreId: genres[0].id,
            concertHallId: halls[6].id,
        },
        {
            title: "Соло для гитары",
            releaseDate: new Date("1998-08-20"),
            albumId: albums[1].id,
            composerArtistId: artists[1].id,
            productionCountryId: countries[0].id,
            genreId: genres[2].id,
            concertHallId: halls[7].id,
        },
        {
            title: "Прости, моя любовь",
            releaseDate: new Date("2004-12-01"),
            albumId: albums[2].id,
            composerArtistId: artists[2].id,
            productionCountryId: countries[0].id,
            genreId: genres[1].id,
            concertHallId: halls[0].id,
        },
        {
            title: "Yesterday",
            releaseDate: new Date("1965-09-13"),
            albumId: albums[3].id,
            composerArtistId: artists[3].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[1].id,
        },
        {
            title: "Don't Stop Me Now",
            releaseDate: new Date("1979-01-26"),
            albumId: albums[4].id,
            composerArtistId: artists[4].id,
            productionCountryId: countries[2].id,
            genreId: genres[0].id,
            concertHallId: halls[2].id,
        },
        {
            title: "Crawling",
            releaseDate: new Date("2000-10-24"),
            albumId: albums[5].id,
            composerArtistId: artists[5].id,
            productionCountryId: countries[1].id,
            genreId: genres[0].id,
            concertHallId: halls[3].id,
        },
    ];

    for (const song of songsData) {
        await prisma.song.create({data: song});
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
