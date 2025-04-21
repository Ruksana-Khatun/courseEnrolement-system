import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: [3, "fullName must be at least 3 characters"],
      max_length: [50, "fullName must be less than 50 characters"],
      required: true, 
      trim: true,
    },
    email: {
      type: String,
      required:[ true, "email is required"],
      unique: true,
      match:[ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8,' password must be at least 8 characters'],
    },
    avatar: {
      public_id: String,
      secure_url: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    
    forgotPasswordToken: String,
    forgotPasswordExpiryDate: Date,
  },
  { timestamps: true 

  });
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  userSchema.methods={
    generateJWTToken: async function () {
      return await jwt.sign({ id: this._id, email:this.email,subscription:this.subscription }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
    },
  }


const User = mongoose.model("User", userSchema);
export default User;
