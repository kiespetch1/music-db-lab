import { NextResponse } from "next/server";
import { getPrismaClient } from "~/lib/prisma";

type ReferenceType = "album" | "composerArtist" | "productionCountry" | "genre" | "concertHall";

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const typeParam = searchParams.get("type");
        const db = searchParams.get("db") === "mysql" ? "mysql" : "postgres";
        console.log("БД в справочнике: " + db);
        const prisma = getPrismaClient(db);

        if (!typeParam) {
            return NextResponse.json({ error: "Параметр type обязателен" }, { status: 400 });
        }

        const type = typeParam as ReferenceType;
        let data;

        switch (type) {
            case "album":
                data = await prisma.album.findMany({
                    select: { id: true, name: true, release_date: true },
                });
                break;
            case "composerArtist":
                data = await prisma.composerArtist.findMany({
                    select: { id: true, name: true },
                });
                break;
            case "productionCountry":
                data = await prisma.productionCountry.findMany({
                    select: { id: true, name: true, country_code: true },
                });
                break;
            case "genre":
                data = await prisma.genre.findMany({
                    select: { id: true, name: true, description: true },
                });
                break;
            case "concertHall":
                data = await prisma.concertHall.findMany({
                    select: { id: true, name: true, location: true, capacity: true },
                });
                break;
            default:
                return NextResponse.json({ error: "Неизвестный тип справочника" }, { status: 400 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Ошибка при получении справочника:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
        }
    }
}
