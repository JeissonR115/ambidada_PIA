import { MongoClient, ObjectId } from "mongodb";

export class DataBase {
    constructor(url, dbName, collections) {
        this.url = url;
        this.dbName = dbName;
        this.collectionList = collections;
        this.collectionName = '';
    }
    use(collectionName) {
        if (!Object.keys(this.collectionList).includes(collectionName)) throw new Error('La colección no está en la lista.');
        this.collectionName = collectionName
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
    async connectCollection() {
        const db = await this.connectDB();
        return db.collection(this.collectionName);
    }
    async getAll() {
        const collection = await this.connectCollection()
        return collection.find().toArray();
    }
    async getById(id) {
        const collection = await this.connectCollection()
        return collection.findOne({ _id: new ObjectId(id) });
    }
    async getByAttribute(attribute, data) {
        // Validar los parámetros
        if (!attribute || !data) throw new Error('Se requieren un atributo y datos válidos');

        const collection = await this.connectCollection()
        return await collection.find({
            [attribute]: Number(data)
                ? Number(data)
                : data.toLowerCase(l)
        }).toArray();
    }
    async getByDate(start, end, one = false) {

        const collection = await this.connectCollection()
        // Construye el filtro
        const filter = one ? { fecha: { "$regex": start } } : { fecha: { "$gte": start } };
        if (end) filter.fecha.$lte = end;

        return await collection.find(filter).toArray();

    }
}
