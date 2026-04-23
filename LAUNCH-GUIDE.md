# 🚀 SchemeFinder.in — Complete Launch Guide

**Everything you need to go from code to live website.**

---

## Step 1: Create Razorpay Account (10 min)

### 1.1 Sign Up
1. Go to **https://razorpay.com**
2. Click **Sign Up** (it's free)
3. Enter your email, phone number, and create password
4. Verify email and phone

### 1.2 Activate Account
1. Login to Razorpay Dashboard: **https://dashboard.razorpay.com**
2. Go to **Settings** → **Account & Settings**
3. Complete **KYC** (required to accept payments):
   - Upload PAN card
   - Upload Aadhaar card
   - Enter bank account details (where money goes)
   - Enter business details (use "Individual" if personal)
4. Wait for approval (usually instant, max 24 hours)

### 1.3 Get API Keys
1. Go to **Settings** → **API Keys**
2. Click **Generate Key**
3. Copy both:
   - **Key ID** (starts with `rzp_live_` or `rzp_test_`)
   - **Key Secret** (shown only once — save it!)
4. **Important**: You'll get TWO sets:
   - **Test Mode** keys (for testing) — `rzp_test_...`
   - **Live Mode** keys (for real payments) — `rzp_live_...`

### 1.4 Test Payment (Before Going Live)
Use these test credentials:
- **Test Card**: `4111 1111 1111 1111`
- **Expiry**: Any future date (e.g., 12/28)
- **CVV**: Any 3 digits (e.g., 123)
- **Test UPI**: `success@razorpay`

---

## Step 2: Update Code with Your Keys (5 min)

### 2.1 Update Razorpay Key

Open `js/payment.js` and find this line:
```js
RAZORPAY_KEY_ID: 'rzp_test_XXXXXXXXXXXXXX',
```

Replace with your actual key:
```js
RAZORPAY_KEY_ID: 'rzp_live_YOUR_ACTUAL_KEY_HERE',
```

### 2.2 Update Domain References

Search and replace these in ALL files:
- `yourdomain.com` → your actual domain (e.g., `schemefinder.in`)

Files to update:
- `index.html` (meta tags, OG tags, canonical URL)
- `robots.txt` (sitemap URL)
- `sitemap.xml` (all URLs)
- `README.md` (references)

### 2.3 Update Google Analytics (Optional)

In `js/cookies.js`, find:
```js
const GA_ID = 'G-XXXXXXXXXX';
```

Replace with your GA4 Measurement ID (get it from Google Analytics → Admin → Data Streams).

---

## Step 3: Deploy to Vercel (10 min)

### Option A: GitHub Auto-Deploy (Recommended)

1. Go to **https://vercel.com**
2. Click **Sign Up** → **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. Click **Add New Project**
5. Find `sarkari-yojna-finder` repo → Click **Import**
6. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave default)
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
7. Click **Environment Variables**:
   - Add: `RAZORPAY_KEY_SECRET` = your Razorpay key secret
8. Click **Deploy**
9. Wait ~30 seconds
10. Done! Your site is live at `https://sarkari-yojna-finder.vercel.app`

### Option B: CLI Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project directory)
cd sarkari-yojna
vercel

# Set environment variable
vercel env add RAZORPAY_KEY_SECRET
# Paste your Razorpay key secret when prompted

# Deploy to production
vercel --prod
```

### Option C: Drag & Drop

1. Go to **https://vercel.com/new**
2. Drag the entire `sarkari-yojna` folder
3. Set environment variables in Settings
4. Done!

---

## Step 4: Connect Custom Domain (15 min)

### 4.1 Buy a Domain
Recommended registrars:
- **Namecheap**: https://namecheap.com (~₹500-800/year for .in)
- **GoDaddy**: https://godaddy.com
- **Google Domains**: https://domains.google
- **Hostinger**: https://hostinger.in (cheapest)

Good domain ideas:
- `schemefinder.in`
- `yojnafinder.in`
- `sarkarischeme.in`
- `govermentschemes.in`
- `schemehelp.in`

### 4.2 Add Domain to Vercel
1. Go to your Vercel project → **Settings** → **Domains**
2. Enter your domain name (e.g., `schemefinder.in`)
3. Click **Add**
4. Vercel will show you DNS records to add

### 4.3 Configure DNS
Go to your domain registrar (Namecheap/GoDaddy/etc.) and add these DNS records:

**For apex domain (schemefinder.in):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.4 SSL Certificate
- Vercel automatically provisions SSL (HTTPS) — no action needed!
- Your site will be accessible at `https://schemefinder.in`

