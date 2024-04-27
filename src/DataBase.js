import { MongoClient, ObjectId } from "mongodb";

export class DataBase {
    constructor(url, dbName, collections) {
        this.url = url;
        this.dbName = dbName;
        this.collectionList = collections;
        this.db = null;
        this.collection = null; // Variable para almacenar la conexión a la colección
    }

    async connectDB() {
        try {
            const client = await MongoClient.connect(this.url); 
            console.log('Conexión exitosa a MongoDB');
            this.db = client.db(this.dbName);
            return true;
        } catch (err) {
            throw new Error('No se ha establecido la conexión a la base de datos');
        }
    }

    async use(collectionName) {
        if (!Object.keys(this.collectionList).includes(collectionName)) {
            console.error('La colección no está en la lista.');
            return false;
        }
        this.collection = this.db.collection(collectionName);
        console.log("usando a la colección "+ collectionName);
        return true;
    }

    async getAll(limit = null, filter = null) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
    
        let query = {};
    
        // if (filter === 'mayores') {
        //     query = { $query: {}, $orderby: { _id: -1 } }; // Ordena por ID descendente (mayor a menor)
        // } else if (filter === 'menores') {
        //     query = { $query: {}, $orderby: { _id: 1 } }; // Ordena por ID ascendente (menor a mayor)
        // }
    
        let cursor = this.collection.find({}, query);
    
        if (limit !== null) {
            cursor = cursor.limit(limit);
        }
    
        return cursor.toArray();
    }
    
    
    async getById(id) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        return this.collection.findOne({ _id: new ObjectId(id) });
    }
    
    async getByAttribute(attribute, data, limit = null, filter = null) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        if (!attribute || !data) throw new Error('Se requieren un atributo y datos válidos');
    
        let query = {
            [attribute]: Number(data) ? Number(data) : data
        };
    
        if (filter === 'mayores') {
            query.$orderby = { _id: -1 }; // Ordena por ID descendente (mayor a menor)
        } else if (filter === 'menores') {
            query.$orderby = { _id: 1 }; // Ordena por ID ascendente (menor a mayor)
        }
    
        let cursor = this.collection.find(query);
    
        if (limit) {
            cursor = cursor.limit(limit);
        } else {
            cursor = cursor.limit(10);
        }
    
        return cursor.toArray();
    }
    
    async getByDate(start, end, one = false) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');

        const filter = one ? { fecha: { "$regex": start } } : { fecha: { "$gte": start } };
        if (end) filter.fecha.$lte = end;

        return await this.collection.find(filter).toArray();
    }
    
    async filtrarPorDato({ atributo, dato, condicion }, limit = null, filter = null) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        if (!atributo || !dato || !condicion) throw new Error('Se requieren un atributo, dato y condición válidos');
    
        const filterQuery = {};
    
        switch (condicion) {
            case 'mayor':
                filterQuery[atributo] = { $gt: parseInt(dato) };
                break;
            case 'menor':
                filterQuery[atributo] = { $lt: parseInt(dato) };
                break;
            case 'igual':
                filterQuery[atributo] = parseInt(dato);
                break;
            default:
                throw new Error('Condición no válida');
        }
    
        let cursor = this.collection.find(filterQuery);
    
        if (limit) {
            cursor = cursor.limit(limit);
        } else {
            cursor = cursor.limit(10);
        }
    
        return cursor.toArray();
    }
    
    async guardarDatos(datos) {
        if (!this.collection) throw new Error('No se ha establecido la colección');
    
        try {
            datos.fecha = new Date().toISOString();
            const result = await this.collection.insertOne(datos);
            return result.insertedId;
        } catch (error) {
            console.error('Error al guardar el documento:', error);
            throw error;
        }
    }

    async getTopBottomData(attribute, limit, isTop) {
        if (!this.collection) throw new Error('No se ha establecido la colección.');
        if (!attribute) throw new Error('Se requiere un atributo válido');
    
        const sortOrder = isTop ? { [attribute]: -1 } : { [attribute]: 1 };
    
        const data = await this.collection.find({}, { projection: { _id: 1, [attribute]: 1, ambient: 1, place: 1 } }).sort(sortOrder).limit(limit).toArray();
    
        return data.map(doc => ({
            _id: doc._id,
            [attribute]: doc[attribute],
            ambient: doc.ambient,
            place: doc.place
        }));
    }
    
}

