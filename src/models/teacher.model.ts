import { Schema, model, Document } from 'mongoose';

// Define an interface representing a document in MongoDB.
interface ITeacher extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  coursesCreated:Schema.Types.ObjectId[],
  profilePictureUrl?: string;
  country:string;
  bio?:string;
  createdAt: Date;
  updatedAt: Date;

}

// Define the schema corresponding to the document interface.
const teacherSchema = new Schema<ITeacher>(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long.'],
      maxlength: [30, 'Username must be less than 30 characters long.']
    },
    
    country:{
        type :String
      },

    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password hash is required.']
    },
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true
    },
    
    coursesCreated: [
      {
        type: Schema.Types.ObjectId,
        ref: 'courses' // Reference to the courses collection
      },

    ],


    profilePictureUrl: {
      type: String,
      trim: true,
      default:null
    },

    bio: {
      type: String,
      required: false, // Optional field
      maxlength: 500, // Limiting bio length
    },

  },
  {
    timestamps: true // Automatically manage createdAt and updatedAt fields
  }
);

// Middleware to update the updatedAt field before saving
// teacherSchema.pre<ITeacher>('save', function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// Create a Mongoose model for the Teacher schema
const teacherModel = model<ITeacher>('Teacher', teacherSchema);

export {teacherModel} ;
