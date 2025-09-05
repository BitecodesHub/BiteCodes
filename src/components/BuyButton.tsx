"use client"

import { useState } from "react"

interface BuyButtonProps {
  amount: number
  userId: number
  universitySlug: string
  onPurchase?: () => void
}

export default function BuyButton({
  amount,
  userId,
  universitySlug,
  onPurchase,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false)

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false)
      if ((window as any).Razorpay) return resolve(true)

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const handleBuy = async () => {
    console.log("Buy button clicked")
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      // 1) Create order on backend
      const createRes = await fetch(
        `${apiUrl}/api/purchase/buyAllCoursesUniversity/${userId}/${universitySlug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            paymentMethod: "RAZORPAY",
            upiId: null,
            appName: "WebApp",
          }),
        }
      )

      if (!createRes.ok) {
        const text = await createRes.text().catch(() => "Failed to create purchase")
        throw new Error(text || "Failed to create purchase")
      }

      const order = await createRes.json()
      console.log("Order created:", order)

      const loaded = await loadRazorpay()
      if (!loaded) {
        throw new Error("Failed to load Razorpay SDK")
      }

      // choose order id + amount robustly (backend may return different keys)
      const orderId = order.razorpayOrderId || order.id || order.orderId
      const orderAmount = order.amount || order.amount_in_paise || Math.round(amount * 100)

      if (!orderId) {
        console.warn("Order id missing from backend response:", order)
      }

      // 2) Razorpay checkout options
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: order.currency || "INR",
        name: "Bitecodes Academy",
        description: `All courses of ${universitySlug}`,
        order_id: orderId,
        handler: async (response: any) => {
          console.log("Razorpay response:", response)
          try {
            const verifyRes = await fetch(
              `${apiUrl}/api/purchase/verifyPayment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  userId,
                  universitySlug,
                }),
              }
            )

            const text = await verifyRes.text().catch(() => "")
            if (verifyRes.ok) {
              console.log("Verification success:", text)
              alert("✅ Payment successful")
              onPurchase?.()
            } else {
              console.error("Verification failed:", text)
              alert("❌ Verification failed: " + text)
            }
          } catch (err: any) {
            console.error("Verification error:", err)
            alert("Error verifying payment: " + (err?.message || err))
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Checkout dismissed")
          },
        },
        prefill: {
          // optionally prefill with logged-in user data
          name: (typeof window !== "undefined" && localStorage.getItem("user"))
            ? JSON.parse(localStorage.getItem("user") as string)?.name
            : "",
          email: (typeof window !== "undefined" && localStorage.getItem("user"))
            ? JSON.parse(localStorage.getItem("user") as string)?.email
            : "",
        },
        theme: { color: "#3399cc" },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      console.error("Buy error:", err)
      alert("Payment failed: " + (err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-800 disabled:opacity-60"
    >
      {loading ? "Processing..." : `Buy All Courses @ ₹${Math.round(amount)}`}
    </button>
  )
}
