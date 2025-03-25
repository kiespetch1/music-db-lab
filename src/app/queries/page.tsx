"use client";

import React, {useState, useEffect} from "react";
import {useDB} from "~/lib/DBContext";
import type {
    Song,
    Album,
    ComposerArtist,
    Genre,
    ConcertHall,
    ProductionCountry,
} from "@prisma/client";

// Тип результата запроса с подробными данными песни
export type SongResult = Song & {
    album: Album;
    genre: Genre;
    concertHall: ConcertHall;
    composerArtist: ComposerArtist & { country: ProductionCountry };
};

interface ComposerYearQuery {
    composer: string;
    year: string;
}

interface ComposerGenreQuery {
    composer: string;
    genre: string;
}

export default function QueriesPage() {
    const {currentDb} = useDB();

    const [titleSearched, setTitleSearched] = useState<boolean>(false);
    const [genreSearched, setGenreSearched] = useState<boolean>(false);
    const [yearSearched, setYearSearched] = useState<boolean>(false);
    const [artistAndYearSearched, setArtistAndYearSearched] = useState<boolean>(false);
    const [artistAndGenreSearched, setArtistAndGenreSearched] = useState<boolean>(false);


    // Поиск по названию
    const [titleQuery, setTitleQuery] = useState<string>("");
    const [titleResults, setTitleResults] = useState<SongResult[]>([]);

    // Поиск по жанру (только жанр)
    const [genreQuery, setGenreQuery] = useState<string>("");
    const [genreResults, setGenreResults] = useState<SongResult[]>([]);
    const [genreOnlyOptions, setGenreOnlyOptions] = useState<Genre[]>([]);

    // Поиск по году выпуска (только год – выпадающий список)
    const [yearOnlyOptions, setYearOnlyOptions] = useState<number[]>([]);
    const [yearRangeStart, setYearRangeStart] = useState<string>("");
    const [yearRangeEnd, setYearRangeEnd] = useState<string>("");
    const [yearRangeResults, setYearRangeResults] = useState<SongResult[]>([]);

    // Поиск по исполнителю и году (оба критерия – выпадающие списки)
    const [composerYearQuery, setComposerYearQuery] = useState<ComposerYearQuery>({
        composer: "",
        year: "",
    });
    const [composerYearResults, setComposerYearResults] = useState<SongResult[]>([]);
    const [composerYearComposerOptions, setComposerYearComposerOptions] = useState<ComposerArtist[]>([]);
    const [composerYearYearOptions, setComposerYearYearOptions] = useState<number[]>([]);

    // Поиск по исполнителю и жанру (оба критерия – выпадающие списки)
    const [composerGenreQuery, setComposerGenreQuery] = useState<ComposerGenreQuery>({
        composer: "",
        genre: "",
    });
    const [composerGenreResults, setComposerGenreResults] = useState<SongResult[]>([]);
    const [composerGenreComposerOptions, setComposerGenreComposerOptions] = useState<ComposerArtist[]>([]);
    const [composerGenreGenreOptions, setComposerGenreGenreOptions] = useState<Genre[]>([]);

    // Инициализация опций для запроса по году (без фильтрации)
    useEffect(() => {
        async function fetchYearOnlyOptions() {
            const res = await fetch(`/api/queries/years?db=${currentDb}`);
            const data: number[] = await res.json();
            setYearOnlyOptions(data);
        }

        fetchYearOnlyOptions();
    }, [currentDb]);

    // Инициализация опций для поиска по исполнителю и году
    useEffect(() => {
        async function fetchInitialComposerYear() {
            const resComposers = await fetch(`/api/queries/composers?db=${currentDb}`);
            const composersData: ComposerArtist[] = await resComposers.json();
            setComposerYearComposerOptions(composersData);

            const resYears = await fetch(`/api/queries/years?db=${currentDb}`);
            const yearsData: number[] = await resYears.json();
            setComposerYearYearOptions(yearsData);
        }

        fetchInitialComposerYear();
    }, [currentDb]);

    // Инициализация опций для поиска по исполнителю и жанру
    useEffect(() => {
        async function fetchInitialComposerGenre() {
            const resComposers = await fetch(`/api/queries/composers?db=${currentDb}`);
            const composersData: ComposerArtist[] = await resComposers.json();
            setComposerGenreComposerOptions(composersData);

            const resGenres = await fetch(`/api/queries/genres?db=${currentDb}`);
            const genresData: Genre[] = await resGenres.json();
            setComposerGenreGenreOptions(genresData);
        }

        fetchInitialComposerGenre();
    }, [currentDb]);

    // Инициализация опций для запроса только по жанру
    useEffect(() => {
        async function fetchGenreOnlyOptions() {
            const res = await fetch(`/api/queries/genres?db=${currentDb}`);
            const data: Genre[] = await res.json();
            setGenreOnlyOptions(data);
        }

        fetchGenreOnlyOptions();
    }, [currentDb]);

    // Обработчик поиска по названию
    const handleTitleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch(
            `/api/queries/songs?db=${currentDb}&title=${encodeURIComponent(titleQuery)}`
        );
        const data: SongResult[] = await res.json();
        setTitleResults(data);
        setTitleSearched(true);
    };

    // Обработчик поиска по жанру (только жанр)
    const handleGenreSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch(
            `/api/queries/songs?db=${currentDb}&genre=${encodeURIComponent(genreQuery)}`
        );
        const data: SongResult[] = await res.json();
        setGenreResults(data);
        setGenreSearched(true);
    };

    const handleYearRangeSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!yearRangeStart || !yearRangeEnd) {
            alert("Пожалуйста, выберите оба года");
            return;
        }
        const res = await fetch(
            `/api/queries/songs?db=${currentDb}&startYear=${encodeURIComponent(yearRangeStart)}&endYear=${encodeURIComponent(yearRangeEnd)}`
        );
        const data: SongResult[] = await res.json();
        setYearRangeResults(data);
        setYearSearched(true);
    };

    // Обработчики для поиска по исполнителю и году

    // При выборе исполнителя обновляем список годов для данного исполнителя
    const handleComposerYearComposerChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const composer = e.target.value;
        setComposerYearQuery((prev) => ({...prev, composer}));
        if (composer) {
            const res = await fetch(
                `/api/queries/years?db=${currentDb}&composer=${encodeURIComponent(composer)}`
            );
            const newYearOptions: number[] = await res.json();
            setComposerYearYearOptions(newYearOptions);
            setComposerYearQuery((prev) => ({
                ...prev,
                year: newYearOptions.some((y) => y.toString() === prev.year) ? prev.year : "",
            }));
        } else {
            const res = await fetch(`/api/queries/years?db=${currentDb}`);
            const newYearOptions: number[] = await res.json();
            setComposerYearYearOptions(newYearOptions);
        }
    };

    // При выборе года обновляем список исполнителей для выбранного года
    const handleComposerYearYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value;
        setComposerYearQuery((prev) => ({...prev, year}));
        if (year) {
            const res = await fetch(
                `/api/queries/composers?db=${currentDb}&year=${encodeURIComponent(year)}`
            );
            const newComposerOptions: ComposerArtist[] = await res.json();
            setComposerYearComposerOptions(newComposerOptions);
            setComposerYearQuery((prev) => ({
                ...prev,
                composer: newComposerOptions.some((c) => c.name === prev.composer) ? prev.composer : "",
            }));
        } else {
            const res = await fetch(`/api/queries/composers?db=${currentDb}`);
            const newComposerOptions: ComposerArtist[] = await res.json();
            setComposerYearComposerOptions(newComposerOptions);
        }
    };

    const handleComposerYearSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams({db: currentDb});
        if (composerYearQuery.composer)
            params.append("composer", composerYearQuery.composer);
        if (composerYearQuery.year)
            params.append("year", composerYearQuery.year);
        const res = await fetch(`/api/queries/songs?${params.toString()}`);
        const data: SongResult[] = await res.json();
        setComposerYearResults(data);
        setArtistAndYearSearched(true);
    };

    // Обработчики для поиска по исполнителю и жанру

    const handleComposerGenreComposerChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const composer = e.target.value;
        setComposerGenreQuery((prev) => ({...prev, composer}));
        if (composer) {
            const res = await fetch(
                `/api/queries/genres?db=${currentDb}&composer=${encodeURIComponent(composer)}`
            );
            const newGenreOptions: Genre[] = await res.json();
            setComposerGenreGenreOptions(newGenreOptions);
            setComposerGenreQuery((prev) => ({
                ...prev,
                genre: newGenreOptions.some((g) => g.name === prev.genre) ? prev.genre : "",
            }));
        } else {
            const res = await fetch(`/api/queries/genres?db=${currentDb}`);
            const newGenreOptions: Genre[] = await res.json();
            setComposerGenreGenreOptions(newGenreOptions);
            setArtistAndGenreSearched(true);
        }
    };

    const handleComposerGenreGenreChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const genre = e.target.value;
        setComposerGenreQuery((prev) => ({...prev, genre}));
        if (genre) {
            const res = await fetch(
                `/api/queries/composers?db=${currentDb}&genre=${encodeURIComponent(genre)}`
            );
            const newComposerOptions: ComposerArtist[] = await res.json();
            setComposerGenreComposerOptions(newComposerOptions);
            setComposerGenreQuery((prev) => ({
                ...prev,
                composer: newComposerOptions.some((c) => c.name === prev.composer) ? prev.composer : "",
            }));
        } else {
            const res = await fetch(`/api/queries/composers?db=${currentDb}`);
            const newComposerOptions: ComposerArtist[] = await res.json();
            setComposerGenreComposerOptions(newComposerOptions);
        }
    };

    const handleComposerGenreSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams({db: currentDb});
        if (composerGenreQuery.composer)
            params.append("composer", composerGenreQuery.composer);
        if (composerGenreQuery.genre)
            params.append("genre", composerGenreQuery.genre);
        const res = await fetch(`/api/queries/songs?${params.toString()}`);
        const data: SongResult[] = await res.json();
        setComposerGenreResults(data);
        setArtistAndGenreSearched(true);
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            <h1 className="text-3xl font-bold">Запросы к базе данных</h1>

            <h3 className="text-xl font-bold">Запросы по двум атрибутам</h3>
            {/* Accordion: Поиск песен по исполнителю и году (выпадающие списки) */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="my-accordion"/>
                <div className="collapse-title font-semibold">Поиск песен по исполнителю и году</div>
                <div className="collapse-content">
                    <form onSubmit={handleComposerYearSearch} className="space-y-2">
                        <select
                            value={composerYearQuery.composer}
                            onChange={handleComposerYearComposerChange}
                            className="select select-bordered w-full h-8"
                        >
                            <option value="">Выберите исполнителя</option>
                            {composerYearComposerOptions.map((c) => (
                                <option key={c.id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={composerYearQuery.year}
                            onChange={handleComposerYearYearChange}
                            className="select select-bordered w-full h-8"
                        >
                            <option value="">Выберите год</option>
                            {composerYearYearOptions.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn">Найти</button>
                    </form>
                    <div className="mt-2">
                        {artistAndYearSearched && (composerYearResults.length > 0 ? (
                            <table className="table table-sm w-full">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Дата релиза</th>
                                    <th>Альбом</th>
                                    <th>Исполнитель</th>
                                    <th>Жанр</th>
                                    <th>Страна</th>
                                    <th>Концертный зал</th>
                                </tr>
                                </thead>
                                <tbody>
                                {composerYearResults.map((song) => (
                                    <tr key={song.id}>
                                        <td>{song.id}</td>
                                        <td>{song.title}</td>
                                        <td>{new Date(song.releaseDate).toLocaleDateString("ru-RU")}</td>
                                        <td>{song.album?.name}</td>
                                        <td>{song.composerArtist?.name}</td>
                                        <td>{song.genre?.name}</td>
                                        <td>{song.composerArtist?.country?.name || "-"}</td>
                                        <td>{song.concertHall?.name}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : artistAndYearSearched && <p>Нет результатов</p>)}
                    </div>
                </div>
            </div>

            {/* Accordion: Поиск песен по исполнителю и жанру */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="my-accordion"/>
                <div className="collapse-title font-semibold">Поиск песен по исполнителю и жанру</div>
                <div className="collapse-content">
                    <form onSubmit={handleComposerGenreSearch} className="space-y-2">
                        <select
                            value={composerGenreQuery.composer}
                            onChange={handleComposerGenreComposerChange}
                            className="select select-bordered w-full h-8"
                        >
                            <option value="">Выберите исполнителя</option>
                            {composerGenreComposerOptions.map((c) => (
                                <option key={c.id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={composerGenreQuery.genre}
                            onChange={handleComposerGenreGenreChange}
                            className="select select-bordered w-full h-8"
                        >
                            <option value="">Выберите жанр</option>
                            {composerGenreGenreOptions.map((g) => (
                                <option key={g.id} value={g.name}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn">Найти</button>
                    </form>
                    <div className="mt-2">
                        {artistAndGenreSearched && (composerGenreResults.length > 0 ? (
                            <table className="table table-sm w-full">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Дата релиза</th>
                                    <th>Альбом</th>
                                    <th>Исполнитель</th>
                                    <th>Жанр</th>
                                    <th>Страна</th>
                                    <th>Концертный зал</th>
                                </tr>
                                </thead>
                                <tbody>
                                {composerGenreResults.map((song) => (
                                    <tr key={song.id}>
                                        <td>{song.id}</td>
                                        <td>{song.title}</td>
                                        <td>{new Date(song.releaseDate).toLocaleDateString("ru-RU")}</td>
                                        <td>{song.album?.name}</td>
                                        <td>{song.composerArtist?.name}</td>
                                        <td>{song.genre?.name}</td>
                                        <td>{song.composerArtist?.country?.name || "-"}</td>
                                        <td>{song.concertHall?.name}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : artistAndGenreSearched && <p>Нет результатов</p>)}
                    </div>
                </div>
            </div>

            {/* Accordion: Поиск песен по году выпуска (выпадающий список) */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="my-accordion"/>
                <div className="collapse-title font-semibold">
                    Поиск песен по диапазону годов выпуска
                </div>
                <div className="collapse-content">
                    <form onSubmit={handleYearRangeSearch} className="space-y-2">
                        <select
                            value={yearRangeStart}
                            onChange={(e) => setYearRangeStart(e.target.value)}
                            className="select select-bordered w-full h-8"
                        >
                            <option value="">Начальный год</option>
                            {yearOnlyOptions.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                        <select
                            value={yearRangeEnd}
                            onChange={(e) => setYearRangeEnd(e.target.value)}
                            className="select select-bordered w-full h-8"
                        >
                            <option value="">Конечный год</option>
                            {yearOnlyOptions.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn">
                            Найти
                        </button>
                    </form>
                    <div className="mt-2">
                        {yearSearched && (yearRangeResults.length > 0 ? (
                            <table className="table table-sm w-full">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Дата релиза</th>
                                    <th>Альбом</th>
                                    <th>Исполнитель</th>
                                    <th>Жанр</th>
                                    <th>Страна</th>
                                    <th>Концертный зал</th>
                                </tr>
                                </thead>
                                <tbody>
                                {yearRangeResults.map((song) => (
                                    <tr key={song.id}>
                                        <td>{song.id}</td>
                                        <td>{song.title}</td>
                                        <td>{new Date(song.releaseDate).toLocaleDateString("ru-RU")}</td>
                                        <td>{song.album?.name}</td>
                                        <td>{song.composerArtist?.name}</td>
                                        <td>{song.genre?.name}</td>
                                        <td>{song.composerArtist?.country?.name || "-"}</td>
                                        <td>{song.concertHall?.name}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : yearSearched && <p>Нет результатов</p>)}
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold">Запросы по одному атрибуту</h3>
            {/* Accordion: Поиск песен по жанру */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="my-accordion"/>
                <div className="collapse-title font-semibold">Поиск песен по жанру</div>
                <div className="collapse-content">
                    <form onSubmit={handleGenreSearch} className="space-y-2">
                        <select
                            value={genreQuery}
                            onChange={(e) => setGenreQuery(e.target.value)}
                            className="select select-bordered w-full h-8"
                        >
                            <option value="">Выберите жанр</option>
                            {genreOnlyOptions.map((g) => (
                                <option key={g.id} value={g.name}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn">Найти</button>
                    </form>
                    <div className="mt-2">
                        {genreSearched && (genreResults.length > 0 ? (
                            <table className="table table-sm w-full">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Дата релиза</th>
                                    <th>Альбом</th>
                                    <th>Исполнитель</th>
                                    <th>Жанр</th>
                                    <th>Страна</th>
                                    <th>Концертный зал</th>
                                </tr>
                                </thead>
                                <tbody>
                                {genreResults.map((song) => (
                                    <tr key={song.id}>
                                        <td>{song.id}</td>
                                        <td>{song.title}</td>
                                        <td>{new Date(song.releaseDate).toLocaleDateString("ru-RU")}</td>
                                        <td>{song.album?.name}</td>
                                        <td>{song.composerArtist?.name}</td>
                                        <td>{song.genre?.name}</td>
                                        <td>{song.composerArtist?.country?.name || "-"}</td>
                                        <td>{song.concertHall?.name}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : genreSearched && <p>Нет результатов</p>)}
                    </div>
                </div>
            </div>

            {/* Accordion: Поиск песен по названию */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="my-accordion"/>
                <div className="collapse-title font-semibold">Поиск песен по названию</div>
                <div className="collapse-content">
                    <form onSubmit={handleTitleSearch} className="space-y-2">
                        <input
                            type="text"
                            placeholder="Введите название песни"
                            value={titleQuery}
                            onChange={(e) => setTitleQuery(e.target.value)}
                            className="input input-bordered w-full h-8"
                        />
                        <button type="submit" className="btn">Найти</button>
                    </form>
                    <div className="mt-2">
                        {titleSearched && (titleResults.length > 0 ? (
                            <table className="table table-sm w-full">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Дата релиза</th>
                                    <th>Альбом</th>
                                    <th>Исполнитель</th>
                                    <th>Жанр</th>
                                    <th>Страна</th>
                                    <th>Концертный зал</th>
                                </tr>
                                </thead>
                                <tbody>
                                {titleResults.map((song) => (
                                    <tr key={song.id}>
                                        <td>{song.id}</td>
                                        <td>{song.title}</td>
                                        <td>{new Date(song.releaseDate).toLocaleDateString("ru-RU")}</td>
                                        <td>{song.album?.name}</td>
                                        <td>{song.composerArtist?.name}</td>
                                        <td>{song.genre?.name}</td>
                                        <td>{song.composerArtist?.country?.name || "-"}</td>
                                        <td>{song.concertHall?.name}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : titleSearched && <p>Нет результатов</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
}
