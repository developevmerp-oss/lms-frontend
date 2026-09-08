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
      alert("Payment gateway failed to load. Please check your internet connection and try again.");
      if (onFailure) onFailure(new Error("Razorpay SDK load error"));
      return;
    }

    // 1. Create order on backend (logged initially as 'pending')
    const orderRes = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        tierCode,
        tierName,
        customerEmail: email || "student@ravishingarthub.com",
        customerPhone: phone || "9999999999",
        customerName: name || "Art Student",
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.orderId) {
      throw new Error(orderData.message || "Could not initiate payment order with gateway");
    }

    // Helper: log cancellation or failure to backend
    const logFailure = async (status: 'failed' | 'cancelled', reason: string, paymentId?: string) => {
      try {
        await fetch(`${API_BASE_URL}/payments/record-failure`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentId: paymentId || null,
            status,
            reason,
          }),
        });
      } catch (_) {}
    };

    // Helper: complete verification only when bank provides real signature
    const completeVerification = async (paymentId: string, orderId: string, signature: string) => {
      const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          tierCode,
          tierName,
          amount,
          email: email || "student@ravishingarthub.com",
          name: name || "Art Student",
          phone: phone || "9999999999",
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        if (verifyData.token) {
          localStorage.setItem("token", verifyData.token);
          localStorage.setItem("user", JSON.stringify(verifyData.user));
          document.cookie = `token=${verifyData.token}; path=/; max-age=2592000; SameSite=Lax`;
        }
        onSuccess(verifyData);
        return true;
      } else {
        throw new Error(verifyData.message || "Payment verification failed. Membership could not be activated.");
      }
    };

    // 2. Open Razorpay Checkout modal
    const options: any = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Ravishing Art Hub",
      description: `${tierName} (${tierCode}) Membership Enrollment`,
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80",
      prefill: {
        name: name || "Art Student",
        email: email || "student@ravishingarthub.com",
        contact: phone && phone.length >= 10 ? phone : "9876543210",
      },
      notes: {
        tierCode,
        tierName,
      },
      theme: {
        color: "#f97316", // Brand Orange
      },
      modal: {
        ondismiss: () => {
          console.log("User dismissed checkout window");
          logFailure("cancelled", "User closed the payment window before completing payment");
          if (onFailure) onFailure(new Error("Payment was cancelled by user. No amount was deducted."));
        },
      },
      handler: async (response: any) => {
        // Razorpay only triggers this handler when payment is SUCCESSFUL
        try {
          if (!response.razorpay_payment_id) {
            throw new Error("Missing payment ID from payment gateway");
          }
          await completeVerification(
            response.razorpay_payment_id,
            response.razorpay_order_id || orderData.orderId,
            response.razorpay_signature || ""
          );
        } catch (vErr: any) {
          console.error("Verification error:", vErr);
          alert(vErr.message || "Payment verification failed. Please contact support.");
          if (onFailure) onFailure(vErr);
        }
      },
    };

    if (orderData.orderId && orderData.orderId.startsWith("order_")) {
      options.order_id = orderData.orderId;
    }

    const rzp = new (window as any).Razorpay(options);

    rzp.on("payment.failed", (resp: any) => {
      console.error("Razorpay payment failed:", resp.error);
      const failReason = resp.error?.description || resp.error?.reason || "Payment declined or failed";
      
      // Strictly log failure to backend and never upgrade user
      logFailure("failed", failReason, resp.error?.metadata?.payment_id);
      alert(`⚠️ Payment Failed: ${failReason}\n\nYour account was not charged and membership was not updated. Please try again with valid payment details.`);

      if (onFailure) {
        onFailure(resp.error);
      }
    });

    rzp.open();
  } catch (err: any) {
    console.error("Razorpay initiation error:", err);
    alert(`Payment initiation error: ${err.message}`);
    if (onFailure) onFailure(err);
  }
};
