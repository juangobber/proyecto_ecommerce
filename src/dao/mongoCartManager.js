const {cartModel} = require("./models/carts.model");

class MongoCartManager{
    constructor(){

    }

    async createCart(){
        try{
            const createdCart= await cartModel.create({products:[{_id: "", quantity: ""}]})
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
        const foundCart = await cartModel.findById(cartId).lean()
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
        const foundCart = await this.getProductsByCartId(cartId)
        const modifyCart = {...foundCart.cart}
        const productExists = modifyCart.products.find((product) => product.productId === productId) ?? false
        if(productExists){
            const IndexProduct = modifyCart.products.findIndex((product) => product.productId === productId)
            modifyCart.products[IndexProduct].quantity++
            const result =  await cartModel.findByIdAndUpdate(cartId, modifyCart).lean()
            return ({
                state: "successful",
                message:`You've added a product to the cart`,
                cart: result
            })
        } else {
            modifyCart.products.push({productId: productId, quantity: 1})
            const result =  await cartModel.findByIdAndUpdate(cartId, modifyCart).lean()
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
    
    
    //await cartModel.findByIdAndUpdate(cartId, foundCart)
   }

}

module.exports = MongoCartManager