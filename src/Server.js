import { DataBase } from "./DataBase.js";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import useragent from 'useragent';
import Login from "./Login.js";
import TextFileEditor from "./TextFileEditor.js";

export class Server {
    constructor({ url, dbName, collectionList, collectionName, port }) {
        this.url = url;
        this.dbName = dbName;
        this.collectionList = collectionList;
        this.collectionName = collectionName;
        this.port = port;
        this.file = new TextFileEditor('./user_browser_information.txt')
    }

    async start() {
        this.app = express();
        this.app.use(cors());
        this.app.use(async (req, res, next) => {
            try {
                console.log('URL solicitada:', `http://localhost:${this.port}${req.url}`);
        
                const userAgent = req.headers['user-agent'];
                const agent = useragent.parse(userAgent);
        
                const deviceInfo = {
                    browser: agent.toAgent(),
                    os: agent.os.toString(),
                    device: agent.device.toString(),
                };
        
                await this.file.append(`---\nURL solicitada:http://localhost:${this.port}${req.url}\nBrowser: ${deviceInfo.browser}\nOS: ${deviceInfo.os}\nDevice: ${deviceInfo.device}\n`);
                console.log('Dispositivo detectado:', agent);
        
                next();
            } catch (err) {
                console.error('Error al agregar información del dispositivo:', err);
                next(err); // Pasa el error al siguiente middleware o controlador de errores
            }
        });
        
        this.app.use(bodyParser.json());

        const dataBase = new DataBase(this.url, this.dbName, this.collectionList);
        await dataBase.connectDB();
        dataBase.use(this.collectionName);
        const defaultUrl = `/${this.collectionList[this.collectionName]}`;

        this.app.get(defaultUrl, async (req, res) => {
            try {
                const { filter, limit } = req.query; // Obtener los parámetros de filtro y límite de la solicitud
                const allData = await dataBase.getAll(parseInt(limit), filter); // Llamar a getAll con el límite y filtro proporcionados
                console.log(allData);
                res.json(allData); // Enviar los datos como respuesta JSON
            } catch (error) {
                console.error('Error al obtener todos los datos:', error);
                res.status(500).json({ error: "Error interno del servidor" }); // Manejar errores internos del servidor
            }
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
        this.app.get(`${defaultUrl}/top_bottom`, async (req, res) => {
            try {
                const topBottomData = {};
        
                const attributes = ['temperature', 'ambient'];
        
                for (const attribute of attributes) {
                    // Verifica si se ha especificado el parámetro de atributo en la URL
                    if (req.query[attribute]) {
                        const topData = await dataBase.getTopBottomData(attribute, 10, true);
                        const bottomData = await dataBase.getTopBottomData(attribute, 10, false);
                        topBottomData[attribute] = { top: topData, bottom: bottomData };
                    }
                }
                res.json(topBottomData);
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });

        try {
            this.app.listen(this.port, () => {
                console.log(`Servidor en ejecución en http://localhost:${this.port}`);
            });
            return true;
        } catch {
            return false;
        }
    }
}
