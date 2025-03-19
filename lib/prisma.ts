import { PrismaClient } from '@prisma/client';

const postgresClient = new PrismaClient({
    datasourceUrl: process.env.DATABASE_POSTGRES_URL,
});

const mysqlClient = new PrismaClient({
    datasourceUrl:  process.env.DATABASE_MYSQL_URL,
});

//
// Функция для выбора контекста БД
//
export function getPrismaClient(schema: 'postgres' | 'mysql') {
    return schema === 'postgres' ? postgresClient : mysqlClient;
}

export { postgresClient, mysqlClient };
