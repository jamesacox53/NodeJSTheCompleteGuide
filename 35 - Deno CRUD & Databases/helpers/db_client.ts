import { MongoClient, Database } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
import mongoURL from '../sensitive/mongoDBCreds.ts';

let db: Database;

export function connect() {
    const client = new MongoClient();
    client.connectWithUri(mongoURL);

    db = client.database('todo-app');
}

export function getDb() {
    return db;
}