### 4.5 Verify
1. Wait 5-30 minutes for DNS propagation
2. Visit `https://schemefinder.in`
3. Check that HTTPS works (padlock icon in browser)

---

## Step 5: Update SEO & Meta Tags (5 min)

### 5.1 Update sitemap.xml
Replace `yourdomain.com` with your actual domain:
```xml
<loc>https://schemefinder.in/</loc>
```

### 5.2 Update robots.txt
```
Sitemap: https://schemefinder.in/sitemap.xml
```

### 5.3 Submit to Google
1. Go to **Google Search Console**: https://search.google.com/search-console
2. Add your property (domain or URL prefix)
3. Verify ownership (DNS record or HTML file)
4. Submit sitemap: `https://schemefinder.in/sitemap.xml`
5. Request indexing for homepage

### 5.4 Submit to Bing
1. Go to **Bing Webmaster Tools**: https://www.bing.com/webmasters
2. Add your site
3. Submit sitemap

---

## Step 6: Test Everything (10 min)

### 6.1 Test the Website
- [ ] Homepage loads correctly
- [ ] Form submits successfully
- [ ] Results appear with cards
- [ ] Card flip works (click/tap)
- [ ] Hindi/English switcher works
- [ ] Cookie banner appears
- [ ] Mobile responsive (check on phone)

### 6.2 Test Payment
1. Temporarily use test key: `rzp_test_XXXXXXXXXX`
2. Fill form → Search → Click "Unlock Now"
3. Use test card: `4111 1111 1111 1111`
4. Verify payment popup appears
5. Verify cards unlock after payment
6. Switch back to live key before launch

### 6.3 Test Admin Panel
1. Go to `https://yourdomain.com/admin`
2. Login with password: `admin123`
3. Check all sections load
4. Do a test search → verify it appears in admin
5. Change password in Settings

### 6.4 Test SEO
- [ ] View page source → check meta tags
- [ ] Check Open Graph: https://www.opengraph.xyz
- [ ] Check mobile-friendliness: https://search.google.com/test/mobile-friendly
- [ ] Check page speed: https://pagespeed.web.dev

---

## Step 7: Go Live Checklist

### Before Launch
- [ ] Razorpay account activated (KYC done)
- [ ] Live Razorpay key added to code
- [ ] Domain connected and SSL working
- [ ] Payment tested with test card
- [ ] Admin password changed from default
- [ ] All 67 schemes verified
- [ ] Hindi translations checked
- [ ] Mobile view tested
- [ ] Google Analytics set up (optional)
- [ ] Google Search Console set up

### After Launch
- [ ] Submit sitemap to Google
- [ ] Submit sitemap to Bing
- [ ] Share on Twitter/Reddit
- [ ] Share in WhatsApp groups
- [ ] Monitor admin dashboard daily

---

## Step 8: Marketing (Zero Budget)

### Day 1: Launch Day
**Twitter/X:**
```
I built a free tool that tells you which government schemes you qualify for.

Just enter your age, income, and occupation → get 30+ schemes you're eligible for.

🔗 https://schemefinder.in

PM-Kisan, Ayushman Bharat, PM Awas, Mudra Loan — check all in 30 seconds.

#SarkariYojana #GovernmentSchemes #India
```

**Reddit (r/india):**
```
Title: I built a free tool to check which government schemes you qualify for

After seeing so many people miss out on PM-Kisan, Ayushman Bharat, and other schemes, I built a simple tool.

You enter your details → it tells you which schemes you're eligible for → shows documents needed and apply links.

Currently tracking 67 schemes. Check it out: https://schemefinder.in

Would love feedback!
```

