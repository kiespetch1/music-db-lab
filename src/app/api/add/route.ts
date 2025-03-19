import { NextResponse } from "next/server";
import { getPrismaClient } from "~/lib/prisma";

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const db = searchParams.get("db") === "mysql" ? "mysql" : "postgres";
        console.log("БД в апи: " + db);
        const prisma = getPrismaClient(db);

        const body = await request.json();
        const { entityType } = body;
        let created;

        switch (entityType) {
            case "album":
                created = await prisma.album.create({
                    data: {
                        name: body.name,
                        release_date: new Date(body.release_date),
                    },
                });
                break;
            case "song":
                created = await prisma.song.create({
                    data: {
                        title: body.title,
                        releaseDate: new Date(body.releaseDate),
                        albumId: Number(body.albumId),
                        composerArtistId: Number(body.composerArtistId),
                        productionCountryId: Number(body.productionCountryId),
                        genreId: Number(body.genreId),
                        concertHallId: Number(body.concertHallId),
                    },
                });
                break;
            case "composerArtist":
                created = await prisma.composerArtist.create({
                    data: {
                        name: body.name,
                        birth_date: new Date(body.birth_date),
                        country_id: Number(body.country_id),
                    },
                });
                break;
            case "productionCountry":
                created = await prisma.productionCountry.create({
                    data: {
                        name: body.name,
                        country_code: body.country_code,
                    },
                });
                break;
            case "genre":
                created = await prisma.genre.create({
                    data: {
                        name: body.name,
                        description: body.description,
                    },
                });
                break;
            case "concertHall":
                created = await prisma.concertHall.create({
                    data: {
                        name: body.name,
                        location: body.location,
                        capacity: Number(body.capacity),
                    },
                });
                break;
            default:
                return NextResponse.json({ error: "Неизвестный тип сущности" }, { status: 400 });
        }

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Ошибка при создании сущности:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
