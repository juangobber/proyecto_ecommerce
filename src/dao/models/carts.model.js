const mongoose = require ('mongoose')

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products:{
        type:[{
            quantity: {type: Number, default: 1, required: true,},
            productId: {type: mongoose.Schema.Types.ObjectId, ref:"products"}
        }], 
    default: [], required: true}
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = {
cartModel
}