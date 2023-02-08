const {cartModel} = require("./models/carts.model");

class MongoCartManager{
    constructor(){

    }

    async createCart(){
        try{
            const createdCart= await cartModel.create({})
            console.log(createdCart)
            return ({
                    state: "successful",
                    message:`A new cart has been created with this ID: ${createdCart._id}`,
                    cart: createdCart
                })
        }catch(error){
            return({
            state: "error",
            message: `There's been an error: ${error}`
        })
        }  
    }

   async getProductsByCartId(cartId){
    try{
        const foundCart = await cartModel.findById(cartId).populate('products.productId').lean()
        return({
            state: "successful",
            message:`We've found a cart`,
            cart: foundCart
        })
    }catch(error){
        return({
            state: "Error",
             message:`The cart doesn't exist or an error occurred: ${error}`,
        }) 
    }
   }

   async addProductToCartById(productId, cartId){
    try {
        const foundCart = await cartModel.findById(cartId).lean()
        const productExists = foundCart.products.find((product) => product.productId.equals(productId)) ?? false
        if(productExists) {
            const IndexProduct = foundCart.products.findIndex((product) => product.productId.equals(productId))
            foundCart.products[IndexProduct].quantity++
            await cartModel.findByIdAndUpdate(cartId, foundCart).lean()
            const result = await cartModel.findById(cartId).populate('products.productId').lean()
            return ({
                state: "successful",
                message:`You've added a product to the cart`,
                cart: result
            })
        } else {
            foundCart.products.push({productId: productId, quantity: 1})
            await cartModel.findByIdAndUpdate(cartId, foundCart)
            const result = await cartModel.findById(cartId).populate('products.productId').lean()
            return ({
                state: "successful",
                message:`You've added a product to the cart`,
                cart: result
            })
        }
    } catch (error) {
        return({
            state: "Error",
             message:`An error occurred: ${error.message}`,
        })
    }
    
   }

   async deleteProductInCart(productId, cartId){
    try {
        const foundCart = await cartModel.findById(cartId).lean()
        const productExists = foundCart.products.find((product) => product.productId.equals(productId)) ?? false
        if(productExists) {
            const IndexProduct = foundCart.products.findIndex((product) => product.productId.equals(productId))
            foundCart.products.splice(IndexProduct, 1)
            console.log("Carrito con elemento eliminado", foundCart)
            await cartModel.findByIdAndUpdate(cartId, foundCart).lean()
            const result = await cartModel.findById(cartId).populate('products.productId').lean()
            return ({
                state: "successful",
                message:`You've deleted a product to the cart`,
                cart: result
            })
        } else {
            const result = await cartModel.findById(cartId).populate('products.productId').lean()
            return ({
                state: "Error",
                message:`The product you are trying to delete doesn't exist in the cart`,
                cart: result
            })
        }
    } catch (error) {
        return({
            state: "Error",
             message:`An error occurred: ${error.message}`,
        })
    }
   }

   async updateQuantity(quantity, cartId, productId){
    const newQuantity = quantity.quantity
    try {
        const foundCart = await cartModel.findById(cartId).lean()
        
        const productExists = foundCart.products.find((product) => product.productId.equals(productId)) ?? false
        if(productExists) {
            const IndexProduct = foundCart.products.findIndex((product) => product.productId.equals(productId))
            foundCart.products[IndexProduct].quantity = newQuantity

            await cartModel.findByIdAndUpdate(cartId, foundCart).lean()
            const result = await cartModel.findById(cartId).populate('products.productId').lean()
            return ({
                state: "successful",
                message:`You've set a new quantity to a product in the cart`,
                cart: result
            })
        } else {
            const result = await cartModel.findById(cartId).populate('products.productId').lean()
            return ({
                state: "Error",
                message:`The product you are trying to modify doesn't exist in the cart`,
                cart: result
            })
        }
    } catch (error) {
        return({
            state: "Error",
             message:`An error occurred: ${error.message}`,
        })
    }
   }

   async deleteAllProducts(cartId){
    try {
        const foundCart = await cartModel.findById(cartId).lean()
        if(foundCart) {
            foundCart.products = []
            await cartModel.findByIdAndUpdate(cartId, foundCart).lean()
            const result = await cartModel.findById(cartId).populate('products.productId').lean()
            return ({
                state: "successful",
                message:`The cart is empty`,
                cart: result
            })
        } else {
            return ({
                state: "Error",
                message:`The cart doesn't exist`,
                cart: result
            })
        }
    } catch (error) {
        return({
            state: "Error",
             message:`An error occurred: ${error.message}`,
        })
    }
   }
}

module.exports = MongoCartManager