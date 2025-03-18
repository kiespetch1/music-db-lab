"use client";

import { useEffect, useState } from "react";
import { useDB } from "~/lib/DBContext";
import {SongGenreStat, Statistics} from "~/types/DTOs";

export default function StatisticsClientPage() {
    const { currentDb } = useDB();
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/statistics?db=${currentDb}`)
            .then((res) => res.json())
            .then((data) => {
                setStatistics(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Ошибка при получении статистики:", err);
                setLoading(false);
            });
    }, [currentDb]);

    if (loading) return <p>Загрузка статистики...</p>;
    if (!statistics) return <p>Нет данных</p>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-4">Статистика по базе данных {statistics.currentDb}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Общая статистика */}
                <div className="card bg-base-200 p-4 shadow">
                    <h2 className="font-semibold text-xl mb-2">Общее количество сущностей</h2>
                    <ul className="list-disc ml-6">
                        <li>Песен: {statistics.songsCount}</li>
                        <li>Альбомов: {statistics.albumsCount}</li>
                        <li>Композиторов и исполнителей: {statistics.composersCount}</li>
                        <li>Стран производства: {statistics.countriesCount}</li>
                        <li>Жанров: {statistics.genresCount}</li>
                        <li>Залов исполнения: {statistics.concertHallsCount}</li>
                    </ul>
                </div>

                {/* Дополнительные статистики */}
                <div className="card bg-base-200 p-4 shadow">
                    <h2 className="font-semibold text-xl mb-2">Дополнительные статистики</h2>
                    <ul className="list-disc ml-6">
                        <li>Среднее количество песен на альбом: {statistics.avgSongsPerAlbum}</li>
                        <li>
                            Самая ранняя песня:{" "}
                            {statistics.earliestSong
                                ? new Date(statistics.earliestSong.releaseDate).toLocaleDateString("ru-RU")
                                : "N/A"}
                        </li>
                        <li>
                            Самая поздняя песня:{" "}
                            {statistics.latestSong
                                ? new Date(statistics.latestSong.releaseDate).toLocaleDateString("ru-RU")
                                : "N/A"}
                        </li>
                    </ul>
                </div>

                {/* Статистика по жанрам */}
                <div className="card bg-base-200 p-4 shadow md:col-span-2">
                    <h2 className="font-semibold text-xl mb-2">Песни по жанрам</h2>
                    <ul className="list-disc ml-6">
                        {statistics.songsPerGenre.map((genre: SongGenreStat) => (
                            <li key={genre.name}>
                                {genre.name}: {genre._count.songs} песен
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
