const fs = require('fs/promises')

class CartManager{
    constructor(path){
        this.path = path
        this.fileExist()
    }

    async fileExist(){
        try {await fs.readFile(this.path)}
        catch{
         console.log(`Se creó un nuevo archivo de cart con la ruta "${this.path}"`)
         await fs.writeFile(this.path, JSON.stringify([]))
        } 
     }

    async createCart(){
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);
        const dataLength = data.length + 1

        const newCart = {
            id: dataLength,
            products: []
            }
            data.push(newCart)

        await fs.writeFile(this.path, JSON.stringify(data))
        return "Se creó un nuevo carrito"
    }

    async getProductsByCartId(cartId){
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);

        const cartExists =  data.find(cart => cart.id === cartId) ?? false

        if (cartExists === false) {
            console.log("Not Found")
            return "El carrito no existe"
        }

        const cartIndex = data.findIndex((cart) => cart.id === cartId)
        return data[cartIndex].products
    }

    async addProductToCartById(productId, cartId){
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);
       
        const cartExists =  data.find(cart => cart.id === cartId) ?? false

        if (cartExists === false) {
            console.log("Not Found")
            return "El carrito no existe"
        }

        const cartIndex = data.findIndex((cart) => cart.id === cartId)
        console.log(cartIndex)
        const productExists =  data[cartIndex].products.find((product) => product.product === productId)?? false       

        if (productExists === false) {
            data[cartIndex].products.push({product: productId, quantity: 1})
            await fs.writeFile(this.path, JSON.stringify(data))
            return data[cartIndex]
        }

        const productIndex = data[cartIndex].products.findIndex((product) => product.product === productId)
        data[cartIndex].products[productIndex].quantity++ 
        await fs.writeFile(this.path, JSON.stringify(data))
        return `Se ha añadido 1 producto id ${productId} al carrito ${cartId}`
    }
}



module.exports = CartManager 