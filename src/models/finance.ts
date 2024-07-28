import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    studentId: mongoose.Schema.Types.ObjectId;
    courseId: mongoose.Schema.Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema: Schema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default:"$USD" },
    status: { type: String, enum: ['pending', 'completed', 'failed'] , default:"pending" },
    paymentMethod: { type: String, required: true },
},{timestamps:true});

// transactionSchema.pre<ITransaction>('save', function (next) {
//     this.updatedAt = new Date();
//     next();
// });

const transactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);

export {transactionModel};
