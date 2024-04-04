import express from "express";
import { MongoClient, ObjectId } from "mongodb";
const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.DB_URL || '****';
const dbName = process.env.DB_NAME || 'ambidata';
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
        throw Error('No se ha establecido la conexión a la base de datos');
    }
}
connect(URL,dbName);

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
