import {NextResponse} from "next/server";
import {getPrismaClient} from "~/lib/prisma";
import type {Prisma, Song} from "@prisma/client";

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const db = searchParams.get("db") === "mysql" ? "mysql" : "postgres";
        const prisma = getPrismaClient(db);

        const title = searchParams.get("title");
        const genre = searchParams.get("genre");
        const startYear = searchParams.get("startYear");
        const endYear = searchParams.get("endYear");
        const year = searchParams.get("year");
        const composer = searchParams.get("composer");

        const where: Prisma.SongWhereInput = {};

        if (title) {
            where.title = {equals: title, mode: "insensitive"};
        }
        if (genre) {
            where.genre = {name: {equals: genre, mode: "insensitive"}};
        }
        if (startYear && endYear) {
            const start = new Date(`${startYear}-01-01`);
            const end = new Date(`${endYear}-12-31T23:59:59.999Z`);
            where.releaseDate = {gte: start, lte: end};
        }
        if (year) {
            const singleStart = new Date(`${year}-01-01`);
            const singleEnd = new Date(`${year}-12-31T23:59:59.999Z`);
            where.releaseDate = {gte: singleStart, lte: singleEnd};
        }

        if (composer) {
            where.composerArtist = {name: {equals: composer, mode: "insensitive"}};
        }

        const songs: Song[] = await prisma.song.findMany({
            where,
            orderBy: {title: "asc"},
            include: {
                album: true,
                genre: true,
                concertHall: true,
                composerArtist: {include: {country: true}},
            },
        });

        return NextResponse.json(songs);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
    }
}

