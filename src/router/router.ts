import express from 'express'
import userRouter from '../router/user.router'
import categoryRouter from '../router/category.router'
import productRouter from '../router/product.router'
import paymentRouter from '../router/payment.router'
const router = express.Router()

router.use("/user", userRouter)
router.use("/category", categoryRouter)
router.use("/product", productRouter)
router.use("/payment", paymentRouter)




export default router