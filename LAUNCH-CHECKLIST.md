# ✅ SchemeFinder.in — Launch Checklist

**Follow this checklist in order. Check off each item as you complete it.**

---

## Phase 1: Razorpay Setup (15 min)

- [ ] Go to https://razorpay.com → Sign Up
- [ ] Login → Settings → Account & Settings
- [ ] Complete KYC:
  - [ ] Upload PAN card
  - [ ] Upload Aadhaar card
  - [ ] Enter bank account details
  - [ ] Enter business type (Individual)
- [ ] Wait for KYC approval (instant to 24hrs)
- [ ] Go to Settings → API Keys → Generate Key
- [ ] Copy **Key ID** (starts with `rzp_live_`)
- [ ] Copy **Key Secret** (shown only once — save it!)
- [ ] Test payment with test card: `4111 1111 1111 1111`

---

## Phase 2: Update Code (10 min)

### Razorpay Key
- [ ] Open `js/payment.js`
- [ ] Find: `RAZORPAY_KEY_ID: 'rzp_test_XXXXXXXXXXXXXX'`
- [ ] Replace with: `RAZORPAY_KEY_ID: 'rzp_live_YOUR_KEY'`

### Domain (do this after buying domain)
- [ ] Open `index.html` → Replace `yourdomain.com` with your domain
- [ ] Open `sitemap.xml` → Replace `yourdomain.com` with your domain
- [ ] Open `robots.txt` → Replace `yourdomain.com` with your domain

### Google Analytics (optional)
- [ ] Open `js/cookies.js`
- [ ] Find: `const GA_ID = 'G-XXXXXXXXXX'`
- [ ] Replace with your GA4 ID

---

## Phase 3: Deploy to Vercel (10 min)

- [ ] Go to https://vercel.com → Sign up with GitHub
- [ ] Click **Add New Project**
- [ ] Find `sarkari-yojna-finder` → Click **Import**
- [ ] Settings:
  - Framework: **Other**
  - Build Command: (leave empty)
  - Output Directory: (leave empty)
- [ ] Add Environment Variable:
  - Name: `RAZORPAY_KEY_SECRET`
  - Value: (paste your Razorpay key secret)
- [ ] Click **Deploy**
- [ ] Wait 30 seconds
- [ ] Site is live at `https://sarkari-yojna-finder.vercel.app`
- [ ] Test the live URL

---

## Phase 4: Buy & Connect Domain (15 min)

### Buy Domain
- [ ] Go to https://namecheap.com or https://hostinger.in
- [ ] Search for your domain (e.g., `schemefinder.in`)
- [ ] Purchase (~₹500-800/year)

### Connect to Vercel
- [ ] Vercel Dashboard → Your Project → Settings → Domains
- [ ] Add your domain (e.g., `schemefinder.in`)
- [ ] Copy the DNS records Vercel shows you

### Configure DNS
- [ ] Go to your domain registrar DNS settings
- [ ] Add A Record: `@` → `76.76.21.21`
- [ ] Add CNAME Record: `www` → `cname.vercel-dns.com`
- [ ] Wait 5-30 minutes for DNS propagation
- [ ] Visit `https://schemefinder.in` — should work with SSL

---

## Phase 5: Test Everything (15 min)

### Website
- [ ] Homepage loads correctly
- [ ] Form fills and submits
- [ ] Results appear with 67 schemes
- [ ] Card flip works (click cards)
- [ ] Hindi/English switcher works (हिं/EN buttons)
- [ ] Cookie banner appears on first visit
- [ ] Mobile view works (check on phone)

### Payment
- [ ] Switch to TEST key temporarily
- [ ] Fill form → Search → Click "Unlock Now"
- [ ] Payment popup appears
- [ ] Use test card: `4111 1111 1111 1111`
- [ ] Cards unlock after payment
- [ ] Switch back to LIVE key

### Admin Panel
- [ ] Go to `https://yourdomain.com/admin`
- [ ] Login with password: `admin123`
- [ ] Dashboard loads with stats
- [ ] Do a test search on main site
- [ ] Return to admin → search appears in "Recent Searches"
- [ ] Go to Settings → Change password
- [ ] Logout and login with new password

### SEO
- [ ] View page source → check meta tags present
- [ ] Test at https://www.opengraph.xyz
- [ ] Test at https://pagespeed.web.dev (should score 90+)
- [ ] Test mobile: https://search.google.com/test/mobile-friendly

---

## Phase 6: SEO Setup (10 min)

### Google
- [ ] Go to https://search.google.com/search-console
- [ ] Add property → Enter your domain
- [ ] Verify ownership (DNS or HTML file)
- [ ] Go to Sitemaps → Submit: `https://yourdomain.com/sitemap.xml`
- [ ] Go to URL Inspection → Request indexing for homepage

### Bing
- [ ] Go to https://www.bing.com/webmasters
- [ ] Add your site
- [ ] Submit sitemap

---

## Phase 7: Admin Panel Security (5 min)

- [ ] Login to admin panel
- [ ] Go to Settings
- [ ] Change password from `admin123` to something strong
- [ ] Save
- [ ] Note down new password somewhere safe

---

## Phase 8: Go Live! 🚀

### Final Checks
- [ ] Razorpay is in LIVE mode (not test)
- [ ] Domain works with HTTPS
- [ ] Payment works with real card/UPI
- [ ] Admin password changed
- [ ] All 67 schemes showing correctly
- [ ] Hindi/English working

### Share
- [ ] Twitter: Share your launch tweet
- [ ] Reddit: Post in r/india, r/developersIndia
- [ ] WhatsApp: Share in 10+ groups
- [ ] Product Hunt: Launch
- [ ] LinkedIn: Post about it

---

## 📊 After Launch (Daily)

- [ ] Check admin dashboard for new searches
- [ ] Check if any payments came in
- [ ] Respond to user feedback
- [ ] Share on social media again

---

## 🔧 Quick Reference

| What | Where |
|---|---|
| Change Razorpay key | `js/payment.js` line 9 |
| Change admin password | Admin → Settings |
| Change price | `js/payment.js` + `index.html` |
| Add new scheme | `data/schemes.json` |
| View analytics | `https://domain.com/admin` |
| Export data | Admin → Export CSV |

---

## 📁 Project Files

```
index.html           ← Main website
admin/index.html     ← Admin dashboard (your private analytics)
js/payment.js        ← Razorpay config (paste key here)
js/lang.js           ← Hindi/English translations
js/app.js            ← Main app logic
js/matcher.js        ← Eligibility matching engine
js/cookies.js        ← Cookie consent + GA
js/admin.js          ← Admin panel logic
css/style.css        ← Main styles
css/flip.css         ← Card flip animation
css/admin.css        ← Admin styles
data/schemes.json    ← 67 schemes database
api/verify-payment.js ← Payment verification
vercel.json          ← Deployment config
robots.txt           ← SEO
sitemap.xml          ← SEO
LAUNCH-GUIDE.md      ← Detailed guide
LAUNCH-CHECKLIST.md  ← This file
```

---

**You've got this. Follow the checklist, go live, and start getting users! 🚀**
