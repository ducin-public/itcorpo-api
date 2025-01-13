import { FILES } from "../files";
import { DbSchema } from "./db-schema";
import { FileDb } from "./file-db";

export const db = new FileDb<DbSchema>({
    path: FILES.DATABASE_FILE,
    accessMode: 'RW'
});

export async function initDb() {
    await db.read();
    return db
}
