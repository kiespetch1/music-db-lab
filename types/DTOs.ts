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
    recentAdditions?: {
        songs: number;
        albums: number;
        composers: number;
        productionCountries: number;
        genres: number;
        concertHalls: number;
    };
};


export type SongGenreStat = {
    name: string;
    _count: {
        songs: number;
    };
};



