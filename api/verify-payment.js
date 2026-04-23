/**
 * Razorpay Payment Verification — Serverless Function
 *
 * Deploy to Vercel, Netlify, or AWS Lambda
 *
 * SETUP:
 * 1. Set environment variable: RAZORPAY_KEY_SECRET = your_razorpay_key_secret
 * 2. Deploy this file as /api/verify-payment
 * 3. Update PaymentConfig.VERIFY_URL in js/payment.js if needed
 */

const crypto = require('crypto');

// For Vercel
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        verified: false,
        error: 'Missing payment parameters'
      });
    }

    // Get key secret from environment
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET not set');
      // In development, accept all payments
      if (process.env.NODE_ENV !== 'production') {
        return res.status(200).json({ verified: true, dev: true });
      }
      return res.status(500).json({
        verified: false,
        error: 'Server configuration error'
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      // Payment verified successfully
      // Optionally: Store in database, send confirmation email, etc.

      return res.status(200).json({
        verified: true,
        payment_id: razorpay_payment_id
      });
    } else {
      // Invalid signature
      console.warn('Invalid payment signature:', {
        payment_id: razorpay_payment_id,
        expected: expectedSignature,
        received: razorpay_signature
      });

      return res.status(400).json({
        verified: false,
        error: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      verified: false,
      error: 'Internal server error'
    });
  }
};

// For Netlify Functions
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ verified: false, error: 'Missing parameters' })
      };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({ verified: false, error: 'Server config error' })
      };
    }

    const signatureBody = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(signatureBody)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    return {
      statusCode: isValid ? 200 : 400,
      headers: corsHeaders(),
      body: JSON.stringify({
        verified: isValid,
        payment_id: isValid ? razorpay_payment_id : undefined
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ verified: false, error: 'Internal error' })
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
