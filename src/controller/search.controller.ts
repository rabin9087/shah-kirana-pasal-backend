import { NextFunction, Request, Response } from "express";
import { getSearchProductResults, getSearchUserResults } from "../model/search/search.model";
import { getAllProductListByCategory } from "./product.controller";
import userSchema from "../model/user/user.schema";

export const searchProductItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
 try {
     // Extract searchTerm from query parameters
    
    const { searchTerm } = req.query;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }


    // Perform a case-insensitive search in the 'name' field
    const products = await getSearchProductResults(searchTerm as string);
  
    // Return results
    products?.length
         ? res.json({
            status: "success",
            message: "Here are all searched products",
           result: products.map(({ _id, name, alternateName, parentCategoryID, qrCodeNumber }) =>
             ({ name, _id, alternateName, parentCategoryID, qrCodeNumber }))
          })
        : res.json({
            status: "success",
            message: "Product not found.",
            result: []
        })
     
  } catch (error) {
    next()
 }
};

export const searchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
 try {
     // Extract searchTerm from query parameters
    
    const { searchTerm } = req.query;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Perform a case-insensitive search in the 'name' field
    const users = await getSearchUserResults(searchTerm as string);
  
    // Return results
    users?.length
         ? res.json({
            status: "success",
            message: "Here are all searched products",
            result: users.map(({_id, fName, lName, email, phone}) => ({ _id, fName, lName, email, phone}))
          })
        : res.json({
            status: "success",
            message: "Product not found.",
            result: []
        })
     
  } catch (error) {
    next()
 }
  };