import Link from "next/link";
import { ReactNode } from "react";
import './globals.css';
import { DBProvider } from "~/lib/DBContext";
import DBSwitcher from "@/components/DBSwitcher";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru">
        <head>
            <title>БД о музыке</title>
        </head>
        <body className="min-h-screen flex flex-col">
        <DBProvider>
            {/* Шапка сайта */}
            <header className="bg-base-200 text-black p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="text-xl font-bold mr-2">
                        <Link href="/">БД о музыке</Link>
                    </div>
                    {/* Выпадающий список для выбора БД */}
                    <DBSwitcher />
                </div>
                <nav>
                    <ul className="flex gap-4">
                        <li>
                            <Link href="/queries" className="btn btn-ghost text-black">
                                Запросы к БД
                            </Link>
                        </li>
                        <li>
                            <Link href="/statistics" className="btn btn-ghost text-black">
                                Статистика по БД
                            </Link>
                        </li>
                        <li>
                            <Link href="/add" className="btn btn-ghost text-black">
                                Добавить запись
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Основной контент */}
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>

            {/* Подвал сайта */}
            <footer className="bg-base-200 text-black p-4">
                <div className="text-left text-sm">
                    © 2025 Сайт сделан студенткой группы ИВТ-Б22 Гордионок Натальей
                </div>
            </footer>
        </DBProvider>
        </body>
        </html>
    );
}
