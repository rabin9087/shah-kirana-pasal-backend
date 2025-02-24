import express from 'express'
import userRouter from '../router/user.router'
import categoryRouter from '../router/category.router'
import productRouter from '../router/product.router'
import paymentRouter from '../router/payment.router'
import orderRouter from '../router/order.router'
import searchRouter from '../router/search.router'
import salesRouter from '../router/sales.router'
const router = express.Router()

router.use("/user", userRouter)
router.use("/category", categoryRouter)
router.use("/product", productRouter)
router.use("/order", orderRouter)
router.use("/payment", paymentRouter)
router.use("/search", searchRouter)
router.use("/sales", salesRouter)





export default router