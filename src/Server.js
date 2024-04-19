import { DataBase } from "./DataBase.js";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import Login from "./login.js";

export class Server {
    constructor({ url, dbName, collectionList, collectionName, port }) {
        this.url = url;
        this.dbName = dbName;
        this.collectionList = collectionList;
        this.collectionName = collectionName;
        this.port = port;
    }

    async start() {

        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());

        const dataBase = new DataBase(this.url, this.dbName, this.collectionList);
        await dataBase.connectDB();
        dataBase.use(this.collectionName);
        const defaultUrl = `/${this.collectionList[this.collectionName]}`;

        this.app.get(defaultUrl, async (req, res) => {
            const allData = await dataBase.getAll();
            res.json(allData);
        });

        this.app.get(`${defaultUrl}/date`, async (req, res) => {
            try {
                const startDate = req.query.start_date;
                const endDate = req.query.end_date;
                const one = req.query.one_day;

                if (!startDate) {
                    return res.status(400).json({ error: "Se requieren las fechas de inicio y fin" });
                }

                const dates = await dataBase.getByDate(startDate, endDate, one);
                res.json(dates);
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });

        this.app.get(`${defaultUrl}/find/:attribute/:data`, async (req, res, next) => {
            try {
                const attributeList = {
                    ambient: 'ambient',
                    temperature: 'temperature',
                    place: 'place',
                }
                const attribute = req.params.attribute;
                const data = req.params.data;
                if (!attributeList.hasOwnProperty(attribute)) {
                    return res.status(400).send('Atributo no válido');
                }

                const patientsByAttribute = await dataBase.getByAttribute(attributeList[attribute], data);
                res.json(patientsByAttribute);
            } catch (err) {
                next(err);
            }
        });

        this.app.get(`${defaultUrl}/find`, async (req, res) => {
            const atributo = req.query.atributo;
            const dato = req.query.dato;
            const condicion = req.query.condicion;

            try {
                const filtrar = await dataBase.filtrarPorDato({ atributo, dato, condicion });
                res.json(filtrar);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post(`${defaultUrl}/esp32`, async (req, res) => {
            try {
                const body = req.body;
                const savedData = await dataBase.guardarDatos(body);
                res.status(200).json({ message: "Datos recibidos y guardados correctamente", data: savedData });
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });

        this.app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            const login = new Login(username, password, dataBase);
            try {
                const isAuthenticated = await login.verifyCredentials(username, password);
                if (isAuthenticated) {
                    res.status(200).json({ message: "Inicio de sesión exitoso", isLogin: true });
                } else {
                    res.status(401).json({ error: "Credenciales inválidas", isLogin: false });
                }
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
            dataBase.use(this.collectionName);
        });

        this.app.listen(this.port, () => {
            console.log(`Servidor en ejecución en http://localhost:${this.port}`);
        });
    }
}
