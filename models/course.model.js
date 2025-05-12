import { model, Schema } from 'mongoose';

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [8, 'Title must be at least 8 characters'],
      maxlength: [50, 'Title cannot be more than 50 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters long'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    lectures: [
      {
        title: {
          type: String,
          required: [true, 'Lecture title is required'],
        },
        description: {
          type: String,
          required: [true, 'Lecture description is required'],
        },
        fileType: {
          type: String,
          enum: ['pdf'],
          default: 'pdf',
        },
        file: {
          public_id: {
            type: String,
            required: [true, 'PDF public_id is required'],
          },
          secure_url: {
            type: String,
            required: [true, 'PDF URL is required'],
          },
        },
      },
    ],
    thumbnail: {
      public_id: {
        type: String,
        required: [true, 'Thumbnail public_id is required'],
      },
      secure_url: {
        type: String,
        required: [true, 'Thumbnail URL is required'],
      },
    },
    numberOfLectures: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: [true, 'Course instructor name is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Course = model('Course', courseSchema);

export default Course;
