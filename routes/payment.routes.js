import Router from 'express';
import {getRazorpayKey,buySubscription,verifySubscription, cancelSubscribe} from '../controllers/payment.controller.js';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import { authorizedRoles } from '../middlewares/auth.middlewares.js';
import { allPayment } from '../controllers/payment.controller.js';

const router =Router()

router.route('/razorpay_key').
get(
    isLoggedIn,
    getRazorpayKey
);
router.route('/subscribe').
post(
     isLoggedIn,
    buySubscription
);
router.route('/verify')
.post(
    isLoggedIn,
    verifySubscription
);
router.route('unsubScribe')
.post(
     isLoggedIn,    
    cancelSubscribe
);
router.route('/')
.get(
    isLoggedIn,
    authorizedRoles("admin"),
    allPayment
);
export default router;

