// import { NextFunction, Request, Response } from "express";

// export const createContactManagement = async (req, res) => {
//   try {
//     const { jobId, contractRate, advance, paymentMethod, paymentDate } = req.body;
//     const remainingAmount = contractRate - advance;

//     const payment = await JobPayment.create({
//       jobId,
//       contractRate,
//       advance,
//       paymentMethod,
//       paymentDate,
//       remainingAmount,
//     });

//     res.status(201).json(payment);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to save job payment", error });
//   }
// }