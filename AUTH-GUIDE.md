# 🔐 SchemeFinder.in — Complete Auth & Setup Guide

**How authentication works for users (payment) and you (admin panel).**

---

## Overview: Two Auth Systems

```
┌─────────────────────────────────────────────────┐
│  PUBLIC WEBSITE (yourdomain.com)                 │
│                                                   │
│  User visits → Fills form → Sees results         │
│       ↓                                           │
│  1st card FREE, rest LOCKED 🔒                   │
│       ↓                                           │
│  Clicks "Unlock ₹99" → Razorpay popup            │
│       ↓                                           │
│  Pays → Server verifies → Cards unlocked ✅       │
│       ↓                                           │
│  Unlock saved in localStorage (lifetime)          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ADMIN PANEL (yourdomain.com/admin)              │
│                                                   │
│  You visit → Enter password → Dashboard           │
│       ↓                                           │
│  See: searches, payments, demographics, charts    │
│       ↓                                           │
│  Session lasts 8 hours → Auto-logout              │
│       ↓                                           │
│  5 failed attempts → 5 min lockout                │
└─────────────────────────────────────────────────┘
```

---

## Part 1: User Auth (Payment Flow)

### How It Works

```
Step 1: User visits site
        → No auth needed
        → Can fill form and search for free

Step 2: User sees results
        → Card 1: UNLOCKED (free preview)
        → Cards 2-12: LOCKED with blur overlay

Step 3: User clicks "Unlock Now — ₹99"
        → Razorpay checkout popup opens
        → User pays via UPI/Card/NetBanking

Step 4: Payment success
        → Razorpay sends payment_id + signature
        → Your serverless function verifies signature
        → If valid → Returns { verified: true }

Step 5: Cards unlocked
        → Unlock status saved in localStorage
        → All cards now show full details
        → User can click "Apply Now" links
        → Unlock is LIFETIME (no expiry)
```

### What Gets Stored (User's Browser)

```javascript
// In localStorage (user's browser only)
{
  "scheme_finder_unlocked": {
    "unlocked": true,
    "paymentId": "pay_XXXXXXXXXXXXXX",
    "timestamp": 1713849600000
  },
  "scheme_finder_cookie_consent": "accepted",
  "scheme_finder_lang": "en"
}
```

**Important:** This data stays on the user's device. Your server never stores personal details.

### Payment Security Flow

```
User pays ₹99
      ↓
Razorpay processes payment
      ↓
Razorpay sends to YOUR server:
  - razorpay_payment_id
  - razorpay_order_id  
  - razorpay_signature (HMAC-SHA256)
      ↓
Your server (/api/verify-payment):
  - Computes expected signature using your SECRET key
  - Compares with received signature
  - If match → { verified: true }
  - If no match → { verified: false }
      ↓
Frontend unlocks cards only if verified
```

---

## Part 2: Admin Auth (Your Dashboard)

### How It Works

```
Step 1: You visit yourdomain.com/admin
        → Login form appears
        → Enter password

Step 2: Password checked
        → Compared with stored password
        → Default: "admin123"
        → Stored in localStorage (change via Settings)

Step 3: If correct
        → Session created in sessionStorage
        → Session has 8-hour timeout
        → Dashboard loads with all analytics

Step 4: If wrong
        → Error message shown
        → Remaining attempts displayed
        → After 5 failures → 5-minute lockout

Step 5: Session management
        → Auto-refresh every 30 seconds
        → Auto-logout after 8 hours
        → Logout button clears session
```

### Admin Security Features

| Feature | How It Works |
|---|---|
| Password | Stored in localStorage, changeable in Settings |
| Rate limiting | 5 failed attempts → 5 min lockout |
| Session timeout | 8 hours, then auto-logout |
| Session storage | Uses sessionStorage (cleared on browser close) |
| Noindex | Meta tags + robots.txt block search engines |
| CSP headers | Prevents unauthorized script execution |

---

## Part 3: Setup Checklist

### A. Razorpay Setup (Required for Payments)

