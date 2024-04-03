import express from "express";
import { DataBase } from "./src/DataBase.js";
import dotenv from "dotenv";
// Cargar las variables de entorno desde el archivo .env
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.DB_URL || 'mongodb+srv://***.mongodb.net/';
const dbName = process.env.DB_NAME || 'db';
const collections = {
    sensorData: "sensorData",
    users: "users"
};
const dataBase = new DataBase(URL, dbName);
app.get(`/${collections.sensorData}`, async (req, res, next) => {
    try {
        const allData = await dataBase.getAll(collections.sensorData);
        res.json(allData);
    } catch (err) {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
