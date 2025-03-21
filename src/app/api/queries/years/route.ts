import { NextResponse } from "next/server";
import { getPrismaClient } from "~/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const db = searchParams.get("db") === "mysql" ? "mysql" : "postgres";
        const prisma = getPrismaClient(db);
        const composer = searchParams.get("composer");

        const songs = await prisma.song.findMany({
            where: composer
                ? {
                    composerArtist: {
                        name: { equals: composer, mode: "insensitive" },
                    },
                }
                : {},
            select: {
                releaseDate: true,
            },
            orderBy: {
                releaseDate: "asc",
            },
        });

        // Извлекаем уникальные годы
        const yearsSet = new Set<number>();
        songs.forEach((song) => {
            yearsSet.add(new Date(song.releaseDate).getFullYear());
        });
        const years = Array.from(yearsSet).sort((a, b) => a - b);
        return NextResponse.json(years);
    } catch (error) {
        if (error instanceof Error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
