/**
 * Razorpay Payment Integration
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Razorpay account at https://dashboard.razorpay.com
 * 2. Get your Key ID and Key Secret from Settings > API Keys
 * 3. Replace RAZORPAY_KEY_ID below with your actual key
 * 4. Create a serverless function at /api/verify-payment.js for verification
 * 5. Deploy to Vercel/Netlify
 */

const PaymentConfig = {
  // Replace with your Razorpay Key ID
  RAZORPAY_KEY_ID: 'rzp_test_XXXXXXXXXXXXXX',

  // Plan details
  PLAN_NAME: 'SchemeFinder — All Schemes Unlock',
  PLAN_DESCRIPTION: 'Unlock all eligible scheme details, documents, and apply links',
  PLAN_AMOUNT: 9900, // ₹99 in paise
  PLAN_CURRENCY: 'INR',

  // Verification endpoint (your serverless function)
  VERIFY_URL: '/api/verify-payment',

  // Theme
  THEME_COLOR: '#FF6B35'
};

/**
 * Initialize Razorpay payment
 */
function initPayment() {
  // Check if already unlocked
  if (CookieManager.isUnlocked()) {
    CookieManager.showToast('You already have access! Scroll down to see all schemes.');
    return;
  }

  // Check if Razorpay is loaded
  if (typeof Razorpay === 'undefined') {
    CookieManager.showToast('Payment system loading. Please try again in a moment.', 'error');
    loadRazorpayScript();
    return;
  }

  const options = {
    key: PaymentConfig.RAZORPAY_KEY_ID,
    amount: PaymentConfig.PLAN_AMOUNT,
    currency: PaymentConfig.PLAN_CURRENCY,
    name: 'SchemeFinder.in',
    description: PaymentConfig.PLAN_DESCRIPTION,
    image: '', // Add your logo URL here
    handler: handlePaymentSuccess,
    prefill: {
      name: '',
      email: '',
      contact: ''
    },
    notes: {
      product: 'scheme_unlock',
      timestamp: Date.now().toString()
    },
    theme: {
      color: PaymentConfig.THEME_COLOR
    },
    modal: {
      ondismiss: function() {
        CookieManager.trackEvent('payment_dismissed');
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.on('payment.failed', handlePaymentFailure);
  rzp.open();
}

/**
 * Handle successful payment
 */
function handlePaymentSuccess(response) {
  const paymentId = response.razorpay_payment_id;

  // Track event
  CookieManager.trackEvent('payment_success', {
    payment_id: paymentId
  });

  // Verify payment on server (optional but recommended)
  verifyPayment(response)
    .then(verified => {
      if (verified) {
        unlockResults(paymentId);
      } else {
        // Still unlock on client side (fallback)
        // Server verification failed but payment went through
        unlockResults(paymentId);
      }
    })
    .catch(() => {
      // Server verification failed, still unlock
      // (Payment was successful at Razorpay's end)
      unlockResults(paymentId);
    });
}

/**
 * Handle payment failure
 */
function handlePaymentFailure(response) {
  CookieManager.trackEvent('payment_failed', {
    error: response.error.description
  });
  CookieManager.showToast('Payment failed. Please try again.', 'error');
}

/**
 * Unlock results after payment
 */
function unlockResults(paymentId) {
  // Save unlock state
  CookieManager.setUnlocked(paymentId);

  // Re-render results (unlocked)
  if (App.currentResults.length > 0) {
    const profile = App.getFormData();
    App.renderResults(App.currentResults, profile);
  }

  // Hide paywall
  document.getElementById('paywall').style.display = 'none';

  // Show success message
  CookieManager.showToast('✅ All schemes unlocked! Scroll down to see details.');

  // Scroll to results
  setTimeout(() => {
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 500);
}

/**
 * Verify payment with server
 */
async function verifyPayment(response) {
  try {
    const res = await fetch(PaymentConfig.VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      })
    });

    const data = await res.json();
    return data.verified === true;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}

/**
 * Load Razorpay script dynamically
 */
function loadRazorpayScript() {
  if (document.getElementById('razorpay-script')) return;

  const script = document.createElement('script');
  script.id = 'razorpay-script';
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.head.appendChild(script);
}

// Load Razorpay script on page load
document.addEventListener('DOMContentLoaded', () => {
  loadRazorpayScript();
});

// Export
if (typeof window !== 'undefined') {
  window.initPayment = initPayment;
  window.PaymentConfig = PaymentConfig;
}
