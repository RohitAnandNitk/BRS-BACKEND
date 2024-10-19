const express = require('express');
const Stripe = require('stripe');
const Router = express.Router();

require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Secret key from your payment provider

Router.post('/payment', async (req, res) => {
  const { bicycleId, totalCost } = req.body;  // Receive bicycleId and amount
   


  console.log("Processing payment for bicycle:", bicycleId, "Amount: ₹", totalCost);

  try {
    // Create a payment session with Stripe or other gateway
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Bicycle Booking #${bicycleId}`,  // Use bicycleId in the description
            },
            unit_amount: totalCost * 100, // Amount in cents/paisa
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success/${bicycleId}`,  // Use bicycleId in URLs
      cancel_url: `http://localhost:3000/payment-failed/${bicycleId}`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});


module.exports = Router;
