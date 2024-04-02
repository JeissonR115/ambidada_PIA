import express from "express";
import { MongoClient } from "mongodb";
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
const connect = async (url, dbName) => {
    try {
        const client = await MongoClient.connect(url);
        console.log('Conexión exitosa a MongoDB');
        return client.db(dbName);
    } catch (err) {
        throw Error(`No se ha establecido la conexión a la base de datos ${PORT}`);
    }
}
connect(URL,dbName);

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
