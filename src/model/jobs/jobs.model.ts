import JobsSchema, { IJobs } from "./jobs.schema"

export const createJob = (data: IJobs) => {
    return new JobsSchema(data).save()
}

export const getAllJobs = () => {
    return JobsSchema.find()
}

export const updateAJob = (_id: string) => {
    return JobsSchema.findOneAndUpdate({_id})
}
