import React from 'react';
import Orderbook from '../components/Orderbook/Orderbook';
import { OrderbookProvider } from '../providers/OrderbookProvider';

function Home() {
  return (
    <OrderbookProvider>
      <Orderbook />
    </OrderbookProvider>
  );
}

export default Home;
