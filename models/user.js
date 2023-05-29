const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // name: {
    //     type : String,
    //     required : true
    // },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true    
    },
    resetToken: String,
    resetTokenExpiration : Date,
    cart : {
        items :
        [
            {
                productId : { type : Schema.Types.ObjectId, ref: 'Product',required : true},
                quantity : { type : Number, required : true}
            }
        ]
    }
});
userSchema.methods.addToCart = function(product){

        const cartProductIndex = this.cart.items.findIndex(p=> {
            return p.productId.toString()===product._id.toString();
        });
        let newQuant = 1;
        const updatedCartItems = [...this.cart.items];

        if(cartProductIndex>=0){
            newQuant = this.cart.items[cartProductIndex].quantity+1;
            updatedCartItems[cartProductIndex].quantity = newQuant;
        }else{
            updatedCartItems.push({productId:product._id,quantity:newQuant});
        }
        const updatedCart = {
            items:updatedCartItems
        }
        this.cart = updatedCart;
        return this.save();
};
userSchema.methods.removeFromCart = function(prodId){
        const updatedCartItems = this.cart.items.filter( item => {
            return item.productId.toString() !== prodId.toString();
        });
        
        this.cart.items = updatedCartItems;
        return this.save();
        
      
};
userSchema.methods.clearCart = function(){
    this.cart = {
        items:[]
    };
    return this.save();
};
module.exports = mongoose.model('User',userSchema);
// userSchema.methods.add = function(){
//           const db = getDb();
//           return this.getCart().then( products => {
//               const order = {
//                   items:products,
//                   user : {
//                       _id: new MongoDB.ObjectId(this._id),
//                       name:this.name
//                   }
//               };
//               return db.collection('orders').insertOne(order);
//           })
//         .then( result => {
//             this.cart = { items : []};
//             return db.collection('users')
//             .updateOne({_id : new MongoDB.ObjectId(this._id)},
            
//             {$set : {cart : {items : []}}});
            

//         } )
// };

// const MongoDB = require('mongodb');
// const getDb = require('../util/javascript').getDb;
// class User {
//     constructor( username, email, cart, id){
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//          this._id = id;
         
         
//     }
//     save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//         .then()
//         .catch( (err) => {
//             console.log(err);
//         })
//     }

//     addToCart(product){
//         const cartProductIndex = this.cart.items.findIndex(p=> {
//             return p.productId.toString()===product._id.toString();
//         });
//         let newQuant = 1;
//         const updatedCartItems = [...this.cart.items];

//         if(cartProductIndex>=0){
//             newQuant = this.cart.items[cartProductIndex].quantity+1;
//             updatedCartItems[cartProductIndex].quantity = newQuant;
//         }else{
//             updatedCartItems.push({productId:new MongoDB.ObjectId(product._id),quantity:newQuant});
//         }
//         const updatedCart = {
//             items:updatedCartItems
//         }
//         const db = getDb();
//          return db.collection('users').updateOne(
//             {_id:new MongoDB.ObjectId(this._id)},
//             {$set:{cart:updatedCart}}
//         );

//     }
//     getCart(){
//         const db = getDb();
//         const productIds = this.cart.items.map( p => {
//             return p.productId;
//         });
//         return db.collection('products').find({_id:{$in:productIds}})
//         .toArray()
//         .then( products => {
//             console.log(products);
//             return products.map( p => {
//                 return {...p, quantity:this.cart.items.find( i => {
//                     return i.productId.toString() === p._id.toString();
//                 }).quantity};
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

    // deleteProdFromCart(prodId) {
    //     const updatedCartItems = this.cart.items.filter( item => {
    //         return item.productId.toString() !== prodId.toString();
    //     });
    //     const db = getDb();
        
    //     return db.collection('users')
    //     .updateOne({_id : new MongoDB.ObjectId(this._id)},
        
    //     {$set : {cart : {items : updatedCartItems}}});
        
    //   }
//       addOrder()
//       {
//           const db = getDb();
//           return this.getCart().then( products => {
//               const order = {
//                   items:products,
//                   user : {
//                       _id: new MongoDB.ObjectId(this._id),
//                       name:this.name
//                   }
//               };
//               return db.collection('orders').insertOne(order);
//           })
//         .then( result => {
//             this.cart = { items : []};
//             return db.collection('users')
//             .updateOne({_id : new MongoDB.ObjectId(this._id)},
            
//             {$set : {cart : {items : []}}});
            

//         } )
//       }
//       getOrders(){
//           const db = getDb();
//           return db.collection('orders').find({'user._id' : new MongoDB.ObjectId(this._id)})
//           .toArray();
//       }
//     static findByPk(userId){
//         const db = getDb();
//         return db.collection('users').find({_id : new MongoDB.ObjectId(userId)})
//         .next()
//         .then( user => {
//             return user;
//         })
//         .catch( (err) => {
//             console.log(err);
//         })
//     }

// }
// module.exports = User;