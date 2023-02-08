const {Router} = require('express');

const router = Router();

//Persistencia de archivos con FS
const cartManagment = require('../../dao/CartManager')
const carrito = new cartManagment('./src/files/carrito.json')

const productManagment = require('../../dao/ProductManager')
const productos = new productManagment('./src/files/listadoProductos.json')

//Persistencia de archivos con Mongoose
const ProductManagmentDB = require('../../dao/mongoProductManager')
const productosDb = new ProductManagmentDB()

const CartManagmentDB = require('../../dao/mongoCartManager')
const carritoDb = new CartManagmentDB()

//Routes
router.post('/', async (req, res)=>{
    res.send(await carritoDb.createCart())
});

router.get('/:cid', async (req, res)=> {
    const data = await carritoDb.getProductsByCartId(req.params.cid)
    cartData = data.cart.products
    console.log(cartData)
    res.render('cart', {cartData})
    
});

router.post('/:cid/product/:pid', async (req,res)=>{
    const requestedProduct = await productosDb.getProductById(req.params.pid)
    if (requestedProduct){
        console.log("El producto existe")
        res.json(await carritoDb.addProductToCartById(req.params.pid, req.params.cid))
    }
    else {
        res.send("El producto no existe")
    }  
})

router.delete('/:cid/product/:pid', async (req,res)=>{
    const requestedProduct = await productosDb.getProductById(req.params.pid)
    const requestedCart = await carritoDb.getProductsByCartId(req.params.cid)
    if (requestedProduct && requestedCart){
        console.log("El producto existe y el carrito existe")
        res.json(await carritoDb.deleteProductInCart(req.params.pid, req.params.cid))
    }
    else {
        res.send("El producto no existe")
    }
})

router.put('/:cid/product/:pid', async (req,res)=>{
    const requestedProduct = await productosDb.getProductById(req.params.pid)
    if (requestedProduct){
        console.log("El producto existe")
        res.json(await carritoDb.updateQuantity(req.body, req.params.cid, req.params.pid))
    }
    else {
        res.send("El producto no existe")
    }  
})

router.delete('/:cid', async (req,res)=>{
    const requestedCart = await carritoDb.getProductsByCartId(req.params.cid)
    if (requestedCart){
        console.log("el carrito existe")
        res.json(await carritoDb.deleteAllProducts(req.params.cid))
    }
    else {
        res.send("El carrito no existe")
    }
})

module.exports = router;