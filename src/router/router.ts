import express from 'express'
import userRouter from '../router/user.router'
import categoryRouter from '../router/category.router'
import productRouter from '../router/product.router'
const router = express.Router()

router.use("/user", userRouter)
router.use("/category", categoryRouter)
router.use("/product", productRouter)




export default router