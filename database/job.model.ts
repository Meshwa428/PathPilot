import { Schema, model, models, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
  requirements: string[];
  applicants: Schema.Types.ObjectId[];
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  requirements: [{ type: String }],
  applicants: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
});

const Job = models.Job || model<IJob>('Job', JobSchema);

export default Job;
