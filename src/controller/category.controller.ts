import { NextFunction, Request, Response } from "express";
import { createCategory, deleteACategoryByID, getACategoryByID, getACategoryBySlug, getAllCategories, updateCategoryByID } from "../model/category/category.model";
import slugify from "slugify";


export const createNewCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
      req.body.slug = slugify(req.body.name, {
      replacement: '-', 
        lower: true,
      trim: true
    })
        const { slug } = req.body          
      const slugValue =await getACategoryBySlug(slug)
      if(slugValue?._id)  {
        return res.json({
        status: "error",
        message: "Category already exist!",
      })} else  {
        const category = await createCategory(req.body)
        category?._id
        ? res.json({
            status: "success",
            message: "New Category has been created successfully!",
          })
        : res.json({
            status: "error",
            message: "Error creating new category.",
          });}


    } catch (error) {
      next(error);
    }
  };


  export const getCategoriesList = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const categoryList = await getAllCategories()
        categoryList?.length
        ? res.json({
            status: "success",
            message: "List of all categories",
            categoryList
          })
        : res.json({
            status: "error",
            message: "Error fetching category lists.",
          });
    } catch (error) {
       
    }
  }


  export const getACategory = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const {_id} = req.params
        const category = await getACategoryByID(_id)
        category?._id
        ? res.json({
            status: "success",
            message: "Here is a category",
            category
          })
        : res.json({
            status: "error",
            message: "Error fetching a category.",
          });
    } catch (error) {
       
    }
  }


  export const deleteACategory = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {


        const {_id} = req.params
        const deleteAcategory = await deleteACategoryByID(_id)
        deleteAcategory?._id
        ? res.json({
            status: "success",
            message: "Catery has been deleted successfully",
          })
        : res.json({
            status: "error",
            message: "Error deleting a category.",
          });
    } catch (error) {
       
    }
  }


  export const updateACategory = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const {_id, ...categoryObj} = req.body
        console.log(req.body)
        const category = await updateCategoryByID(_id, categoryObj)
        category?._id
        ? res.json({
            status: "success",
          message: "Catery has been updated successfully",
            category
          })
        : res.json({
            status: "error",
          message: "Error updating a category.",
          category
          });
    } catch (error) {
       
    }
  }