**Reddit (r/developersIndia):**
```
Title: Built a government scheme eligibility checker — tech stack + lessons learned

Stack: Static HTML/CSS/JS, Razorpay for payments, Vercel for hosting.

No framework, no backend. Just vanilla JS with a matching engine.

67 schemes, Hindi/English support, card flip UI, admin dashboard with analytics.

Live: https://schemefinder.in
```

### Day 2-3: WhatsApp Push
- Join 50+ Indian groups (family, community, local)
- Share: "Check if you're eligible for government schemes — free tool: https://schemefinder.in"
- Focus on family groups — people share with parents/grandparents

### Day 4-5: Content
- YouTube Short: "How to check all government schemes you qualify for in 30 seconds"
- Instagram Reel: Same content
- Write a blog post (Medium/LinkedIn) about the problem

### Day 6-7: Urgency
- "Last 2 days of launch pricing — ₹99 (will increase to ₹199)"
- Follow up on all social media posts

---

## Admin Panel Guide

### Access
- URL: `https://yourdomain.com/admin`
- Default Password: `admin123`
- **CHANGE THIS IMMEDIATELY** in Settings

### Features
| Section | What It Shows |
|---|---|
| Overview | Total searches, paid users, revenue, conversion rate |
| Daily Chart | Searches per day (last 7 days) |
| Top Schemes | Most matched schemes ranked |
| Demographics | Occupation, category, state, income breakdowns |
| Recent Searches | Last 50 searches with details |
| Payment History | All successful payments |
| Settings | Password, Razorpay key, price, GA ID |
| Export CSV | Download all data as spreadsheet |

### Changing Price
1. Go to Admin → Settings
2. Update Price field
3. Also update `js/payment.js`:
```js
PLAN_AMOUNT: 19900, // ₹199 in paise
```
4. Update HTML paywall text in `index.html`

---

## Troubleshooting

### Payment not working
- Check Razorpay key is correct (no extra spaces)
- Check `RAZORPAY_KEY_SECRET` is set in Vercel env vars
- Make sure you're using LIVE key for production
- Test with test card first

### Site not loading
- Check Vercel deployment status
- Check DNS propagation (use https://dnschecker.org)
- Clear browser cache

### Cards not flipping
- Check `css/flip.css` is loaded
- Check browser console for JS errors
- Test in incognito mode

### Admin panel not loading
- Check you're accessing `/admin` path
- Clear localStorage and try again
- Check browser console for errors

### Hindi not working
- Check `js/lang.js` is loaded
- Click the हिं button in header
- Check browser console for errors

---

## File Reference

```
sarkari-yojna/
├── index.html              ← Main website
├── admin/index.html        ← Admin dashboard
├── css/
│   ├── style.css           ← Main styles
│   ├── flip.css            ← Card flip animation
│   └── admin.css           ← Admin styles
├── js/
│   ├── lang.js             ← Hindi/English translations
│   ├── matcher.js          ← Eligibility matching engine
│   ├── app.js              ← Main app logic
│   ├── cookies.js          ← Cookie consent + analytics
│   ├── payment.js          ← Razorpay integration ← EDIT THIS
│   └── admin.js            ← Admin panel logic
├── data/
│   └── schemes.json        ← 67 schemes database
├── api/
│   └── verify-payment.js   ← Payment verification
├── vercel.json             ← Vercel config
├── robots.txt              ← SEO
├── sitemap.xml             ← SEO ← EDIT THIS
├── package.json            ← Project metadata
└── README.md               ← Documentation
```

---

## Quick Reference

| What | Where |
|---|---|
| Change Razorpay key | `js/payment.js` line 9 |
| Change admin password | Admin panel → Settings |
| Change price | `js/payment.js` + `index.html` |
| Add new scheme | `data/schemes.json` |
| Change domain | `index.html` + `sitemap.xml` + `robots.txt` |
| View analytics | `/admin` |
| Export data | Admin → Export CSV |

---

**You're ready to launch. Go make it happen! 🚀**
