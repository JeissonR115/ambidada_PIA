import { MongoClient, ObjectId } from "mongodb";// Importación de las dependencias necesarias desde el módulo mongodb

export class DataBase {

    constructor(url, dbName, collections) {
        this.url = url;
        this.dbName = dbName;
        this.collectionList = collections;
        this.collectionName = '';
    }

    // Método para establecer la colección a utilizar
    use(collectionName) {
        // Verifica si la colección especificada está presente en la lista de colecciones
        if (!Object.keys(this.collectionList).includes(collectionName)) throw new Error('La colección no está en la lista.');
        // Establece el nombre de la colección
        this.collectionName = collectionName
    }

    // Método asíncrono para conectar a la base de datos
    async connectDB() {
        try {
            const client = await MongoClient.connect(this.url);// Conexión al cliente de MongoDB
            console.log('Conexión exitosa a MongoDB');// Mensaje de conexión exitosa
            return client.db(this.dbName);// Retorna el objeto de la base de datos
        } catch (err) {
            throw new Error('No se ha establecido la conexión a la base de datos');
        }
    }

    // Método asíncrono para conectar a la colección especificada
    async connectCollection() {
        const db = await this.connectDB();// Obtiene el objeto de la base de datos
        return db.collection(this.collectionName);// Retorna la colección especificada
    }

    // Método asíncrono para obtener todos los documentos de la colección
    async getAll() {
        const collection = await this.connectCollection()// Conexión a la colección
        return collection.find().toArray();// Retorna todos los documentos de la colección como un array
    }

    // Método asíncrono para obtener un documento por su ID
    async getById(id) {
        const collection = await this.connectCollection()// Conexión a la colección
        return collection.findOne({ _id: new ObjectId(id) });// Retorna el documento con el ID especificado
    }

    // Método asíncrono para obtener documentos por un atributo específico
    async getByAttribute(attribute, data) {
        // Validación de los parámetros de entrada
        if (!attribute || !data) throw new Error('Se requieren un atributo y datos válidos');
        
        const collection = await this.connectCollection()// Conexión a la colección
        // Retorna los documentos que coinciden con el atributo y los datos especificados
        return await collection.find({
            [attribute]: Number(data)
                ? Number(data)
                : data
        }).toArray();
    }

    // Método asíncrono para obtener documentos dentro de un rango de fechas
    async getByDate(start, end, one = false) {
        const collection = await this.connectCollection()// Conexión a la colección
        
        // Definición del filtro de búsqueda basado en las fechas
        const filter = one ? { fecha: { "$regex": start } } : { fecha: { "$gte": start } };
        if (end) filter.fecha.$lte = end;

        return await collection.find(filter).toArray();// Retorna los documentos que cumplen con el filtro
    }

    // Método asíncrono para filtrar documentos por un dato específico bajo una condición
    async filtrarPorDato({ atributo, dato, condicion }) {
        // Validación de los parámetros de entrada
        if (!atributo || !dato || !condicion) throw new Error('Se requieren un atributo, dato y condición válidos');
    
        const collection = await this.connectCollection();// Conexión a la colección
        const filter = {};// Definición del filtro de búsqueda
    
        // Selección de la condición de filtrado
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
                throw new Error('Condición no válida');// Lanza un error en caso de una condición no válida
        }
    
        return await collection.find(filter).toArray();// Retorna los documentos que cumplen con el filtro
    }
}
