import { start } from "./src/start.js";
import dotenv from "dotenv";// 'dotenv' es para cargar las variables de entorno

class main {
    constructor() {
        this.startServer();
    }
    startServer() {
        dotenv.config();
        const collections = {
            sensorData: "sensorData",
            users: "users"
        };
        start({
            port: process.env.PORT || 3000,// Definir el puerto en el que se ejecutará el servidor.
            url: process.env.DB_URL || 'mongodb+srv://***.mongodb.net/',// Definir la URL de la base de datos
            dbName: process.env.DB_NAME || 'db',// Definir el nombre de la base de datos.
            // Definir una lista de colecciones dentro de la base de datos.
            collectionList: collections,
            collectionName: collections.sensorData,// En este caso, se utiliza la colección 'sensorData' como la colección principal.
        });
    }
}

new main();
