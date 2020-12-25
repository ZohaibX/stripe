const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

//! https://stripe.com/docs/api

// TODO: Add a stripe key
const stripe = require('stripe')(keys.stripeSecretKey);
const { v4: uuid } = require('uuid');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.post('/payment', async (req, res) => {
  const { product, token } = req.body;
  console.log('PRODUCT is: ' + product);
  console.log('price is: ' + product.price);

  const idempotencyKey = uuid(); // to be unique

  //! token is something automatically generated from the client side and sent to here

  let customer;
  try {
    customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
  } catch (error) {
    console.log('Error coming from creating customer: ' + error);
  }

  let chargesResult;
  try {
    chargesResult = await stripe.charges.create(
      {
        amount: product.price * 100, // bcoz we are gonna send the price in cents
        currency: 'usd', // i can read the docs for other currencies
        customer: customer.id,
        receipt_email: token.email, //? optional property
        description: `purchase of ${product.name}`, //? optional property
        shipping: {
          //? optional property -- and all there hard coated properties should come from client
          name: 'Jenny Rosen',
          address: {
            line1: '1234 Main Street',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
            postal_code: '94111',
          },
        },
      },
      { idempotencyKey } //? name of the key must be idempotencyKey
    );
  } catch (error) {
    console.log('Error coming from creating charges: ' + error);
  }

  res.status(200).json(chargesResult);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
