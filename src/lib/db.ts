import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
// import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
// import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@/lib/schema';

let db: NodePgDatabase<typeof schema> | null = null;

export function getDb() {
    if (!db) {
        // if (!process.env.DATABASE_URL) {
        //     throw new Error('DATABASE_URL is not set');
        // }

        db = drizzle({
            connection: {
                connectionString: process.env.DATABASE_URL,
                // ssl: !Env.DATABASE_URL.includes('localhost') && !Env.DATABASE_URL.includes('127.0.0.1'),
            },
            schema,
        });
    }
    return db;
}

// if (process.env.NODE_ENV === 'production') {
//     await migrate(getDb(), {
//         migrationsFolder: path.join(process.cwd(), 'migrations'),
//     });
// }

