import { useState } from 'react'
import axios from "axios"
import './App.css'

function App() {

  const loadScript = async (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const InitiateOrder = async (item) => {
    try {
      const response = await axios.post("http://localhost:8080/order", item)
      return response
    } catch (err) {
      console.error("Order initiation failed:", err)
      return null
    }
  }

  const verifyPayment = async (data) => {
    try {
      const res = await axios.post("http://localhost:8080/success", data)
      console.log(res)
      return res
    } catch (err) {
      console.error("Payment verification failed:", err)
      return null
    }
  }

  const purchase = async () => {
    const razorpayLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!razorpayLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet.")
      return
    }

    const item = {
      price: 555,
      title: "Marathon 555",
      description: "Marathon Event Registration"
    }

    const orderCreation = await InitiateOrder(item)
    if (!orderCreation || !orderCreation.data || !orderCreation.data.order) {
      alert("Order creation failed")
      return
    }

    const orderId = orderCreation.data.order.id

    const options = {
      key: "rzp_test_1KDP2KFI6mIMGR",
      amount: item.price * 100,
      currency: "INR",
      name: item.title,
      description: item.description,
      image: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-v0LP91OBaZckcNrHRNpH4uXzImn4v5.png&w=160&q=75", // Optional
      order_id: orderId,
      handler: async function (response) {
        const paymentPayload = {
          orderCreationId: orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature
        }



        const verifyRes = await verifyPayment(paymentPayload)

        console.log(verifyRes)
        if (verifyRes && verifyRes.data.success) {
          alert("🎉 Payment Successful and Verified!")
        } else {
          alert("❌ Payment Verification Failed")
        }
      },
      notes: {
        name: "Damodara Prakash"
      },
      theme: {
        color: "#3399cc"
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className="App">
      <button onClick={purchase}>Pay ₹555 for Marathon</button>
    </div>
  )
}

export default App
