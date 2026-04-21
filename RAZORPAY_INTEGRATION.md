# Razorpay Standard Checkout Integration ✅

## Summary

Razorpay payment integration has been **successfully configured** in your Node.js/Express + React codebase. The system is ready for payment processing.

---

## Files Modified / Created

### Backend Configuration
- **[backend/.env](backend/.env)** - Added Razorpay credentials
- **[backend/.env.example](backend/.env.example)** - Template for environment variables

### Frontend Configuration
- **[frontend/.env](frontend/.env)** - Added REACT_APP_RAZORPAY_KEY_ID
- **[frontend/.env.example](frontend/.env.example)** - Template for frontend environment

### Backend Implementation (Already in Place)
- **[backend/routes/orders.js](backend/routes/orders.js)** - Contains:
  - `POST /api/orders/create-razorpay-order` - Creates Razorpay order
  - `POST /api/orders/verify-razorpay-payment` - Verifies payment signature

### Frontend Implementation (Already in Place)
- **[frontend/src/pages/Payment.js](frontend/src/pages/Payment.js)** - Handles:
  - Loading Razorpay script
  - Opening payment modal
  - Processing payment response
  - Calling verification endpoint

---

## Credentials

```
RAZORPAY_KEY_ID:     rzp_test_Sg8yQDsk1JzFmp
RAZORPAY_KEY_SECRET: PhfQJCwM3lYXpPKXihIacDxh
```

**Security Note:** 
- KEY_SECRET is stored in `backend/.env` only
- KEY_ID is exposed in `frontend/.env` (safe - public key)
- Never commit `.env` files to git (already in `.gitignore`)

---

## Architecture Overview

### 1. Create Order (Backend)
```
Frontend → POST /api/orders
├─ Create Order in DB
├─ Deduct stock from products
└─ Return order_id + order details

Frontend → POST /api/orders/create-razorpay-order
├─ Call Razorpay API: POST https://api.razorpay.com/v1/orders
├─ Parameters: amount (paise), currency, receipt, notes
└─ Return: razorpayOrderId for checkout modal
```

### 2. Payment Modal (Frontend)
```
Frontend loads https://checkout.razorpay.com/v1/checkout.js
Opens Razorpay modal with:
├─ Order ID
├─ Amount in paise
├─ Customer name & email
├─ Contact phone
└─ Logo image

User sees payment methods:
├─ UPI
├─ Card
├─ Wallet
└─ NetBanking
```

### 3. Verify Payment (Backend)
```
Frontend receives:
├─ razorpay_payment_id
├─ razorpay_order_id
└─ razorpay_signature

Frontend → POST /api/orders/verify-razorpay-payment
├─ Verify signature: HMAC-SHA256(order_id|payment_id, KEY_SECRET)
├─ Update Order: paymentStatus = 'paid', status = 'processing'
├─ Update Payment: status = 'completed', transactionId = payment_id
└─ Return: success + order details
```

---

## Database Schema

### Order Model
```javascript
{
  _id: ObjectId,
  user: Ref(User),
  orderNumber: "SK...",
  items: [{product, name, image, price, quantity, seller}],
  shippingAddress: {fullName, phone, line1, line2, city, state, pincode},
  paymentMethod: "card", // or "cod", "upi", "wallet"
  paymentStatus: "paid", // or "pending", "failed", "refunded"
  totalAmount: 5999,
  status: "processing", // or "pending", "shipped", "delivered", "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Model
```javascript
{
  order: Ref(Order),
  user: Ref(User),
  amount: 5999,
  method: "card",
  status: "completed", // or "pending", "failed"
  transactionId: "pay_...",
  createdAt: Date,
  updatedAt: Date
}
```

---

## Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER CHECKOUT                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
                 1. Add Shipping Address
                 2. Select Payment Method
                              ↓
                 ┌────────────────────────┐
                 │  CREATE ORDER (Backend) │
                 │  - Save order to DB    │
                 │  - Deduct stock        │
                 │  - Clear cart          │
                 └────────────────────────┘
                              ↓
            ┌───────────────────────────────────┐
            │ CREATE RAZORPAY ORDER (Backend)   │
            │ Call Razorpay API v1/orders       │
            │ Return: razorpayOrderId           │
            └───────────────────────────────────┘
                              ↓
            ┌───────────────────────────────────┐
            │   RAZORPAY PAYMENT MODAL (Frontend)│
            │   User selects payment method     │
            │   User completes payment          │
            └───────────────────────────────────┘
                              ↓
            ┌───────────────────────────────────┐
            │   VERIFY PAYMENT (Backend)         │
            │   - Verify signature              │
            │   - Update order status           │
            │   - Update payment record         │
            └───────────────────────────────────┘
                              ↓
              ┌──────────────────────────┐
              │  SUCCESS / FAILURE        │
              │  Redirect to confirmation │
              │  or show error message    │
              └──────────────────────────┘
```

---

## How to Test

### Prerequisites
1. Ensure backend server is running: `npm run dev` (from backend/)
2. Ensure frontend app is running: `npm start` (from frontend/)
3. Ensure MongoDB is connected

### Test Steps

#### Step 1: Add Products to Cart
1. Open http://localhost:3000
2. Browse products and add to cart
3. Click "Cart" and verify items

#### Step 2: Checkout
1. Click "Checkout" button
2. Enter/select shipping address
3. Click "Continue to Payment"

