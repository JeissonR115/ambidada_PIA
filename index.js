
import { start } from "./src/start.js";
import dotenv from "dotenv";
// Cargar las variables de entorno desde el archivo .env
dotenv.config();
const PORT = process.env.PORT || 3000;
const URL = process.env.DB_URL || 'mongodb+srv://***.mongodb.net/';
const dbName = process.env.DB_NAME || 'db';
const collections = {
    sensorData: "sensorData",
    users: "users"
};
start({
    port:PORT,
    url:URL,
    dbName:dbName,
    collectionList:collections,
    collectionName: collections.sensorData,
})
