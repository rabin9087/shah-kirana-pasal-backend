import JobCategorySchema, { IJobCategory } from "./jobCategory.schema"

export const createJobCategory = (data: IJobCategory) => {
    return new JobCategorySchema(data).save()
}

export const getAllJobsCategory = (_id: string) => {
    return JobCategorySchema.find({user: _id})
}