import { NextResponse } from "next/server";
import { getPrismaClient } from "~/lib/prisma";
import type { Prisma, ComposerArtist } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const db = searchParams.get("db") === "mysql" ? "mysql" : "postgres";
        const prisma = getPrismaClient(db);
        const genre = searchParams.get("genre");
        const year = searchParams.get("year");

        let whereClause: Prisma.ComposerArtistWhereInput = {};

        if (genre) {
            whereClause = {
                songs: {
                    some: {
                        genre: {
                            name: { equals: genre, mode: "insensitive" },
                        },
                    },
                },
            };
        }
        if (year) {
            const start = new Date(`${year}-01-01`);
            const end = new Date(`${year}-12-31T23:59:59.999Z`);
            if (whereClause.songs && "some" in whereClause.songs) {
                whereClause = {
                    ...whereClause,
                    songs: {
                        some: {
                            ...((whereClause.songs as { some: Prisma.SongWhereInput }).some),
                            releaseDate: { gte: start, lte: end },
                        },
                    },
                };
            } else {
                whereClause = {
                    songs: {
                        some: {
                            releaseDate: { gte: start, lte: end },
                        },
                    },
                };
            }
        }

        const composers: ComposerArtist[] = await prisma.composerArtist.findMany({
            where: whereClause,
            orderBy: {name: "asc"},
        });
        return NextResponse.json(composers);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
