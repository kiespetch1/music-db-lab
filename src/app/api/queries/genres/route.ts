import {NextResponse} from "next/server";
import {getPrismaClient} from "~/lib/prisma";

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const db = searchParams.get("db") === "mysql" ? "mysql" : "postgres";
        const prisma = getPrismaClient(db);
        const composer = searchParams.get("composer");

        let genres;
        if (composer) {
            genres = await prisma.genre.findMany({
                where: {
                    songs: {
                        some: {
                            composerArtist: {
                                name: {equals: composer, mode: "insensitive"},
                            },
                        },
                    },
                },
                orderBy: {name: "asc"},
            });
        } else {
            genres = await prisma.genre.findMany({
                orderBy: {name: "asc"},
            });
        }
        return NextResponse.json(genres);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
    }
}
