import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.TORNEO_STORAGE_POSTGRES_URL_NO_SSL!)

export default sql

