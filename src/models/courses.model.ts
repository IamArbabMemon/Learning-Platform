import mongoose, { Schema, model, Document } from 'mongoose';

// Define an interface representing a document in MongoDB.
interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  teacher: Schema.Types.ObjectId; // Reference to the Teacher
  lessons: ILesson[];
  enrolledStudents: Schema.Types.ObjectId[]; // References to Students
  progress: Record<string, number> | null; // Mapping studentId to progress percentage
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ILesson {
  title: string;
  content: string; // Text content or a rich text format
  videoUrl?: string; // Optional URL for the lesson video
  duration?: number; // Duration in minutes
}


// Define the schema corresponding to the document interface.
const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxlength: [100, 'Title must be less than 100 characters long.']
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
      maxlength: [1000, 'Description must be less than 1000 characters long.']
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      trim: true
    },
    level: {
      type: String,
      required: [true, 'Level is required.'],
      enum: ['beginner', 'intermediate', 'advanced'], // Only allow these values
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'teacher', // Reference to the Teacher collection
      required: true
    },
    lessons: [
      {
        title: {
          type: String,
          required: [true, 'Lesson title is required.'],
          trim: true
        },
        content: {
          type: String
        },
        videoUrl: {
          type: String,
          trim: true
        },
        duration: {
          type: Number,
          min: [0, 'Duration must be a positive number.'] // Optional field
        }
      },
    ],
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'students' // Reference to the Students collection
      }
    ],

    // progress: {
    //   type: Map,
    //   of: Number,
    //   default: {}, // Maps studentId to their progress percentage
    //   validate: {
    //     validator: function (progress: Record<string, number>) {
    //       return Object.values(progress).every(value => value >= 0 && value <= 100);
    //     },
    //     message: 'Progress values must be between 0 and 100.'
    //   }
    // },
    // progress: {
    //   type: Map,
    //   of: Number,
    //   default: {}, // Maps studentObjectId to their progress percentage
    //   validate: {
    //     validator: function (progress:Map<string,number>):boolean {
    //       // Ensure all values are between 0 and 100
    //       const valuesValid = Object.values(progress).every(value => value >= 0 && value <= 100);
          
    //       // Ensure all keys are valid ObjectId strings
    //       const keysValid = Array.from(progress.keys()).every(key => mongoose.Types.ObjectId.isValid(key));
  
    //       return valuesValid && keysValid;
    //     },
    //     message: 'Progress values must be between 0 and 100, and all keys must be valid ObjectIds.'
    //   }
    // },

    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price must be a positive number.']
    },

   
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    //   immutable: true
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now
    // }
  },
  {
    timestamps: true 
  }
);

// Middleware to update the updatedAt field before saving
// courseSchema.pre<ICourse>('save', function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// Create a Mongoose model for the Course schema
const course = model<ICourse>('Course', courseSchema);

export default course;
