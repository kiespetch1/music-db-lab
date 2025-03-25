import { NextResponse } from "next/server";
import { getPrismaClient } from "~/lib/prisma";
import { Statistics } from "~/types/DTOs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const db = searchParams.get("db") === "mysql" ? "mysql" : "postgres";
    console.log("БД в апи: " + db);
    const prisma = getPrismaClient(db);

    // Основные подсчёты
    const [songsCount, albumsCount, composersCount, countriesCount, genresCount, concertHallsCount] =
        await Promise.all([
            prisma.song.count(),
            prisma.album.count(),
            prisma.composerArtist.count(),
            prisma.productionCountry.count(),
            prisma.genre.count(),
            prisma.concertHall.count(),
        ]);

    const avgSongsPerAlbum = albumsCount > 0 ? (songsCount / albumsCount).toFixed(2) : "0";

    const earliestSong = await prisma.song.findFirst({ orderBy: { releaseDate: "asc" } });
    const latestSong = await prisma.song.findFirst({ orderBy: { releaseDate: "desc" } });

    const songsPerGenre = await prisma.genre.findMany({
        select: {
            name: true,
            _count: { select: { songs: true } },
        },
    });

    // Новая логика: подсчёт записей, добавленных за последнюю неделю
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [recentSongsCount, recentAlbumsCount, recentComposersCount, recentCountriesCount, recentGenresCount, recentConcertHallsCount] =
        await Promise.all([
            prisma.song.count({ where: { createdAt: { gte: oneWeekAgo } } }),
            prisma.album.count({ where: { createdAt: { gte: oneWeekAgo } } }),
            prisma.composerArtist.count({ where: { createdAt: { gte: oneWeekAgo } } }),
            prisma.productionCountry.count({ where: { createdAt: { gte: oneWeekAgo } } }),
            prisma.genre.count({ where: { createdAt: { gte: oneWeekAgo } } }),
            prisma.concertHall.count({ where: { createdAt: { gte: oneWeekAgo } } }),
        ]);

    const statistics: Statistics = {
        currentDb: db,
        songsCount,
        albumsCount,
        composersCount,
        countriesCount,
        genresCount,
        concertHallsCount,
        avgSongsPerAlbum,
        earliestSong,
        latestSong,
        songsPerGenre,
        recentAdditions: {
            songs: recentSongsCount,
            albums: recentAlbumsCount,
            composers: recentComposersCount,
            productionCountries: recentCountriesCount,
            genres: recentGenresCount,
            concertHalls: recentConcertHallsCount,
        },
    };

    return NextResponse.json(statistics);
}
