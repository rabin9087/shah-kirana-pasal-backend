import JobCategorySchema, { IJobCategory } from "./jobCategory.schema"

export const createJobCategory = (data: IJobCategory) => {
    return new JobCategorySchema(data).save()
}

export const getAllJobsCategory = () => {
    return JobCategorySchema.find()
}