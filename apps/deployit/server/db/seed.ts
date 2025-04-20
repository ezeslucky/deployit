/* eslint-disable @typescript-eslint/no-unused-vars */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!

const pg = postgres(connectionString,{max:1})

const _db = drizzle(pg)

async function seed(){
    console.log("> Seed:", 
        process.env.DATABASE_PATH, "\n"
    )
}

seed().catch((e)=>{
    console.log(e)
    process.exit(1)
})