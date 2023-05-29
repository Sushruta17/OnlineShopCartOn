const MongoDB = require('mongodb');
const mongoClient = MongoDB.MongoClient;
let _db;
const mongoConnect =  (callback) => {
 mongoClient.connect('mongodb+srv://sushruta:12345@cluster0.rqmnc.mongodb.net/shop?retryWrites=true&w=majority')
.then(client =>{
    console.log('Connected');
    _db = client.db();
    callback();
})
.catch( err => {
    console.log(err);
    throw err;
})   
};
const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database was found';
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
