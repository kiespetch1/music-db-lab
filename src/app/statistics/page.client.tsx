"use client";

import { useEffect, useState } from "react";
import { Statistics, SongGenreStat } from "~/types/DTOs";

export default function StatisticsClientPage() {
    const [statsPostgres, setStatsPostgres] = useState<Statistics | null>(null);
    const [statsMysql, setStatsMysql] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [resPostgres, resMysql] = await Promise.all([
                    fetch(`/api/statistics?db=postgres`, { cache: "no-store" }),
                    fetch(`/api/statistics?db=mysql`, { cache: "no-store" }),
                ]);
                const dataPostgres: Statistics = await resPostgres.json();
                const dataMysql: Statistics = await resMysql.json();
                setStatsPostgres(dataPostgres);
                setStatsMysql(dataMysql);
            } catch (error) {
                console.error("Ошибка при получении статистики:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return <p>Загрузка статистики...</p>;
    if (!statsPostgres || !statsMysql) return <p>Нет данных</p>;

    const renderStatsCards = (stats: Statistics) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Карточка: Общее количество сущностей */}
            <div className="card bg-base-200 p-4 shadow">
                <h2 className="font-semibold text-xl mb-2">Общее количество сущностей</h2>
                <ul className="list-disc ml-6">
                    <li>Песен: {stats.songsCount}</li>
                    <li>Альбомов: {stats.albumsCount}</li>
                    <li>Композиторов и исполнителей: {stats.composersCount}</li>
                    <li>Стран производства: {stats.countriesCount}</li>
                    <li>Жанров: {stats.genresCount}</li>
                    <li>Залов исполнения: {stats.concertHallsCount}</li>
                </ul>
            </div>

            {/* Карточка: Дополнительные статистики */}
            <div className="card bg-base-200 p-4 shadow">
                <h2 className="font-semibold text-xl mb-2">Дополнительные статистики</h2>
                <ul className="list-disc ml-6">
                    <li>Среднее количество песен на альбом: {stats.avgSongsPerAlbum}</li>
                    <li>
                        Самая ранняя песня:{" "}
                        {stats.earliestSong
                            ? new Date(stats.earliestSong.releaseDate).toLocaleDateString("ru-RU")
                            : "N/A"}
                    </li>
                    <li>
                        Самая поздняя песня:{" "}
                        {stats.latestSong
                            ? new Date(stats.latestSong.releaseDate).toLocaleDateString("ru-RU")
                            : "N/A"}
                    </li>
                </ul>
            </div>

            {/* Карточка: Статистика по жанрам */}
            <div className="card bg-base-200 p-4 shadow">
                <h2 className="font-semibold text-xl mb-2">Песни по жанрам</h2>
                <ul className="list-disc ml-6">
                    {stats.songsPerGenre.map((genreStat: SongGenreStat) => (
                        <li key={genreStat.name}>
                            {genreStat.name}: {genreStat._count.songs} песен
                        </li>
                    ))}
                </ul>
            </div>
            {/* Блок: Недавние добавления за последнюю неделю */}
            <div className="card bg-base-200 p-4 shadow">
                <h2 className="font-semibold text-xl mb-2">Недавние добавления (последняя неделя)</h2>
                <ul className="list-disc ml-6">
                    <li>Песен: {stats.recentAdditions?.songs}</li>
                    <li>Альбомов: {stats.recentAdditions?.albums}</li>
                    <li>Композиторов и исполнителей: {stats.recentAdditions?.composers}</li>
                    <li>Стран производства: {stats.recentAdditions?.productionCountries}</li>
                    <li>Жанров: {stats.recentAdditions?.genres}</li>
                    <li>Залов исполнения: {stats.recentAdditions?.concertHalls}</li>
                </ul>
            </div>

        </div>
    );

    return (
        <div className="space-y-8">
            {/* Статистика для первой БД */}
            <div>
                <h1 className="text-3xl font-bold mb-4">
                    Статистика по базе данных {statsPostgres.currentDb}
                </h1>
                {renderStatsCards(statsPostgres)}
            </div>
            {/* Статистика для второй БД */}
            <div>
                <h1 className="text-3xl font-bold mb-4">
                    Статистика по базе данных {statsMysql.currentDb}
                </h1>
                {renderStatsCards(statsMysql)}
            </div>
        </div>
    );
}
