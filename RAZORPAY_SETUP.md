# 🎯 Razorpay Payment Integration Setup Guide

## Overview
This guide walks you through completing the Razorpay payment gateway integration for the MyFashion e-commerce platform.

---

## ✅ What's Done

### Frontend (`frontend/src/pages/Payment.js`)
- ✅ Razorpay Checkout SDK integration
- ✅ All 6 payment methods UI: UPI, Card, Net Banking, Wallets, Apple Pay, Google Pay
- ✅ Order creation on backend before payment
- ✅ Razorpay modal opens with customer prefilled data
- ✅ Payment success/failure handling
- ✅ Payment verification with backend
- ✅ Redirect to order confirmation page
- ✅ Environment variable configured: `REACT_APP_RAZORPAY_KEY_ID`

### Backend (`backend/routes/orders.js`)
- ✅ Razorpay SDK initialized
- ✅ `POST /create-razorpay-order` endpoint - creates Razorpay order
- ✅ `POST /verify-razorpay-payment` endpoint - verifies payment signature
- ✅ Signature verification using HMAC-SHA256
- ✅ Order and Payment database updates after successful payment

### Backend (`backend/models/Order.js`)
- ✅ Already has `paymentStatus` field with correct enum values

---

## 🔧 Required Backend Setup

### 1. Install Razorpay NPM Package

Navigate to backend directory and install:

```bash
cd backend
npm install razorpay
```

### 2. Add Environment Variables

Edit `backend/.env` and add:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### 3. Get Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Login to your account
3. Navigate to **Settings → API Keys**
4. Under **Live Keys** section:
   - Copy your **Key ID**
   - Copy your **Key Secret**
5. Replace the values in `.env` file

> **⚠️ IMPORTANT:** 
> - Key ID is public (used in frontend)
> - Key Secret is private (backend only, NEVER expose)
> - Use **Live Keys** for production, **Test Keys** for development

---

## 🎨 Required Frontend Setup

### 1. Add Razorpay Key ID to Environment

Edit `frontend/.env.local`:

```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
REACT_APP_BACKEND_URL=http://localhost:3001  # or your Render URL in production
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Restart Development Server

```bash
# In frontend directory
npm start
```

---

## 🧪 Testing the Payment Flow

### Local Testing (Development)

1. **Use Razorpay Test Cards:**

   **Success Case:**
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits (e.g., 123)

   **Failure Case:**
   - Card Number: `4111 1111 1111 1112`
   - Expiry: Any future date
   - CVV: Any 3 digits

2. **Go through payment flow:**
   - Add products to cart
   - Proceed to checkout
   - Select shipping address
   - Try different payment methods
   - Use test card details
   - Verify payment succeeds/fails as expected

3. **Check database:**
   - Order created with `paymentStatus: 'paid'`
   - Payment record created with transaction ID
   - Stock decremented

---

## 📱 Payment Methods Available

All these methods are handled by Razorpay (no additional setup needed):

| Method | Details |
|--------|---------|
| 💳 **Debit/Credit Card** | Visa, MasterCard, Rupay |
| 📱 **UPI** | Google Pay, PhonePe, Paytm, BHIM |
| 🏦 **Net Banking** | ICICI, HDFC, SBI, Axis, IDBI, etc. |
| 👛 **Wallets** | Paytm, Amazon Pay, Freecharge |
| 🍎 **Apple Pay** | iOS devices |
| 🟦 **Google Pay** | Android devices |

---

## 🚀 Deployment Instructions

### For Vercel (Frontend)

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Select your project
3. **Settings → Environment Variables**
4. Add:
   ```
   REACT_APP_RAZORPAY_KEY_ID = your_key_id
   REACT_APP_BACKEND_URL = https://your-render-backend.onrender.com
   ```
5. **Trigger Redeploy** from Deployments tab

### For Render (Backend)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service
3. **Environment** tab
4. Add:
   ```
   RAZORPAY_KEY_ID = your_key_id
   RAZORPAY_KEY_SECRET = your_key_secret
   ```
5. Service will auto-redeploy

---

## 🔐 Security Best Practices

✅ **DO:**
- Store Key Secret only in backend `.env`
- Use HTTPS/TLS for all API calls
- Verify payment signatures on backend
- Never expose Key Secret in frontend code
- Store transactions in database

❌ **DON'T:**
- Commit `.env` files to git
- Expose Key Secret in frontend
- Skip signature verification
- Store sensitive data in localStorage
- Hardcode credentials in code

---

## 🐛 Troubleshooting

### Issue: "Razorpay is not defined"
- **Cause:** Script loaded but not ready
- **Fix:** Check browser console for script load errors, ensure internet connection

### Issue: "Payment failed: Invalid signature"
- **Cause:** Key Secret incorrect or tampered signature
- **Fix:** Verify Key Secret is correct in `.env`, check for typos

### Issue: Order created but payment not updated
- **Cause:** Verification endpoint returning error
- **Fix:** Check backend logs for error details, verify orderId matches

### Issue: CORS error when calling Razorpay API
- **Cause:** Razorpay SDK loaded from CDN but blocked
- **Fix:** Check browser network tab, disable VPN/proxy, verify internet

### Issue: "order_id not found" from Razorpay
- **Cause:** Order creation failed silently
- **Fix:** Check backend response, verify `POST /create-razorpay-order` endpoint works

---

## 📊 Order Status Flow

```
User Clicks "Pay" → Create Order (pending) → Create Razorpay Order → 
Open Razorpay Modal → User Pays → Verify Signature → Update Order 
(paymentStatus: 'paid') → Update Payment Record → Redirect to Confirmation
```

---

## 📝 Database Records Created

### Order Document
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  orderNumber: "SKXXXXXX",
  items: [...],
  paymentMethod: "card", // or "upi", "wallet", etc.
  paymentStatus: "paid", // Updated after payment
  totalAmount: 2500,
  status: "processing",
  createdAt: Date
}
```

### Payment Document
```javascript
{
  _id: ObjectId,
  order: ObjectId,
  user: ObjectId,
  amount: 2500,
  method: "card",
  transactionId: "pay_xxxxx", // Razorpay payment ID
  status: "completed",
  createdAt: Date
}
```

---

## ✨ Next Steps (Optional Features)

After basic integration works:

1. **Refund Processing**
   - Create endpoint `POST /refund`
   - Handle partial/full refunds in Razorpay

2. **Webhook Handling**
   - Setup webhook endpoint for Razorpay events
   - Handle `payment.captured`, `payment.failed` events

3. **Email Notifications**
   - Send payment confirmation emails
   - Include transaction details and order summary

4. **Timeout Handling**
   - Mark payments as pending if verification fails
   - Retry mechanism for failed verifications

5. **Analytics**
   - Track payment success rates
   - Monitor payment method popularity
   - Refund statistics

---

## 📞 Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Razorpay Support:** https://support.razorpay.com/

---

**🎉 Your Razorpay integration is ready to go!**
