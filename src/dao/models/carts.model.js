const mongoose = require ('mongoose')

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products:{type: [
        {
        quantity: {type: Number, required: false},
        productId: {type: String, required: true}
        },
    ]}
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = {
cartModel
}