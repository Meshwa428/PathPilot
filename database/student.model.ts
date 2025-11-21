import { Schema, model, models, Document } from 'mongoose';

export interface IStudent extends Document {
  clerkId: string;
  name: string;
  email: string;
  collegeId: string;
  branch: string;
  year: number;
  cgpa: number;
  resume?: string;
  appliedJobs: Schema.Types.ObjectId[];
}

const StudentSchema = new Schema<IStudent>({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  collegeId: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  resume: { type: String },
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
});

const Student = models.Student || model<IStudent>('Student', StudentSchema);

export default Student;
