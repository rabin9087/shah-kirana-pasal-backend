import JobsSchema, { IJobs } from "./jobs.schema"

export const createJob = (data: IJobs) => {
    return new JobsSchema(data).save()
}

export const getAllJobs = () => {
    return JobsSchema.find()
}

export const updateAJobPayment = (_id: string, newPayment: {
                subject: string, // this will be the value from input like "Site material"
                amount: Number,
                createdAt: Date,
            }) => {
    return JobsSchema.findOneAndUpdate({_id}, {
      $push: {
        newPayment: newPayment,
      },
    },
    { new: true })
}

export const updateAJob = (_id: string, data: object) => {
    return JobsSchema.findOneAndUpdate(
        { _id },
        { $set: { ...data } },
        { new: true }
    );
};