const {Router} = require('express');

const router = Router();

//Persistencia de archivos con FS
const productManagment = require('../../dao/ProductManager')
const productos = new productManagment('./src/files/listadoProductos.json')

//Persistencia de archivos con Mongoose
const ProductManagmentDB = require('../../dao/mongoProductManager')
const productosDb = new ProductManagmentDB()

router.get('/', async (req, res) => {
    
    try{
        const respuesta = await productosDb.getProducts(req.query)
        const data = {
            status: 'success',
            payload: respuesta.docs,
            totalPages: respuesta.totalPages,
            prevPage: respuesta.prevPage,
            nextPage: respuesta.nextPage,
            page: respuesta.page,
            hasPrevPage:respuesta.hasPrevPage,
            hasNextPage: respuesta.hasNextPage,
            prevLink: (respuesta.hasPrevPage ? "localhost:8080/products?page=$" + respuesta.prevPage : null),
            nexLink: (respuesta.hasNextPage ? "localhost:8080/products?page="+respuesta.nextPage : null)}
        
           // res.send(data)
            const renderData = data.payload
            res.render('products', {renderData}) 

    }
    catch(error){
        console.log(error)
    } 
})

router.get('/:pid', async (req, res)=> {
    try {
    const requestedProduct = await productosDb.getProductById(req.params.pid)
    if (requestedProduct){
        res.json({
            state: "successful",
            message:`We've found a product with that id`,
            product: requestedProduct
        })
    } else {
        res.json({
            state: "error",
            message:`We haven't found a product with that id`,
        })
    }
            
    }
    catch(error) {
    res.json({
        state: "Error",
        message:`We haven't found a product with that id or an error occured`,
        Error: error.message
    })
    }
})

router.post('/', async (req, res)=> {
    const newProduct = await req.body;
    res.json(await productosDb.addProduct(newProduct))
})

router.put('/:pid', async (req, res)=> {
    const updateProduct = await req.body
    res.send(await productosDb.updateProduct(req.params.pid, updateProduct))
})

router.delete('/:pid', async(req, res) => {
    res.send( await productosDb.deleteProduct(req.params.pid))
})


module.exports = router;