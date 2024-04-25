import { start } from "./src/start.js";
import dotenv from "dotenv";// 'dotenv' es para cargar las variables de entorno
import bcrypt from "bcrypt";
dotenv.config();// Cargar las variables de entorno desde el archivo '.env'


const PORT = process.env.PORT || 3000;// Definir el puerto en el que se ejecutará el servidor.
const URL = process.env.DB_URL || 'mongodb+srv://***.mongodb.net/';// Definir la URL de la base de datos
const dbName = process.env.DB_NAME || 'db';// Definir el nombre de la base de datos.

// Definir una lista de colecciones dentro de la base de datos.
const collections = {
    sensorData: "sensorData",
    users: "users"
};

// Llamar a la función 'start' pasando un objeto con la configuración necesaria para iniciar el servidor.
// La configuración incluye el puerto, la URL de la base de datos, el nombre de la base de datos y la lista de colecciones.
// En este caso, se utiliza la colección 'sensorData' como la colección principal.
start({
    port: PORT,
    url: URL,
    dbName: dbName,
    collectionList: collections,
    collectionName: collections.sensorData,
});
