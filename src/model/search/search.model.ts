import productSchema from "../product/product.schema"

export const getSearchResults = (searchTerm: string) => {
    return productSchema.find({
      name: { $regex: searchTerm, $options: "i" }, // 'i' for case-insensitivity
    })
}
