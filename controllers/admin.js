// const { findById } = require('../models/product');
const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false,
    errorMessage: null,
    hasError:false,
    validationErrors: []
    });
};



exports.postAddProduct = (req, res, next) => {
  // console.log(req.file);
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }


  // console.log(imageUrl);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;
  const product = new Product({
    // _id: new mongoose.Types.ObjectId('620d50ac7c8d26a9171fc958'),
    title : title,
    price: price,
    description : description,
    imageUrl:imageUrl,
    userId:req.user//mongoose will pickup the user id from the entire user object
  });
  product
  .save() // save() method is defined by mongoose
  .then(result => {
    console.log('product Created');
    res.redirect('/admin/products')
  }).catch( err => {
    // return res.status(500).render('admin/edit-product', {
    //   pageTitle: 'Add Product',
    //   path: '/admin/add-product',
    //   editing: false,
    //   hasError: true,
    //   product: {
    //     title: title,
    //     imageUrl: imageUrl,
    //     price: price,
    //     description: description
    //   },
    //   errorMessage: "Database operation failed, Please try again later.",
    //   validationErrors: []
    // });
    res.redirect('/500');
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
  
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if(!editMode){
    return res.redirect('/');
  }
    const prodId = req.params.productId;
    // console.log(prodId);
    Product
    .findById(prodId)
    .then( product => {
      // throw new Error('dumo');
    if(!product){
    return res.redirect('/');
    }

    res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product:product,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });      
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  

};

exports.postEditProduct = (req,res,next)=> {
  
  const prodId = req.body.productId;
  const updatedTitle= req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }


  Product.findById(prodId)
  .then( product => {
    if(product.userId.toString()!==req.user._id.toString()){
      return res.redirect('/');
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    if (image) {
      fileHelper.deleteFile(product.imageUrl);
      product.imageUrl = image.path;
    }
    return product.save()   ;
  })
  .then(result => {
    console.log("product Updated");
    res.redirect('/admin/products');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

};

exports.deleteProduct = (req,res,next)=>{
  const prodId = req.params.productId;
  Product.findById(prodId).then( product => {
    if(!product){
      return next(new Error('Product not Found😔'));
    }
     fileHelper.deleteFile(product.imageUrl); 
     return Product.deleteOne({_id:prodId,userId:req.user._id});
  })
  .then(() =>{
    console.log("successfully destroyed");
    res.status(200).json({message: "Success"});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: "Product deletion Failled"});
  });
  
};
exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
  // .select('title price -_id')
  // .populate('userId')
  .then(products => {
    // console.log(products)
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};