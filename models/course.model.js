import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,'Title is required'],
        trim: true, 
        minlength: [10, "Title must be at least 8 characters"],
        maxLength: [100, "Title should be less then 100 characters"],
    
    },
    description: {
        type: String,
        required:[true,'description is required'],
        minlength: [20, "Description must be at least 20 characters"],
        maxLength: [1000, "Description should be less then 1000 characters"],
        trim: true,
    },
    category: {
        type: String,
        required: [true,'category is required'],

    },
    thumbnail: {
        public_id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true,
        },
    },
    lectures: [
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            fileType: {
                type: String,
                enum: ['video', 'pdf'],  // Admin can choose either 'video' or 'pdf'
                required: true,
            },
            file: {
                public_id: {
                    type: String,
                    required: true,
                },
                secure_url: {
                    type: String,
                    required: true,
                },
            },
        },
    ],
    numberoflectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timestamp:true,
});
const Course = mongoose.model("Course", courseSchema);
export default Course;