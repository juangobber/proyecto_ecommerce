const mongoose = require ('mongoose')

const productsCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {type: String, required: true} ,
    description: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    code: {type: String, required: true},
    stock: {type: Number, required: true},
    status: {type: Boolean, required: true}
    //,_id: {type: String}
    })

    const productsModel = mongoose.model(productsCollection, productSchema)

    module.exports = {
        productsModel
    }