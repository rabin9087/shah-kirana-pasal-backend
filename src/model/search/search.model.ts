import productSchema from "../product/product.schema"
import userSchema from "../user/user.schema";

export const getSearchProductResults = (searchTerm: string) => {
    return productSchema.find({
        $or: [
            { name: { $regex: searchTerm, $options: "i" } }, // 'i' for case-insensitivity
            { alternateName: { $regex: searchTerm, $options: "i" } },
        ]
    });
};

export const getSearchUserResults = (searchTerm: string) => {
    return userSchema.find({
        $or: [
            { fName: { $regex: searchTerm, $options: "i" } }, // 'i' for case-insensitivity
            { lName: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
            { phone: { $regex: searchTerm, $options: "i" } },
        ]
    });
};
