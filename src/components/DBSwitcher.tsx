"use client";

import {useDB} from "~/lib/DBContext";

export default function DBSwitcher() {
    const {currentDb, setCurrentDb} = useDB();

    const switchDb = (newDb: "postgres" | "mysql") => {
        setCurrentDb(newDb);
        console.log("Выбрана база:", newDb);
    };

    return (
        <div className="card bg-base-200 p-2 shadow md:col-span-2">
            <div className="flex gap-4 mb-1">
            <div className="self-center text-s">Используемая БД:</div>
                <button
                    onClick={() => switchDb("postgres")}
                    className={`btn ${currentDb === "postgres" ? "btn-active" : ""}`}
                >
                    Postgres
                </button>
                <button
                    onClick={() => switchDb("mysql")}
                    className={`btn ${currentDb === "mysql" ? "btn-active" : ""}`}
                >
                    MySQL
                </button>
            </div>
        </div>
    );
}
