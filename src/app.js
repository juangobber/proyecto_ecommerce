//Express config
const express = require ('express')
const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

//Import FS
const productManagment = require('./dao/ProductManager')
const products = new productManagment('./src/files/listadoProductos.json')

//Handlebars config
const handlebars = require('express-handlebars')
    
    //Initialize handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Routes config
//  import routes
const appRoutes = require('./routers/app.routes')
//  Initialize routes
app.use('/api',appRoutes)

//Run the server
const httpServer = app.listen(PORT, ()=>{
    console.log("Server is up and running on port", PORT)
})

//Websockets config
const {Server} = require('socket.io')
const socketServer = new Server(httpServer)

//Mongoose config
const mongoose = require('mongoose')
//  Import model
const ProductManagment = require('./dao/mongoProductManager')
const productosDb = new ProductManagment()

//Connect to Atlas DB
const database = 'ecommerce'
mongoose.set('strictQuery', true)
mongoose.connect( `mongodb+srv://juangobb:19972003@cluster0.qv2r5u5.mongodb.net/${database}?retryWrites=true&w=majority` , (error)=>{
    if(error){
        console.log("cannot connect to database: " + error)
        process.exit()
    }
})

//  Listen to events

app.use('/realtimeproducts', async (req, res) =>{
    await res.render('realtimeproducts')
    const productList = await products.getProducts()

        socketServer.on('connection', (socket)=>{
        console.log("Nuevo cliente conectado")
        console.log(socket.id)
        
        socket.emit('firstConection', productList)

        socket.on('message1', async (data)=>{
            await products.addProduct(data)
            
            const updatedProductList = await products.getProducts()
            //console.log(updatedProductList)
            socket.emit('updatedList',updatedProductList)
        })

        socket.on('deleteProduct', async (data)=>{
            console.log("Este nro llega al server", data)
            await products.deleteProduct(+data)
            const updatedProductList = await products.getProducts()
            socket.emit('updatedList',updatedProductList)

        })
    }) 
})

