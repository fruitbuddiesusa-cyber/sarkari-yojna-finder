# 🏛️ Sarkari Yojna Finder

**Find government schemes you're eligible for — in 30 seconds.**

A production-ready website that matches users against 30+ Indian government schemes based on their profile (age, income, occupation, category). Monetized via Razorpay paywall (₹99 to unlock all scheme details).

---

## 📁 Project Structure

```
sarkari-yojna/
├── index.html              # Main page (landing + form + results)
├── css/
│   └── style.css           # All styles (mobile-first, responsive)
├── js/
│   ├── matcher.js          # Scheme matching engine
│   ├── app.js              # Main application logic
│   ├── cookies.js          # Cookie consent + localStorage management
│   └── payment.js          # Razorpay integration
├── data/
│   └── schemes.json        # 30+ schemes with full eligibility data
├── api/
│   └── verify-payment.js   # Serverless payment verification (Vercel/Netlify)
├── robots.txt              # SEO — search engine directives
├── sitemap.xml             # SEO — sitemap for Google
├── vercel.json             # Vercel deployment config
├── package.json            # Project metadata
└── README.md               # This file
```

---

## 🚀 Quick Start (Local Development)

```bash
# Navigate to project directory
cd sarkari-yojna

# Start local server (no build needed — it's static HTML)
npx serve . -p 3000

# Open in browser
open http://localhost:3000
```

**No npm install. No build step. Just static files.**

---

## 🔧 Setup Checklist

### 1. Razorpay Payment (Required)

- [ ] Create Razorpay account: https://dashboard.razorpay.com
- [ ] Get API keys: Settings → API Keys → Generate Key
- [ ] Update `js/payment.js`:
  ```js
  RAZORPAY_KEY_ID: 'rzp_live_YOUR_KEY_HERE'
  ```
- [ ] Set environment variable on hosting:
  ```
  RAZORPAY_KEY_SECRET=your_key_secret_here
  ```

### 2. Domain (Required)

- [ ] Buy domain (recommended: `schemefinder.in`, `yojnafinder.in`, etc.)
- [ ] Point DNS to Vercel/Netlify
- [ ] Update `sitemap.xml` with your actual domain
- [ ] Update `robots.txt` with your actual domain
- [ ] Update `<meta>` tags in `index.html` with your domain

### 3. Google Analytics (Optional)

- [ ] Create GA4 property: https://analytics.google.com
- [ ] Update `js/cookies.js`:
  ```js
  const GA_ID = 'G-YOUR_MEASUREMENT_ID';
  ```

### 4. Deploy

See deployment section below.

---

## 🌐 Deploy to Vercel (Recommended)

### Option A: GitHub Integration (Auto-deploy)

1. Push this folder to a GitHub repository
2. Go to https://vercel.com/new
3. Import your repository
4. Set environment variable:
   - `RAZORPAY_KEY_SECRET` = your Razorpay key secret
5. Deploy!

### Option B: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd sarkari-yojna
vercel

