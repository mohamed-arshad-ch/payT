import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
        key_secret: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_SECRET,
      });

   
      const { amount, currency, receipt } = req.body; // Data passed from frontend
      const order = await razorpay.orders.create({
        amount: Math.floor(amount) || 0, // Amount in paise (₹500 default)
        currency: currency || 'INR',
        receipt: receipt || `receipt_${Math.random().toString(36).substr(2, 9)}`,
      });

      res.status(200).json(order); // Return order details to frontend
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
