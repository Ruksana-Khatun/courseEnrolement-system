import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

const initialState = {
  coursesData: [],
};

// function to get all courses
// export const getAllCourses = createAsyncThunk("/course/get", async () => {
//   try {
//     const res = axiosInstance.get("/courses");

//     toast.promise(res, {
//       loading: "Loading courses data...",
//       success: "Courses loaded successfully",
//       error: "Failed to get courses",
//     });

//     const response = await res;

//     return response.data.courses;
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
// });
export const getAllCourses = createAsyncThunk("/course/get", async () => {
  try {
    // ✅ यहाँ await लगाना ज़रूरी है
    let res = axiosInstance.get("/course");

    toast.promise(res, {
      loading: "Loading courses data...",
      success: "Courses loaded successfully",
      error: "Failed to get courses",
    });

    const response = await res;
    return response.data.courses;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
});


// function to create a new course
export const createNewCourse = createAsyncThunk(
  "/get/courses",
  async (data) => {
    try {
      // creating the form data from user data
      let formData = new FormData();
      formData.append("title", data?.title);
      formData.append("description", data?.description);
      formData.append("category", data?.category);
      formData.append("createdBy", data?.createdBy);
      formData.append("thumbnail", data?.thumbnail);

      let res = axiosInstance.post("/course", formData);

      toast.promise(res, {
        loading: "Creating the course...",
        success: "Course created successfully",
        error: "Failed to create course",
      });

      const response = await res;
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to delete the course
export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
  try {
    let res = axiosInstance.delete(`course/${id}`);

    toast.promise(res, {
      loading: "Deleting the course...",
      success: "Courses deleted successfully",
      error: "Failed to delete course",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// function to update the course details
export const updateCourse = createAsyncThunk("/course/update", async (data) => {
  try {
    // creating the form data from user data
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("createdBy", data.createdBy);
    formData.append("description", data.description);
    // backend is not allowing change of thumbnail
    // if (data.thumbnail) {
    //   formData.append("thumbnail", data.thumbnail);
    // }

    let res = axiosInstance.put(`/course/${data.id}`, {
      title: data.title,
      category: data.category,
      createdBy: data.createdBy,
      description: data.description,
    });

    toast.promise(res, {
      loading: "Updating the course...",
      success: "Course updated successfully",
      error: "Failed to update course",
    });

    const response = await res;
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
});

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCourses.fulfilled, (state, action) => {
      if (action.payload) {
        state.coursesData = [...action.payload];
      }
    });
  },
});

export default courseSlice.reducer;
