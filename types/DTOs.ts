import {Song} from "@prisma/client";

export type Statistics = {
    currentDb: "postgres" | "mysql";
    songsCount: number;
    albumsCount: number;
    composersCount: number;
    countriesCount: number;
    genresCount: number;
    concertHallsCount: number;
    avgSongsPerAlbum: string;
    earliestSong: Song | null;
    latestSong: Song | null;
    songsPerGenre: SongGenreStat[];
};

export type SongGenreStat = {
    name: string;
    _count: {
        songs: number;
    };
};



