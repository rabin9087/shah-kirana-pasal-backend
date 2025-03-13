import productSchema from "../product/product.schema"

export const getSearchResults = (searchTerm: string) => {
    return productSchema.find({
        $or: [
            { name: { $regex: searchTerm, $options: "i" } }, // 'i' for case-insensitivity
            { alternateName: { $regex: searchTerm, $options: "i" } }
        ]
    });
};
