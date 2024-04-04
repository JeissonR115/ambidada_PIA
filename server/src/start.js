
import { DataBase } from "./DataBase.js";
import express from "express";
export const start = ({ url, dbName, collectionList,collectionName, port }) => {

    const app = express();
    const dataBase = new DataBase(url, dbName, collectionList);
    dataBase.use(collectionName)
    const defaultUrl = `/${collectionList[collectionName]}`
    app.get(defaultUrl, async (req, res) => {
        const allData = await dataBase.getAll();
        res.json(allData);
    });
    app.get(`${defaultUrl}/date`, async (req, res) => {
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const one = req.query.one_day;
        if (!startDate) res.status(400).json({ error: "Se requieren las fechas de inicio y fin" });
        const dates = await dataBase.getByDate(startDate, endDate, one);
        res.json(dates)

    });
    app.listen(port, () => {
        console.log(`Servidor en ejecución en http://localhost:${port}`);
    });
}

