"use client";
// @ts-nocheck
/* eslint-disable */

import React, { useState, useEffect, useCallback } from "react";
import { useDB } from "~/lib/DBContext";
import { z } from "zod";
import {
    albumSchema,
    songSchema,
    genreSchema,
    composerArtistSchema,
    productionCountrySchema,
    concertHallSchema,
} from "~/validationSchemas";

const schemas: Record<string, z.ZodSchema<any>> = {
    album: albumSchema,
    song: songSchema,
    genre: genreSchema,
    composerArtist: composerArtistSchema,
    productionCountry: productionCountrySchema,
    concertHall: concertHallSchema,
};

type ReferenceType =
    | "album"
    | "composerArtist"
    | "productionCountry"
    | "genre"
    | "concertHall";

interface Reference {
    id: number;
    name: string;
}

interface ReferenceAddModalProps {
    type: ReferenceType;
    db: string;
    onClose: () => void;
    onCreated: () => void;
}

const ReferenceAddModal: React.FC<ReferenceAddModalProps> = ({
                                                                 type,
                                                                 db,
                                                                 onClose,
                                                                 onCreated,
                                                             }) => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`/api/add?db=${db}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ entityType: type, ...formData }),
            });
            if (!response.ok) {
                const errData = await response.json();
                setError(errData.error || "Ошибка при добавлении записи");
            } else {
                onCreated();
                onClose();
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "Ошибка при отправке запроса");
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded w-80">
                <h2 className="text-lg font-bold mb-2">
                    Добавить новый{" "}
                    {type === "concertHall"
                        ? "концертный зал"
                        : type === "composerArtist"
                            ? "композитора/исполнителя"
                            : type === "productionCountry"
                                ? "страну производства"
                                : type === "genre"
                                    ? "жанр"
                                    : "альбом"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div>
                        <label className="block font-medium">Название:</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            className="border rounded p-1 w-full"
                            required
                        />
                    </div>
                    {type === "album" && (
                        <div>
                            <label className="block font-medium">Дата выпуска:</label>
                            <input
                                type="date"
                                name="release_date"
                                onChange={handleChange}
                                className="border rounded p-1 w-full"
                                required
                            />
                        </div>
                    )}
                    {type === "composerArtist" && (
                        <>
                            <div>
                                <label className="block font-medium">Дата рождения:</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    onChange={handleChange}
                                    className="border rounded p-1 w-full"
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <label className="block font-medium">Страна:</label>
                                    <select
                                        id="country_id"
                                        name="country_id"
                                        onChange={handleChange}
                                        className="border rounded p-1 w-full"
                                        required
                                    >
                                        <option value="">Выберите страну</option>
                                        {productionCountryOptions.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveModal("productionCountry")}
                                    className="mt-6 ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    Добавить
                                </button>
                            </div>
                        </>
                    )}
                    {type === "productionCountry" && (
                        <>
                            <div>
                                <label className="block font-medium">Код страны:</label>
                                <input
                                    type="text"
                                    name="country_code"
                                    onChange={handleChange}
                                    className="border rounded p-1 w-full"
                                    required
                                />
                            </div>
                        </>
                    )}
                    {type === "genre" && (
                        <>
                            <div>
                                <label className="block font-medium">Описание жанра:</label>
                                <input
                                    type="text"
                                    name="description"
                                    onChange={handleChange}
                                    className="border rounded p-1 w-full"
                                    required
                                />
                            </div>
                        </>
                    )}
                    {type === "concertHall" && (
                        <>
                            <div>
                                <label className="block font-medium">Вместимость:</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    onChange={handleChange}
                                    className="border rounded p-1 w-full"
                                    required
                                />
                            </div>
                        </>
                    )}
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-2 py-1 border rounded"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                            Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CreateMusicEntityPage: React.FC = () => {
    const [entityType, setEntityType] = useState<string>("album");
    const [formData, setFormData] = useState<any>({});
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { currentDb } = useDB();

    const [albumOptions, setAlbumOptions] = useState<Reference[]>([]);
    const [composerArtistOptions, setComposerArtistOptions] = useState<Reference[]>([]);
    const [productionCountryOptions, setProductionCountryOptions] = useState<Reference[]>([]);
    const [genreOptions, setGenreOptions] = useState<Reference[]>([]);
    const [concertHallOptions, setConcertHallOptions] = useState<Reference[]>([]);

    const [activeModal, setActiveModal] = useState<ReferenceType | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleEntityTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEntityType(e.target.value);
        setFormData({});
        setResult(null);
        setError(null);
    };

    const fetchOptions = useCallback(
        async (type: ReferenceType, setFunc: (arr: Reference[]) => void) => {
            try {
                const response = await fetch(`/api/references?type=${type}&db=${currentDb}`);
                if (response.ok) {
                    const data = await response.json();
                    setFunc(data);
                } else {
                    setFunc([]);
                }
            } catch (err) {
                setFunc([]);
            }
        },
        [currentDb]
    );

    useEffect(() => {
        setAlbumOptions([]);
        setComposerArtistOptions([]);
        setProductionCountryOptions([]);
        setGenreOptions([]);
        setConcertHallOptions([]);
    }, [currentDb]);

    useEffect(() => {
        if (entityType === "song") {
            if (!albumOptions.length) fetchOptions("album", setAlbumOptions);
            if (!composerArtistOptions.length) fetchOptions("composerArtist", setComposerArtistOptions);
            if (!productionCountryOptions.length) fetchOptions("productionCountry", setProductionCountryOptions);
            if (!genreOptions.length) fetchOptions("genre", setGenreOptions);
            if (!concertHallOptions.length) fetchOptions("concertHall", setConcertHallOptions);
        }
        if (entityType === "composerArtist" && !productionCountryOptions.length) {
            fetchOptions("productionCountry", setProductionCountryOptions);
        }
    }, [
        entityType,
        currentDb,
        albumOptions.length,
        composerArtistOptions.length,
        productionCountryOptions.length,
        genreOptions.length,
        concertHallOptions.length,
        fetchOptions,
    ]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        const schema = schemas[entityType];
        if (schema) {
            const validation = schema.safeParse(formData);
            if (!validation.success) {
                const messages = validation.error.errors.map((err) => err.message).join(", ");
                setError(messages);
                return;
            }
        }

        try {
            const response = await fetch(`/api/add?db=${currentDb}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ entityType, ...formData }),
            });
            if (!response.ok) {
                const errData = await response.json();
                setError(errData.error || "Ошибка при создании записи");
            } else {
                const data = await response.json();
                setResult(data);
            }
        } catch (err) {
            if (err instanceof Error) setError(err.message || "Ошибка при отправке запроса");
        }
    };

    const handleModalClose = () => {
        setActiveModal(null);
    };

    const handleModalCreated = () => {
        if (activeModal) {
            fetchOptions(activeModal, (options) => {
                switch (activeModal) {
                    case "album":
                        setAlbumOptions(options);
                        break;
                    case "composerArtist":
                        setComposerArtistOptions(options);
                        break;
                    case "productionCountry":
                        setProductionCountryOptions(options);
                        break;
                    case "genre":
                        setGenreOptions(options);
                        break;
                    case "concertHall":
                        setConcertHallOptions(options);
                        break;
                    default:
                        break;
                }
            });
        }
    };

    const getRussianEntityName = (name: string): string => {
        switch (name) {
            case "album":
                return "Альбом";
            case "song":
                return "Песня";
            case "composerArtist":
                return "Композитор/Исполнитель";
            case "productionCountry":
                return "Страна производства";
            case "genre":
                return "Жанр";
            case "concertHall":
                return "Концертное здание";
            default:
                return "";
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">Добавить запись в музыкальную БД</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Выбор типа записи */}
                <div>
                    <label htmlFor="entityType" className="block font-medium">
                        Тип записи:
                    </label>
                    <select
                        id="entityType"
                        name="entityType"
                        value={entityType}
                        onChange={handleEntityTypeChange}
                        className="border rounded p-2"
                    >
                        <option value="album">Альбом</option>
                        <option value="song">Песня</option>
                        <option value="composerArtist">Композитор/Исполнитель</option>
                        <option value="productionCountry">Страна производства</option>
                        <option value="genre">Жанр</option>
                        <option value="concertHall">Концертный зал</option>
                    </select>
                </div>

                {/* Форма для "album": ввод имени и даты выпуска */}
                {entityType === "album" && (
                    <>
                        <div>
                            <label htmlFor="name" className="block font-medium">
                                Название альбома:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="release_date" className="block font-medium">
                                Дата выпуска:
                            </label>
                            <input
                                type="date"
                                id="release_date"
                                name="release_date"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                    </>
                )}

                {/* Форма для "song": название, дата релиза и выпадающие списки */}
                {entityType === "song" && (
                    <>
                        <div>
                            <label htmlFor="title" className="block font-medium">
                                Название песни:
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="releaseDate" className="block font-medium">
                                Дата релиза:
                            </label>
                            <input
                                type="date"
                                id="releaseDate"
                                name="releaseDate"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">
                                <label htmlFor="albumId" className="block font-medium">
                                    Альбом:
                                </label>
                                <select
                                    id="albumId"
                                    name="albumId"
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Выберите альбом</option>
                                    {albumOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal("album")}
                                className="mt-6 ml-2 bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Добавить
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">
                                <label htmlFor="composerArtistId" className="block font-medium">
                                    Композитор/Исполнитель:
                                </label>
                                <select
                                    id="composerArtistId"
                                    name="composerArtistId"
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Выберите исполнителя</option>
                                    {composerArtistOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal("composerArtist")}
                                className="mt-6 ml-2 bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Добавить
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">
                                <label htmlFor="productionCountryId" className="block font-medium">
                                    Страна производства:
                                </label>
                                <select
                                    id="productionCountryId"
                                    name="productionCountryId"
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Выберите страну</option>
                                    {productionCountryOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal("productionCountry")}
                                className="mt-6 ml-2 bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Добавить
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">
                                <label htmlFor="genreId" className="block font-medium">
                                    Жанр:
                                </label>
                                <select
                                    id="genreId"
                                    name="genreId"
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Выберите жанр</option>
                                    {genreOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal("genre")}
                                className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Добавить
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">
                                <label htmlFor="concertHallId" className="block font-medium">
                                    Концертный зал:
                                </label>
                                <select
                                    id="concertHallId"
                                    name="concertHallId"
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Выберите зал</option>
                                    {concertHallOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal("concertHall")}
                                className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Добавить
                            </button>
                        </div>
                    </>
                )}

                {entityType === "composerArtist" && (
                    <>
                        <div>
                            <label htmlFor="name" className="block font-medium">
                                Имя композитора/исполнителя:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="birth_date" className="block font-medium">
                                Дата рождения:
                            </label>
                            <input
                                type="date"
                                id="birth_date"
                                name="birth_date"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">
                                <label htmlFor="country_id" className="block font-medium">
                                    Страна:
                                </label>
                                <select
                                    id="country_id"
                                    name="country_id"
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                    required
                                >
                                    <option value="">Выберите страну</option>
                                    {productionCountryOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveModal("productionCountry")}
                                className="mt-6 ml-2 bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Добавить
                            </button>
                        </div>
                    </>
                )}
                {entityType === "productionCountry" && (
                    <>
                        <div>
                            <label htmlFor="name" className="block font-medium">
                                Название страны:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="country_code" className="block font-medium">
                                Код страны:
                            </label>
                            <input
                                type="text"
                                id="country_code"
                                name="country_code"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                    </>
                )}
                {entityType === "genre" && (
                    <>
                        <div>
                            <label htmlFor="name" className="block font-medium">
                                Название жанра:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block font-medium">
                                Описание жанра:
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                    </>
                )}
                {entityType === "concertHall" && (
                    <>
                        <div>
                            <label htmlFor="name" className="block font-medium">
                                Название зала:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block font-medium">
                                Локация:
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="capacity" className="block font-medium">
                                Вместимость:
                            </label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Создать
                </button>
            </form>

            {error && <div className="mt-4 text-red-500">Ошибка: {error}</div>}
            {result && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold">
                        ✅ Создана запись &#34;{getRussianEntityName(entityType)}&#34; с данными:
                    </h2>
                    <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}

            {activeModal && (
                <ReferenceAddModal
                    type={activeModal}
                    db={currentDb}
                    onClose={handleModalClose}
                    onCreated={handleModalCreated}
                />
            )}
        </div>
    );
};

export default CreateMusicEntityPage;