#### Step 3: Complete Payment
1. Click on the payment method (UPI/Card recommended for testing)
2. Razorpay modal opens
3. Use test credentials (provided by Razorpay)
4. Complete the payment

#### Step 4: Verify Success
- After payment, you should see: "✅ Payment successful! Redirecting..."
- Redirected to Order Confirmation page with order details
- Order status should be "processing"
- Payment status should be "paid"

#### Step 5: Check Database
1. Verify Order document exists with:
   - `paymentStatus: "paid"`
   - `status: "processing"`
   - All items listed

2. Verify Payment document exists with:
   - `status: "completed"`
   - `transactionId: "pay_..." (Razorpay ID)`

---

## Test Credentials (Razorpay)

For testing UPI payments:
- VPA: success@razorpay
- Use any 6-digit OTP

For testing Card payments:
- Card Number: 4111111111111111
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits

For testing Wallet:
- Follow in-app instructions

---

## Error Handling

### Backend Error Cases
| Scenario | Response | Status |
|----------|----------|--------|
| Missing amount/orderId | `{error: 'Missing orderId or amount'}` | 400 |
| Razorpay API fails | `{error: 'Razorpay error message'}` | 500 |
| Signature mismatch | `{success: false, error: 'Invalid signature'}` | 400 |
| Order not found | `{success: false, error: 'Order not found'}` | 404 |

### Frontend Error Cases
| Scenario | User Experience |
|----------|-----------------|
| Script fails to load | "Failed to load Razorpay" error shown |
| Network timeout | "Payment failed" error message |
| User dismisses modal | "Payment cancelled" message |
| Payment fails | `payment.failed` event shows error description |

---

## Security Checklist ✅

- [x] RAZORPAY_KEY_ID in frontend .env (public, safe)
- [x] RAZORPAY_KEY_SECRET in backend .env only (never exposed)
- [x] .env files in .gitignore
- [x] Signature verification using HMAC-SHA256
- [x] Payment status updated only after signature verification
- [x] Unauthorized users blocked by `verifyCustomer` middleware
- [x] Amount verified on backend (prevents client-side manipulation)

---

## Deployment Notes

### For Vercel/Netlify Frontend
1. Add environment variables in deployment dashboard:
   - `REACT_APP_RAZORPAY_KEY_ID=rzp_test_Sg8yQDsk1JzFmp`
2. No need to add RAZORPAY_KEY_SECRET (server-side only)

### For Backend (Render/Heroku)
1. Add environment variables in deployment dashboard:
   - `RAZORPAY_KEY_ID=rzp_test_Sg8yQDsk1JzFmp`
   - `RAZORPAY_KEY_SECRET=PhfQJCwM3lYXpPKXihIacDxh`
   - `MONGO_URI=...`
   - `JWT_SECRET=...`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-frontend-domain.com`

2. Restart server after adding variables

---

## Production Checklist

Before going live, update:
1. Test credentials to production credentials
2. `NODE_ENV` to `production`
3. Currency validation (currently hardcoded to INR)
4. Payment method handling based on business logic
5. Webhook setup (optional: for handling payment events)

---

## Troubleshooting

### Issue: "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET"
**Solution:** Ensure `.env` file exists in backend/ with both credentials

### Issue: "Failed to load Razorpay"
**Solution:** Check browser console for script load errors. Razorpay CDN might be blocked.

### Issue: "Invalid signature"
**Solution:** Ensure RAZORPAY_KEY_SECRET is correct and order_id|payment_id format is exact

### Issue: Order created but payment modal doesn't open
**Solution:** Check REACT_APP_RAZORPAY_KEY_ID in frontend/.env is correct

### Issue: Payment verified but order status not updated
**Solution:** Check MongoDB connection and ensure Payment collection exists

---

## API Reference

### Create Order
```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer <customer_token>

{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "card",
  "items": [...],
  "subtotal": 5000,
  "shipping": 99,
  "total": 5099
}

Response:
{
  "_id": "order_id",
  "orderNumber": "SK...",
  "paymentStatus": "pending",
  "status": "pending",
  ...
}
```

### Create Razorpay Order
```http
POST /api/orders/create-razorpay-order
Content-Type: application/json
Authorization: Bearer <customer_token>

{
  "orderId": "order_id",
  "amount": 509900  // in paise
}

Response:
{
  "razorpayOrderId": "order_...",
  "amount": 509900,
  "currency": "INR"
}
```

### Verify Payment
```http
POST /api/orders/verify-razorpay-payment
Content-Type: application/json
Authorization: Bearer <customer_token>

{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "signature_hash",
  "orderId": "order_id"
}

Response:
{
  "success": true,
  "order": {...},
  "payment": {...}
}
```

---

## Support & Resources

- **Razorpay Docs:** https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
- **Test Credentials:** https://razorpay.com/docs/payments/payment-gateway/test-mode/
- **API Explorer:** https://razorpay.com/docs/api/
- **Dashboard:** https://dashboard.razorpay.com

---

## Next Steps (Optional)

1. **Email Receipts:** Send order confirmation email after payment success
2. **Webhooks:** Setup Razorpay webhooks for real-time payment notifications
3. **Refunds:** Implement refund functionality via Razorpay API
4. **Analytics:** Track payment methods & success rates
5. **Subscription Payments:** Add subscription plan support

---

**Status:** ✅ READY FOR TESTING & DEPLOYMENT

Generated: April 21, 2026
