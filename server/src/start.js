
import { DataBase } from "./DataBase.js";
import  cors  from "cors";
import express from "express";
export const start = ({ url, dbName, collectionList,collectionName, port }) => {

    const app = express();
    app.use(cors());
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

    app.get (`${defaultUrl}/find`,async (req, res) =>{

        const atributo = req.query.atributo;
        const dato = req.query.dato;
        const condicion = req.query.condicion;
    
        try {
            const filtrar = await dataBase.filtrarPorDato({ atributo, dato, condicion });
            res.json(filtrar);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
    



    app.listen(port, () => {
        console.log(`Servidor en ejecución en http://localhost:${port}`);
    });


}

