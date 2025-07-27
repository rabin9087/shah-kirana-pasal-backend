import express from 'express'
import userRouter from '../router/user.router'
import categoryRouter from '../router/category.router'
import productRouter from '../router/product.router'
import paymentRouter from '../router/payment.router'
import orderRouter from '../router/order.router'
import searchRouter from '../router/search.router'
import salesRouter from '../router/sales.router'
import storeSale from '../router/storeSale.router'
import shop from '../router/shop.router'
import due from '../router/due.router'
import jobs from '../router/jobs.router'
import jobCategory from './jobCategories.router'
import productComboOffer from './productCombo.router'

const router = express.Router()

router.use("/user", userRouter)
router.use("/category", categoryRouter)
router.use("/product", productRouter)
router.use("/order", orderRouter)
router.use("/payment", paymentRouter)
router.use("/search", searchRouter)
router.use("/sales", salesRouter)
router.use("/storeSales", storeSale)
router.use("/due", due)
router.use("/jobs", jobs)
router.use("/jobCategory", jobCategory)
router.use("/productComboOffer", productComboOffer)
router.use("/shop", shop)

export default router