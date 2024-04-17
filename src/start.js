import { DataBase } from "./DataBase.js";

import cors from "cors"; //para permitir solicitudes entre dominios
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Login from "./login.js";

// Definir la función 'start' que inicia el servidor
export const start = ({ url, dbName, collectionList, collectionName, port }) => {

    const app = express(); // Crear una instancia de la aplicación Express
    app.use(cors());// Habilitar el manejo de CORS como middleware

    const dataBase = new DataBase(url, dbName, collectionList);
    dataBase.use(collectionName);// Establecer la colección a utilizar en la base de datos
    const defaultUrl = `/${collectionList[collectionName]}`;// Definir la URL predeterminada para acceder a la colección

    // Endpoint para obtener todos los datos de la colección
    app.get(defaultUrl, async (req, res) => {
        const allData = await dataBase.getAll();
        res.json(allData);
    });

    // Endpoint para obtener datos filtrados por fecha
    app.get(`${defaultUrl}/date`, async (req, res) => {
        try {
            const startDate = req.query.start_date;
            const endDate = req.query.end_date;
            const one = req.query.one_day;

            // Verificar si se proporcionaron las fechas de inicio y fin
            if (!startDate) {
                return res.status(400).json({ error: "Se requieren las fechas de inicio y fin" });
            }

            // Obtener los datos filtrados por fecha desde la base de datos
            const dates = await dataBase.getByDate(startDate, endDate, one);
            res.json(dates);
        } catch (error) {
            // Manejar errores internos del servidor
            console.error('Error al procesar la solicitud:', error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });

    // Endpoint para buscar datos por atributo específico
    app.get(`${defaultUrl}/find/:attribute/:data`, async (req, res, next) => {
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

    // Endpoint para filtrar datos por atributo y valor específicos
    app.get(`${defaultUrl}/find`, async (req, res) => {
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

app.use(bodyParser.json());

app.post(`${defaultUrl}/esp32`, async (req, res) => {
    try {
        const body = req.body; // Obtener los datos enviados por el ESP32

        // Guardar los datos en la base de datos
        const savedData = await dataBase.guardarDatos(body);

        // Responder con éxito
        res.status(200).json({ message: "Datos recibidos y guardados correctamente", data: savedData });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Obtener el nombre de usuario y la contraseña del cuerpo de la solicitud// Establecer la colección de usuarios en la base de datos
    const login = new Login(username,password,dataBase);
    try {
        // Verificar las credenciales utilizando el método verifyCredentials de la clase Login
        const isAuthenticated = await login.verifyCredentials(username, password);
        if (isAuthenticated) {
            // Si las credenciales son válidas, responder con un mensaje de éxito
            res.status(200).json({ message: "Inicio de sesión exitoso" });
        } else {
            // Si las credenciales no son válidas, responder con un mensaje de error
            res.status(401).json({ error: "Credenciales inválidas" });
        }
    } catch (error) {
        // Manejar errores internos del servidor
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

    // Iniciar el servidor y escuchar en el puerto especificado
    app.listen(port, () => {
        console.log(`Servidor en ejecución en http://localhost:${port}`);
    });
}
