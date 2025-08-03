import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";
import { isAuthenticated, clearAuthData, setAuthData } from "../Helper/authUtils";

const storedData = localStorage.getItem("data");

const initialState = {
  isLoggedIn: isAuthenticated(),
  data: storedData && storedData !== "undefined" ? JSON.parse(storedData) : {},
  role: localStorage.getItem("role") || "",
};
// function to handle signup
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    let res = axiosInstance.post("user/register", data);

    toast.promise(res, {
      loading: "Wait! Creating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create account",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    console.error("Create account error:", error);
    toast.error(error?.response?.data?.message || error.message);
    throw error; // Re-throw the error so Redux can handle it properly
  }
});

// function to handle login
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = axiosInstance.post("/user/login", data);

    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log in",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error?.response?.data?.message || error.message);
    throw error; // Re-throw the error so Redux can handle it properly
  }
});

// function to handle logout
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = axiosInstance.post("/user/logout");

    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log out",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    console.error("Logout error:", error);
    toast.error(error?.response?.data?.message || error.message);
    throw error; // Re-throw the error so Redux can handle it properly
  }
});

export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    console.log("🔥 API CALL START: /user/me"); // ✅ Debug start
    const res = await axiosInstance.get("/user/me");
    console.log("✅ API Response:", res.data); // ✅ Debug response
    return res?.data;
  } catch (error) {
    console.error("❌ API Error:", error); // ✅ Debug error
    toast.error(error?.response?.data?.message || error.message);
    throw error; // Re-throw the error so Redux can handle it properly
  }
});

// function to change user password
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      let res = axiosInstance.post("/user/change-password", userPassword);

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to change password",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error?.response?.data?.message || error.message);
      throw error; // Re-throw the error so Redux can handle it properly
    }
  }
);

// function to handle forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email) => {
    try {
      let res = axiosInstance.post("/user/reset", { email });

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to send verification email",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      console.error("Forget password error:", error);
      toast.error(error?.response?.data?.message || error.message);
      throw error; // Re-throw the error so Redux can handle it properly
    }
  }
);

// function to update user profile
export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      console.log("🔄 Updating profile with data:", {
        userID: data[0],
        formData: data[1],
      });
      
      // Try using the /user/me endpoint with PUT method
      let res = axiosInstance.put(`/user/me`, data[1]);

      toast.promise(res, {
        loading: "Updating...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update profile",
      });
      
      // getting response resolved here
      res = await res;
      console.log("✅ Profile update successful:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Update profile error:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url
      });
      
      // If 404, try alternative endpoints
      if (error.response?.status === 404) {
        console.log("🔄 Trying alternative endpoints...");
        const alternativeEndpoints = [
          `/user/update`,
          `/user/profile`,
          `/user/profile/update`
        ];
        
        for (const endpoint of alternativeEndpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            const altRes = axiosInstance.put(endpoint, data[1]);
            await toast.promise(altRes, {
              loading: "Updating...",
              success: (data) => {
                return data?.data?.message;
              },
              error: "Failed to update profile",
            });
            const result = await altRes;
            console.log(`✅ Profile update successful with endpoint: ${endpoint}`, result.data);
            return result.data;
          } catch (altError) {
            console.log(`❌ Endpoint ${endpoint} failed:`, altError.response?.status);
            continue;
          }
        }
        
        // If all endpoints fail
        toast.error("Profile update failed. No valid endpoint found.");
        throw new Error("No valid profile update endpoint found");
      }
      
      toast.error(error?.response?.data?.message || error.message);
      throw error; // Re-throw the error so Redux can handle it properly
    }
  }
);

// function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    let res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password,
    });

    toast.promise(res, {
      loading: "Resetting...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to reset password",
    });
    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    console.error("Reset password error:", error);
    toast.error(error?.response?.data?.message || error.message);
    throw error; // Re-throw the error so Redux can handle it properly
  }
});

// function to refresh user data and update role format
export const refreshUserData = createAsyncThunk("/user/refresh", async () => {
  try {
    console.log("🔄 Refreshing user data...");
    const res = await axiosInstance.get("/user/me");
    console.log("✅ Refresh Response:", res.data);
    return res?.data;
  } catch (error) {
    console.error("❌ Refresh Error:", error);
    toast.error(error?.response?.data?.message || error.message);
    throw error;
  }
});

// function to manually fix role format
export const fixRoleInState = createAsyncThunk("/auth/fixRole", async (_, { getState }) => {
  const state = getState();
  const currentRole = state.auth.role;
  
  if (currentRole && currentRole !== currentRole.toUpperCase()) {
    console.log("🔧 Fixing role in state:", currentRole, "→", currentRole.toUpperCase());
    // Update localStorage
    localStorage.setItem("role", currentRole.toUpperCase());
    return { role: currentRole.toUpperCase() };
  }
  return { role: currentRole };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // for user registration
      .addCase(createAccount.fulfilled, (state, action) => {
        console.log("✅ Account created successfully:", action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        console.error("❌ Account creation failed:", action.error);
      })
      
      // for user login
      .addCase(login.fulfilled, (state, action) => {
        setAuthData(action?.payload?.user, action?.payload?.token);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role?.toUpperCase() || "";
      })
      .addCase(login.rejected, (state, action) => {
        console.error("Login failed:", action.error);
        clearAuthData();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      
      // for user logout
      .addCase(logout.fulfilled, (state) => {
        clearAuthData();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      .addCase(logout.rejected, (state, action) => {
        console.error("Logout failed:", action.error);
        // Even if logout fails, we should clear the local state
        clearAuthData();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      // for user details
      .addCase(getUserData.fulfilled, (state, action) => {
        setAuthData(action?.payload?.user, localStorage.getItem("token"));
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role?.toUpperCase() || "";
      })
      .addCase(getUserData.rejected, (state, action) => {
        console.error("Get user data failed:", action.error);
        // If getting user data fails, the user might not be authenticated
        clearAuthData();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      // for user data refresh
      .addCase(refreshUserData.fulfilled, (state, action) => {
        setAuthData(action?.payload?.user, localStorage.getItem("token"));
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role?.toUpperCase() || "";
      })
      .addCase(refreshUserData.rejected, (state, action) => {
        console.error("Refresh user data failed:", action.error);
        clearAuthData();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      // for fixing role format
      .addCase(fixRoleInState.fulfilled, (state, action) => {
        if (action.payload.role) {
          state.role = action.payload.role;
          console.log("✅ Role fixed in state:", state.role);
        }
      });
  },
});

export default authSlice.reducer;