```
1. Go to https://razorpay.com → Sign Up
2. Complete KYC (PAN + Aadhaar + Bank Account)
3. Go to Settings → API Keys → Generate Key
4. Copy Key ID (rzp_live_XXXXX)
5. Copy Key Secret (shown once — save it!)
```

### B. Update Code

**File: `js/payment.js`** — Line 9:
```javascript
// BEFORE (test mode)
RAZORPAY_KEY_ID: 'rzp_test_XXXXXXXXXXXXXX',

// AFTER (live mode)
RAZORPAY_KEY_ID: 'rzp_live_YOUR_ACTUAL_KEY',
```

### C. Deploy to Vercel

```
1. Go to https://vercel.com → Import GitHub repo
2. Add Environment Variable:
   Name:  RAZORPAY_KEY_SECRET
   Value: your_razorpay_key_secret_here
3. Deploy
```

### D. Test Payment Flow

```
1. Temporarily use TEST key (rzp_test_XXXXX)
2. Visit your site
3. Fill form → Search
4. Click "Unlock Now"
5. Use test card: 4111 1111 1111 1111
6. Verify cards unlock
7. Switch back to LIVE key
```

### E. Test Admin Panel

```
1. Go to yourdomain.com/admin
2. Login with: admin123
3. Do a search on main site
4. Return to admin → Check "Recent Searches"
5. Go to Settings → Change password
6. Logout → Login with new password
```

---

## Part 4: How Each Auth Component Works

### 4.1 Cookie Consent (`js/cookies.js`)

```javascript
// On first visit:
// → Shows cookie banner
// → User clicks "Accept" or "Reject"

// If accepted:
// → Loads Google Analytics
// → Tracks page views

// If rejected:
// → No analytics loaded
// → Only essential cookies used

// Stored:
localStorage.scheme_finder_cookie_consent = "accepted" | "rejected"
```

### 4.2 Payment Unlock (`js/payment.js`)

```javascript
// User clicks "Unlock Now"
// → Razorpay popup opens
// → User pays
// → handlePaymentSuccess() called

// verifyPayment():
// → POST to /api/verify-payment
// → Server checks HMAC-SHA256 signature
// → Returns { verified: true }

// unlockResults():
// → Saves to localStorage
// → Re-renders cards (unlocked)
// → Hides paywall
// → Shows success toast

// Stored:
localStorage.scheme_finder_unlocked = {
  unlocked: true,
  paymentId: "pay_XXXXX",
  timestamp: 1234567890
}
```

### 4.3 Admin Login (`js/admin.js`)

```javascript
// User submits password:
// → Check lockout status
// → Compare with stored password
// → If match: create session
// → If wrong: record attempt

// Session:
sessionStorage.scheme_finder_admin_auth = {
  authenticated: true,
  timestamp: 1234567890
}

// Rate limiting:
localStorage.scheme_finder_lockout = {
  attempts: 3,
  lockedUntil: null
}

// On 5th failure:
localStorage.scheme_finder_lockout = {
  attempts: 0,
  lockedUntil: 1234568000000  // 5 min from now
}
```

### 4.4 Language Switch (`js/lang.js`)

```javascript
// User clicks EN or हिं button
// → Saves preference
// → Applies translations to all [data-i18n] elements

// Stored:
localStorage.scheme_finder_lang = "en" | "hi"
```

---

