import { PrismaClient } from '@prisma/client';

const postgresClient = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_POSTGRES,
});

const mysqlClient = new PrismaClient({
    datasourceUrl:  process.env.MYSQL_DB_POSTGRES_URL,
});

//
// Функция для выбора контекста БД
//
export function getPrismaClient(schema: 'postgres' | 'mysql') {
    return schema === 'postgres' ? postgresClient : mysqlClient;
}

export { postgresClient, mysqlClient };
