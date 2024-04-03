import { MongoClient, ObjectId } from "mongodb";

export class DataBase {
    constructor(url, dbName) {
        this.url = url;
        this.dbName = dbName;
    }

    async connect() {
        try {
            const client = await MongoClient.connect(this.url);
            console.log('Conexión exitosa a MongoDB');
            return client.db(this.dbName);
        } catch (err) {
            throw new Error('No se ha establecido la conexión a la base de datos');
        }
    }

    async getAll(collectionName) {
        const db = await this.connect();
        return db.collection(collectionName).find().toArray();
    }

    async getById(id,collectionName) {
        try {
            const db = await this.connect();
            const collection = db.collection(collectionName);
            const result = await collection.findOne({ _id: new ObjectId(id) });
            return result;
        } catch (err) {
            console.error('Error al obtener el paciente por ID:', err);
            throw err;
        }
    }
    async getByAttribute(attribute, data,collectionName) {
        try {
            // Validar los parámetros
            if (!attribute || !data) {
                throw new Error('Se requieren un atributo y datos válidos');
            }

            const db = await this.connect();
            const collection = db.collection(collectionName);
            const result = await collection.find({
                [attribute]: Number(data)
                    ? Number(data)
                    : data.charAt(0).toUpperCase() + data.slice(1)
            }).toArray();
            console.log({
                [attribute]: Number(data)
                    ? Number(data)
                    : data.charAt(0).toUpperCase() + data.slice(1)
            })
            return result;
        } catch (err) {
            console.error('Error al obtener pacientes por atributo:', err);
            throw err;
        }
    }
}