# Set environment variable
vercel env add RAZORPAY_KEY_SECRET
```

### Option C: Drag & Drop

1. Go to https://vercel.com/new
2. Drag the `sarkari-yojna` folder
3. Set environment variables in dashboard
4. Done!

---

## 🌐 Deploy to Netlify

1. Go to https://app.netlify.com/drop
2. Drag the `sarkari-yojna` folder
3. Set environment variable in Site Settings → Environment:
   - `RAZORPAY_KEY_SECRET` = your key secret
4. For the serverless function, rename `api/verify-payment.js` to `netlify/functions/verify-payment.js`

---

## 💰 Revenue Model

| Tier | Price | What They Get |
|---|---|---|
| Free | ₹0 | See scheme names + benefit amounts (1st scheme fully visible) |
| Unlock All | ₹99 | Full details, documents, apply links for ALL matched schemes |

**Conversion target:** 3-5% of searchers pay ₹99

---

## 📊 Scheme Database

Currently tracking **30 schemes** across 10 categories:

| Category | Schemes | Examples |
|---|---|---|
| Agriculture | 5 | PM-Kisan, PMFBY, KCC, PM-KUSUM, PM-Kisan Maandhan |
| Health | 1 | Ayushman Bharat (PMJAY) |
| Housing | 2 | PMAY-Urban, PMAY-Gramin |
| Business | 4 | Mudra Loan, Stand-Up India, PM SVANidhi, Startup India |
| Education | 3 | NSP, PM-YASASVI, OBC Fellowship |
| Employment | 2 | PMKVY 4.0, PM-DAKSH |
| Pension | 4 | APY, PMVVY, NPS, PM-SYM |
| Savings | 1 | Sukanya Samriddhi |
| Welfare | 5 | Ujjwala, PMGKAY, ONORC, BBBP, PMAGY |
| Digital | 2 | PM-WANI, DILRMP |

### Adding New Schemes

Edit `data/schemes.json` and add a new entry:

```json
{
  "id": "scheme-slug",
  "name": "Scheme Full Name",
  "ministry": "Ministry Name",
  "category": "agriculture",
  "benefit": "₹X,XXX description",
  "benefitAmount": 50000,
  "benefitType": "cash",
  "description": "Full description...",
  "eligibility": {
    "occupation": ["farmer"],
    "maxIncome": 200000,
    "minAge": 18,
    "maxAge": 60,
    "gender": "all",
    "category": ["general", "obc", "sc", "st"],
    "states": "all"
  },
  "documents": ["Aadhaar Card", "Bank Account"],
  "applyLink": "https://scheme-portal.gov.in",
  "howToApply": "Instructions...",
  "deadline": "Ongoing",
  "isPopular": true
}
```

---

## 🔍 SEO Features

- ✅ Semantic HTML5
- ✅ Schema.org JSON-LD markup
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Sitemap.xml
- ✅ robots.txt
- ✅ Canonical URL
- ✅ Meta descriptions
- ✅ Mobile responsive
- ✅ Fast loading (no framework, minimal JS)

---

## 🔒 Security & Privacy

- ✅ No personal data stored on server
- ✅ Matching happens client-side (in browser)
- ✅ Cookie consent banner (DPDP Act compliant)
- ✅ Payment handled by Razorpay (PCI DSS compliant)
- ✅ Security headers via Vercel config
- ✅ No third-party trackers without consent

---

## 📱 Features

- ✅ Mobile-first responsive design
- ✅ 30+ government schemes
- ✅ Smart eligibility matching engine
- ✅ Blur/lock paywall for monetization
- ✅ Razorpay UPI/Card/NetBanking payments
- ✅ Cookie consent with GDPR/DPDP compliance
- ✅ Visitor counter (social proof)
- ✅ SEO optimized (Schema.org, OG, sitemap)
- ✅ Fast load time (no frameworks)
- ✅ Accessible (semantic HTML, ARIA-friendly)

---

## 🧪 Testing Payment (Test Mode)

1. Use Razorpay test key: `rzp_test_XXXXXXXXXXXXXX`
2. Use test card: `4111 1111 1111 1111`, any future date, any CVV
3. Or test UPI: `success@razorpay`

---

## 📈 Marketing Strategy (Zero Budget)

### Day 1-2: Build & Deploy
- Deploy to Vercel
- Set up Razorpay

### Day 3: Launch
- Twitter thread: "I built a tool that tells you which government schemes you qualify for"
- Reddit: r/india, r/developersIndia, r/IndianStockMarket
- Product Hunt launch

### Day 4-5: Viral
- WhatsApp groups (200+)
- YouTube Short / Instagram Reel
- Facebook groups

### Day 6-7: Urgency
- "Last 2 days of hackathon pricing — ₹99 (will increase to ₹299)"
- Follow up with everyone who visited but didn't pay

---

## 📄 License

MIT License — use freely for your hackathon.

---

**Built for the hackathon. Ship it. 🚀**
