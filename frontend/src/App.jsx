// import { useState } from 'react'
import axios from "axios"
import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAnimateOnScroll } from "./hooks/use-intersection-observer"
import { useTiltEffect } from "./hooks/use-tilt-effect"
import { Check, MonitorIcon as Running } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

import './App.css'

function App() {
  const navigate = useNavigate()
  const sectionHeaderRef = useAnimateOnScroll("fade-in-up")
  const pricingCardsRef = useAnimateOnScroll("slide-in-left")
  const registrationFormRef = useAnimateOnScroll("slide-in-right")

  const pricingCard1Ref = useTiltEffect()
  const pricingCard2Ref = useTiltEffect()
  // let navigate = useNavigate();

  const handleRegisterClick = (e) => {
    e.preventDefault()
    // TODO: Implement modal opening logic here
    alert("Registration modal would open here.")
  }

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
      const response = await axios.post("http://localhost:3001/order", item)
      return response
    } catch (err) {
      console.error("Order initiation failed:", err)
      return null
    }
  }

  const verifyPayment = async (data) => {
    try {
      const res = await axios.post("http://localhost:3001/success", data)
      console.log(res)
      return res
    } catch (err) {
      console.error("Payment verification failed:", err)
      return null
    }
  }

  const purchase = async (selectedPrice = 555) => {
    const razorpayLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!razorpayLoaded) {
      toast.error("Failed to load Razorpay SDK. Please check your internet.")
      return
    }

    const item = {
      price: selectedPrice,
      title: `Marathon ${selectedPrice}`,
      description: "Marathon Event Registration"
    }

    const orderCreation = await InitiateOrder(item)
    if (!orderCreation || !orderCreation.data || !orderCreation.data.order) {
      toast.error("Order creation failed")
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
        const loading = toast.loading("Verifying payment...")

        const paymentPayload = {
          orderCreationId: orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature
        }
        const verifyRes = await verifyPayment(paymentPayload)

        toast.dismiss(loading)

        // console.log(verifyRes)
        if (verifyRes && verifyRes.data.success) {
          toast.success("Payment Successful!")
          navigate("/")
        } else {
          toast.error("Payment Verification Failed")
        }
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled by user")
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
      <ToastContainer />
      {/* <button onClick={purchase}>Pay ₹555 for Marathon</button> */}
      <section id="register" className="registration section bg-background-white relative">
        <div className="container">
          <div ref={sectionHeaderRef} className="section-header animate-fade-in-up">

            <h2 className="section-title animate-fade-in-up">
              Register for Change
            </h2>
            <p className="section-subtitle animate-fade-in-up">
              Be part of our mission for women safety and drug awareness
            </p>
          </div>

          <div className="registration-content">
            <div
              ref={pricingCardsRef}
              className="pricing-cards animate-slide-in-left"
            >
              {/* Pricing Card 1 */}
              <div
                ref={pricingCard1Ref}
                className="pricing-card tilt-effect"
              >
                <div className="pricing-category">5K Challenge</div>
                <div className="pricing-amount">₹333</div>
                <div className="pricing-features">
                  {["5 Kilometer distance", "Safety awareness materials", "Complete race kit", "Medal & certificate"].map((text, idx) => (
                    <div
                      key={idx}
                      className="pricing-feature"
                    >
                      <Check className="text-accent-green" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="pricing-btn"
                  onClick={() => purchase(333)}
                >
                  Register for ₹333
                </button>
              </div>

              {/* Pricing Card 2 */}
              <div
                ref={pricingCard2Ref}
                className="pricing-card tilt-effect"
              >
                <div className="pricing-category">10K Challenge</div>
                <div className="pricing-amount">₹555</div>
                <div className="pricing-features">
                  {["10 Kilometer distance", "Safety awareness materials", "Complete race kit", "Medal & certificate"].map((text, idx) => (
                    <div
                      key={idx}
                      className="pricing-feature"
                    >
                      <Check className="text-accent-green" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="pricing-btn"
                  onClick={() => purchase(555)}
                >
                  Register for ₹555
                </button>
              </div>
            </div>

            {/* Registration Form / CTA */}
            {/* <div
                              ref={registrationFormRef}
                              className="registration-form text-center animate-slide-in-right w-full max-w-[500px]"
                          >
                              <h3 className="font-poppins text-4xl font-bold text-text-dark mb-8">Ready to Make a Difference?</h3>
                              <button
                                  id="open-registration"
                                  onClick={handleRegisterClick}
                                  className="btn btn-primary btn-large relative overflow-hidden px-12 py-6 text-decoration-none font-extrabold transition-all duration-400 ease-DEFAULT border-none cursor-pointer inline-flex items-center gap-3 text-xl bg-primary-gradient text-text-light shadow-light animate-[pulse_2s_infinite] hover:translate-y-[-3px] hover:scale-105 hover:shadow-heavy hover:animate-none before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-400 before:ease-DEFAULT hover:before:left-full rounded-[50px]"
                              >
                                  <Running />
                                  Register Now
                              </button>
                              <div className="registration-note mt-8 text-text-gray text-base leading-relaxed">
                                  <p>Secure payment via Razorpay • All major payment methods accepted</p>
                                  <p>UPI, Cards, Net Banking, and Wallets supported</p>
                              </div>
                          </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
