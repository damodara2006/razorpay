import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

dotenv.config();
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Razorpay instance
const razorInstance = new Razorpay({
    key_id: process.env.RAZOR_TEST_KEY,
    key_secret: process.env.RAZOR_TEST_SECRET,
});

// ✅ Create Razorpay Order
app.post("/order", async (req, res) => {
    try {
        const amount = req.body.price;
        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
        };

        const order = await razorInstance.orders.create(options);
        console.log("✅ Order created:", order);
        
        res.json({ order });
    } catch (err) {
        console.error("❌ Order creation failed:", err);
        res.status(500).json({ error: "Order creation failed" });
    }
});

// ✅ Verify Payment Signature
app.post("/success", (req, res) => {
    const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderCreationId,
    } = req.body;

    const isValid = validatePaymentVerification(
        {
            order_id: razorpayOrderId,
            payment_id: razorpayPaymentId,
        },
        razorpaySignature,
        process.env.RAZOR_TEST_SECRET
    );


    console.log("🔍 Payment Verification:", isValid);

    if (!isValid) {
        return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    res.status(200).json({ success: true, message: "Payment verified successfully" });
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
