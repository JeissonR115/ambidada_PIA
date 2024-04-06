import { MongoClient, ObjectId } from "mongodb";

export class DataBase {
    constructor(url, dbName, collections) {
        this.url = url;
        this.dbName = dbName;
        this.collectionList = collections;
        this.collection = null; // Variable para almacenar la conexión a la colección
    }

    async connectDB() {
        try {
            const client = await MongoClient.connect(this.url);
            console.log('Conexión exitosa a MongoDB');
            return client.db(this.dbName);
        } catch (err) {
            throw new Error('No se ha establecido la conexión a la base de datos');
        }
    }

    // Método para establecer la colección a utilizar
    async use(collectionName) {
        if (!Object.keys(this.collectionList).includes(collectionName)) throw new Error('La colección no está en la lista.');
        this.collection = await this.connectCollection(collectionName);
    }

    // Método para conectar a la colección especificada
    async connectCollection(collectionName) {
        const db = await this.connectDB();
        return db.collection(collectionName);
    }

    // Método asíncrono para obtener todos los documentos de la colección
    async getAll() {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        return this.collection.find().toArray();
    }

    // Método asíncrono para obtener un documento por su ID
    async getById(id) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        return this.collection.findOne({ _id: new ObjectId(id) });
    }

    // Método asíncrono para obtener documentos por un atributo específico
    async getByAttribute(attribute, data) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        if (!attribute || !data) throw new Error('Se requieren un atributo y datos válidos');
        
        return await this.collection.find({
            [attribute]: Number(data) ? Number(data) : data
        }).toArray();
    }

    // Método asíncrono para obtener documentos dentro de un rango de fechas
    async getByDate(start, end, one = false) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        
        const filter = one ? { fecha: { "$regex": start } } : { fecha: { "$gte": start } };
        if (end) filter.fecha.$lte = end;

        return await this.collection.find(filter).toArray();
    }

    // Método asíncrono para filtrar documentos por un dato específico bajo una condición
    async filtrarPorDato({ atributo, dato, condicion }) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        if (!atributo || !dato || !condicion) throw new Error('Se requieren un atributo, dato y condición válidos');
    
        const filter = {};
    
        switch (condicion) {
            case 'mayor':
                filter[atributo] = { $gt: parseInt(dato) };
                break;
            case 'menor':
                filter[atributo] = { $lt: parseInt(dato) };
                break;
            case 'igual':
                filter[atributo] = parseInt(dato);
                break;
            default:
                throw new Error('Condición no válida');
        }
    
        return await this.collection.find(filter).toArray();
    }
}
