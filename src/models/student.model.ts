/*

1 . student collection 
2 . teachers collection
3 . course collection
4 . student_login collection
5  . teacher login collection
6  . student_Enrollment collection


*/

import mongoose, { Document, Schema, Model, model } from 'mongoose';

// Define an interface representing a document in MongoDB
interface IStudent extends Document {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth?: Date; // Optional
  profile_picture?: string; // Optional
  updated_at: Date;
  status: 'active' | 'inactive' | 'suspended';
  bio?: string; // Optional
  contact_number?: string; // Optional
  country:string
  role: 'Student' | 'Teacher' | 'Admin';
  purchasedCourses:Schema.Types.ObjectId[];
  
}

// Create the schema corresponding to the document interface
const studentSchema = new Schema<IStudent>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    trim: true, // Good practice to trim whitespace
  },

  country:{
    type :String
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Good practice to trim whitespace
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // Good practice to trim whitespace
  },
  last_name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true, // Good practice to trim whitespace
  },
  
  date_of_birth: {
    type: Date,
    required: false, // Optional field
  },

  profile_picture: {
    type: String,
    required: false, // Optional field
    default:null
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },

  bio: {
    type: String,
    required: false, // Optional field
    maxlength: 500, // Limiting bio length
  },

  role:{
    type: String,
    // enum: ['Student', 'Teacher', ''],
    default: null,
  },

  contact_number: {
    type: String,
    required: [true,"Contact number must be provided"] // Optional field
  },

  purchasedCourses:[
    {
       type: Schema.Types.ObjectId,
        ref: 'courses'
    }
  ]
  
},{timestamps:true});



// Create and export the model
const studentModel : Model<IStudent> = model<IStudent>('students', studentSchema);

export {studentModel};
