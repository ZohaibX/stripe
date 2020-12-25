import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import keys from './config/keys';
import axios from './Services/HTTP-Services/axios';

import StripeCheckout from 'react-stripe-checkout';

function App() {
  const [product, setproduct] = useState({
    name: 'React from FB',
    price: 10, // this is in cents
    productBy: 'Facebook',
  }); //? obviously this all must not be hard coated

  const makePayment = async (token) => {
    //? we will get token by default
    const body = {
      token,
      product,
    };

    try {
      const response = await axios.post('http://localhost:4000/payment', body);
      console.log(response);
      return response;
    } catch (error) {
      console.log('error coming from post method frontend: ', error);
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />

        <br />
        <StripeCheckout
          stripeKey={keys.stripePublisherKey} // publisher key
          token={makePayment}
          name='Buy React'
          amount={product.price * 100} // to get amount on dollars
        >
          <button className='btn-large blue'>Make Your Payment</button>
          {/* this is how we can use our own button -- otherwise we have a cool looking button by default */}
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
