import {Schema,model,Document} from 'mongoose';

interface Reviews extends Document{
    student:Schema.Types.ObjectId;
    comments:string;
    rating:number;
};


const reviewSchema = new Schema<Reviews>({
    student:{
        type:Schema.Types.ObjectId,
        ref:'students',
        required:true
    },
    comments:{
        type:String,
        trim:true,
        maxlength:[500,"comments must contain maximum 500 character"]
    },

    rating: {
              type: Number,
              min: [1, 'Rating must be at least 1.'],
              max: [5, 'Rating must be at most 5.']
      },

});


const reviewModel = model<Reviews>('reviews',reviewSchema);

export default reviewModel;







// reviews: [
    //   {
    //     student: {
    //       type: Schema.Types.ObjectId,
    //       ref: 'Student',
    //       required: true
    //     },
    //     rating: {
    //       type: Number,
    //       required: [true, 'Rating is required.'],
    //       min: [1, 'Rating must be at least 1.'],
    //       max: [5, 'Rating must be at most 5.']
    //     },
    //     comment: {
    //       type: String,
    //       trim: true,
    //       maxlength: [500, 'Comment must be less than 500 characters long.']
    //     },
    //     createdAt: {
    //       type: Date,
    //       default: Date.now
    //     }
    //   }
    // ],