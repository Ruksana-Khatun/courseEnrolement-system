import mongoose from "mongoose";
import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: [3, "fullName must be at least 3 characters"],
      maxlength: [50, "fullName must be less than 50 characters"],
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
    generateJWTToken:  function () {
      return jwt.sign({ id: this._id, email: this.email, subscription: this.subscription, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
    },
    comparePassword: async function(plainTextPassword){
      return await bcrypt.compare(plainTextPassword, this.password)
    },
     generatePasswordResetToken: function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.forgotPasswordExpiryDate = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
},
  }


const User = mongoose.model("User", userSchema);
export default User;
