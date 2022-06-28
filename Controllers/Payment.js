const stripe = require("stripe")(process.env.stripe_secret_key);

exports.processPayment = async (req, res, next) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        company: "e-shop",
      },
    });

    res
      .status(200)
      .json({ success: true, client_secret: myPayment.client_secret });
  } catch (err) {}
};
exports.getStripeKey = async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, stripeKey: process.env.stripe_api_key });
};
