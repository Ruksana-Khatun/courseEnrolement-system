export const getRazorpayKey = async (req, res, next) => {
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_API_KEY,
    });
}



export const buySubscription = async (req, res, next) => {
    const {id}=req.user;
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorApp('Unauthorized',404));
    } 
    if(user.role=='admin'){
        return next(new ErrorApp('Admin cannot buy purches subscription',403));

    }
    
}




export const verifySubscription = async (req, res, next) => {
}



export const cancelSubscribe = async (req, res, next) => {
}








export const allPayment = async (req, res, next) => {
}

