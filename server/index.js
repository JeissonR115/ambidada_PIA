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
const dataBase = new DataBase(URL, dbName, collections);
dataBase.use('sensorData')
app.get(`/${collections.sensorData}`, async (req, res, next) => {
    try {
        const allData = await dataBase.getAll();
        res.json(allData);
    } catch (err) {
        next(err);
    }
});

app.get(`/${collections.sensorData}/date`, async (req, res) => {
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    const one = req.query.one_day;
    if (!startDate) res.status(400).json({ error: "Se requieren las fechas de inicio y fin" });
    const dates = await dataBase.getByDate(startDate, endDate, one);
    res.json(dates)

});
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