## Part 5: Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                        │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Form Data   │  │  Payment    │  │  Language    │          │
│  │  (temporary) │  │  (lifetime) │  │  (lifetime)  │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         ↓                ↓                ↓                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              localStorage                            │     │
│  │  - scheme_finder_unlocked: { unlocked: true }       │     │
│  │  - scheme_finder_cookie_consent: "accepted"          │     │
│  │  - scheme_finder_lang: "en"                          │     │
│  │  - scheme_finder_analytics: { searches, payments }   │     │
│  │  - scheme_finder_settings: { password, price }       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              sessionStorage                          │     │
│  │  - scheme_finder_admin_auth: { authenticated }       │     │
│  │  - sf_session: "abc123"                              │     │
│  └─────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      YOUR SERVER (Vercel)                     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  /api/verify-payment.js                              │     │
│  │  - Receives: payment_id, signature                   │     │
│  │  - Uses: RAZORPAY_KEY_SECRET (env var)               │     │
│  │  - Returns: { verified: true/false }                 │     │
│  │  - Does NOT store any user data                      │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Environment Variables                               │     │
│  │  - RAZORPAY_KEY_SECRET: "your_secret_key"            │     │
│  └─────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    RAZORPAY SERVERS                           │
│                                                               │
│  - Processes payment                                         │
│  - Sends payment_id + signature to your server               │
│  - Handles UPI/Card/NetBanking                               │
│  - PCI DSS compliant                                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Part 6: Testing Checklist

### Test Payment Auth
- [ ] Switch to test key (`rzp_test_XXXXX`)
- [ ] Fill form → Search → Click "Unlock"
- [ ] Payment popup appears
- [ ] Use test card: `4111 1111 1111 1111`
- [ ] Cards unlock after payment
- [ ] Refresh page → Cards still unlocked (localStorage)
- [ ] Clear localStorage → Cards locked again
- [ ] Switch back to live key

### Test Admin Auth
- [ ] Go to `/admin`
- [ ] Try wrong password → Error shown
- [ ] Try wrong password 5 times → Lockout message
- [ ] Wait 5 minutes → Can try again
- [ ] Enter correct password → Dashboard loads
- [ ] Wait 8 hours → Session expires, must re-login
- [ ] Click Logout → Returns to login screen

### Test Cookie Consent
- [ ] Clear localStorage
- [ ] Visit site → Cookie banner appears
- [ ] Click "Accept" → Banner disappears, analytics loads
- [ ] Refresh → Banner doesn't appear again
- [ ] Clear localStorage → Visit → Banner appears again

### Test Language Switch
- [ ] Click "हिं" → All text changes to Hindi
- [ ] Click "EN" → All text changes to English
- [ ] Refresh → Language preference saved
- [ ] Search → Results show in selected language

---

## Part 7: Changing Settings

### Change Admin Password
```
1. Go to /admin
2. Login with current password
3. Go to Settings section
4. Enter new password
5. Click "Update"
6. Logout and login with new password
```

### Change Payment Price
```
1. Open js/payment.js
2. Find: PLAN_AMOUNT: 9900
3. Change to new amount in paise (e.g., 19900 for ₹199)
4. Update text in index.html (search for "₹99")
5. Commit and push to GitHub
6. Vercel auto-deploys
```

### Change Razorpay Key
```
1. Open js/payment.js
2. Find: RAZORPAY_KEY_ID: 'rzp_live_XXXXX'
3. Replace with new key
4. Go to Vercel → Settings → Environment Variables
5. Update RAZORPAY_KEY_SECRET
6. Redeploy
```

---

## Part 8: Troubleshooting

| Problem | Solution |
|---|---|
| Payment popup doesn't appear | Check Razorpay key is correct, check browser console |
| Payment succeeds but cards don't unlock | Check `/api/verify-payment` endpoint, check Vercel logs |
| Admin login says "Incorrect password" | Check you're using the right password, try default `admin123` |
| Admin locked out | Wait 5 minutes, then try again |
| Session expires quickly | Normal — 8 hour timeout, just re-login |
| Cookie banner keeps appearing | Check localStorage is enabled in browser |
| Hindi not switching | Check `js/lang.js` is loaded, check browser console |

---

## Summary

| System | Auth Method | Storage | Timeout |
|---|---|---|---|
| User Payment | Razorpay + HMAC verification | localStorage | Lifetime |
| Admin Panel | Password + session | sessionStorage | 8 hours |
| Cookie Consent | User choice | localStorage | Lifetime |
| Language | User preference | localStorage | Lifetime |

**Everything is set up and ready. Just add your Razorpay key and deploy!** 🚀
