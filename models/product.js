const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productionSchema = new Schema({
  title : {
    type : String,
    required : true
  },
  price : {
    type : Number,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  imageUrl : {
    type : String,
    required : true
  },
  userId: {
    type : Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product',productionSchema);

// const MongoDB = require('mongodb');
// const getDb= require('../util/javascript').getDb;

// class Product {
//   constructor(title, price, description, imageUrl,id,userId)
//   {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new MongoDB.ObjectId(id):null;
//     this.userId = userId;
//   }
//   save(){
//     const db = getDb();
//     let dbOp;
//     if(this._id){
//      dbOp = db.collection('products').updateOne({_id: this._id},{$set:this}); 
//     }else{
//      dbOp = db.collection('products').insertOne(this) ;
//     }
    
//     return dbOp.then( result => {
//       // console.log(result);
//     })
//     .catch( err => {
//       console.log(err);
//     })
//   }

//   static fetchAll (){
//     const db = getDb();
//     return db
//     .collection('products')
//     .find()
//     .toArray()
//     .then( products => {
//       console.log(products);
//       return products;
//     })
//     .catch( err => {
//       console.log(err);
//     });
//   }
//   static findByPk (prodId) {
//     const db = getDb();
//     return db
//     .collection('products')
//     .find({_id: new MongoDB.ObjectId(prodId)})
//     .next()
//     .then( product => {
//       // console.log(product);
//       return product;
//     })
//     .catch( err => {
//       console.log(err);
//     })
//   }
//   static delete(prodId) {
//     const db = getDb();
    
//     return db.collection('products')
//     .deleteOne({_id : new MongoDB.ObjectId(prodId)})  
//     .then( result => {
//       console.log('deleted');
//     })
//     .catch ( (err) => {
//       console.log(err);
//     })
    
//   }
// };

// module.exports = Product;