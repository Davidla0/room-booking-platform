// src/lib/prisma.ts
import 'dotenv/config';                 // כדי ש-DATABASE_URL ייטען מה-.env
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,                         
    log: ['query', 'error', 'warn'], 
  });

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
