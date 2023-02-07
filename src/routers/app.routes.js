const {Router} = require('express');
const productsRoutes = require('./products/products.routes')
const cartRoutes = require('./cart/cart.routes')

const router = Router()

router.use('/products',productsRoutes);
router.use('/cart', cartRoutes)


module.exports = router