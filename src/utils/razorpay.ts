import { API_BASE_URL } from "@/config/api";

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface PaymentOptions {
  amount: number; // in INR (e.g. 499, 4999, 19999, 59999)
  tierCode: string; // e.g. 'L0', 'L1', 'L2', 'L3'
  tierName: string; // e.g. 'Fast Track', 'Silver Member'
  email?: string;
  name?: string;
  phone?: string;
  onSuccess: (data: any) => void;
  onFailure?: (error: any) => void;
}

export const processRazorpayPayment = async ({
  amount,
  tierCode,
  tierName,
  email,
  name,
  phone,
  onSuccess,
  onFailure,
}: PaymentOptions) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      if (onFailure) onFailure(new Error("SDK load error"));
      return;
    }

    // 1. Create order on backend
    const orderRes = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        tierCode,
        tierName,
        customerEmail: email || "",
        customerPhone: phone || "",
        customerName: name || "",
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.orderId) {
      throw new Error(orderData.message || "Could not initiate payment order");
    }

    // 2. Open Razorpay Checkout modal
    const options = {
      key: orderData.keyId || "rzp_test_1DP5mmOlF5G5ag",
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Ravishing Art Hub",
      description: `${tierName} (${tierCode}) Membership Enrollment`,
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80",
      order_id: orderData.orderId.startsWith("order_") && !orderData.orderId.includes("_demo_") ? undefined : orderData.orderId,
      prefill: {
        name: name || "",
        email: email || "",
        contact: phone || "",
      },
      notes: {
        tierCode,
        tierName,
      },
      theme: {
        color: "#f97316", // Orange theme matching Ravishing Art Hub
      },
      modal: {
        ondismiss: () => {
          if (onFailure) onFailure(new Error("Payment cancelled by user"));
        },
      },
      handler: async (response: any) => {
        try {
          // 3. Verify payment signature on backend
          const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || orderData.orderId,
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || "",
              tierCode,
              tierName,
              amount,
              email,
              name,
              phone,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // If token returned, save it
            if (verifyData.token) {
              localStorage.setItem("token", verifyData.token);
              localStorage.setItem("user", JSON.stringify(verifyData.user));
              document.cookie = `token=${verifyData.token}; path=/; max-age=2592000; SameSite=Lax`;
            }
            onSuccess(verifyData);
          } else {
            throw new Error(verifyData.message || "Payment verification failed");
          }
        } catch (vErr: any) {
          console.error("Verification error:", vErr);
          alert(vErr.message || "Payment verification failed. Please contact support.");
          if (onFailure) onFailure(vErr);
        }
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", (resp: any) => {
      console.error("Payment failed:", resp.error);
      alert(`Payment failed: ${resp.error.description || "Transaction declined"}`);
      if (onFailure) onFailure(resp.error);
    });
    rzp.open();
  } catch (err: any) {
    console.error("Razorpay initiation error:", err);
    alert(`Payment initiation error: ${err.message}`);
    if (onFailure) onFailure(err);
  }
};
