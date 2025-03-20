import { NextFunction, Request, Response } from "express";
import { getSearchResults } from "../model/search/search.model";
import { getAllProductListByCategory } from "./product.controller";

export const searchNewItem = async (
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
    const products = await getSearchResults(searchTerm as string);
  
    // Return results
    products?.length
         ? res.json({
            status: "success",
            message: "Here are all searched products",
            result: products.map(({_id, name, alternateName, parentCategoryID, qrCodeNumber}) => ({name, _id, alternateName, parentCategoryID, qrCodeNumber}))
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