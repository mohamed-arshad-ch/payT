import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    try {
      // Step 1: Generate Expected Signature
      const key_secret = process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_SECRET; // Replace with your Razorpay Key Secret
      const generatedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      // Step 2: Compare Signatures
      if (generatedSignature === razorpay_signature) {
        // Payment verified successfully
        res.status(200).json({ success: true });
      } else {
        // Verification failed
        res.status(400).json({ success: false, error: 'Invalid signature' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
