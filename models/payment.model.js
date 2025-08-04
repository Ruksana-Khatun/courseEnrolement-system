import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["one-time", "subscription"],
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: function () {
            return this.type === "one-time";
        },
    },
    amount: {
        type: Number,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_subscription_id: {
        type: String,
        default: null,
         status: {
        type: String,
        default: null,
    }
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const payment= mongoose.model("Payment", paymentSchema);
export default payment;