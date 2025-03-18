import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_POSTGRES,
});

async function createPublic2Schema() {
    try {
        await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public2;`;
        console.log("Схема 'public2' успешно создана (если она еще не существовала).");
    } catch (error) {
        console.error("Ошибка при создании схемы 'public2':", error);
    } finally {
        await prisma.$disconnect();
    }
}

createPublic2Schema();
