import knex from "knex";
import config from "./knexfile.js";
import dotenv from "dotenv";

dotenv.config();
const db = knex(config.development);

export default db;
