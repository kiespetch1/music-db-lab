"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type DBType = "postgres" | "mysql";

type DBContextType = {
    currentDb: DBType;
    setCurrentDb: (db: DBType) => void;
};

const DBContext = createContext<DBContextType | undefined>(undefined);

export function DBProvider({ children }: { children: ReactNode }) {
    const [currentDb, setCurrentDb] = useState<DBType>("postgres");

    return (
        <DBContext.Provider value={{ currentDb, setCurrentDb }}>
            {children}
        </DBContext.Provider>
    );
}

export function useDB() {
    const context = useContext(DBContext);
    if (!context) {
        throw new Error("useDB должен использоваться внутри DBProvider");
    }
    return context;
}
