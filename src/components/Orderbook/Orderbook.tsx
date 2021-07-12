import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useOrderbookState } from '../../providers/OrderbookProvider';
import TableHeader from './TableHeader'
import OrderItem from './OrderItem';
import TicketSelector from './TicketSelector';
import { BookWrapper, BookHeader, BookContent } from './styled';

export const Orderbook = () => {
  const { state, dispatch } = useOrderbookState();

  const feedUrl = process.env.REACT_APP_FEED_URL || 'wss://www.cryptofacilities.com/ws/v1'
  const [socketUrl] = useState(feedUrl);
  const [socketOpen, setSocketOpen] = useState<boolean>(true)
  const [isBtc, setIsBtc] = useState<boolean>(true)
  const { innerWidth } = window;

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, undefined, socketOpen);

  useEffect(() => {
    const data = lastMessage?.data
    if (data) {
      const feedData = JSON.parse(data)

      if (feedData.feed === 'book_ui_1_snapshot') {
        dispatch({ type: 'SET_ASKS', payload: feedData.asks })
        dispatch({ type: 'SET_BIDS', payload: feedData.bids })
      } else if (feedData.feed === 'book_ui_1' && feedData.product_id) {
        if (feedData.asks.length)
          dispatch({ type: 'UPDATE_ASKS', payload: feedData.asks })
        if (feedData.bids.length)
          dispatch({ type: 'UPDATE_BIDS', payload: feedData.bids })
      } else {
        console.log('error')
      }
    }
  }, [lastMessage, dispatch])

  // connection status
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // event handler
  const subscribeFeed = () => {
    return sendMessage(JSON.stringify({
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [isBtc ? "PI_XBTUSD" : "PI_ETHUSD"]
    }));
  }

  const unsubscribeFeed = () => {
    return sendMessage(JSON.stringify({
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [isBtc ? "PI_XBTUSD" : "PI_ETHUSD"]
    }));
  }

  // const toggleConnection = () => setSocketOpen(!socketOpen)

  // reverse bids array if mobile
  let bidsArray = state.arrBids.slice()
  if (innerWidth < 760) bidsArray = state.arrBids.slice().reverse()

  return (
    <div>
      <button
        onClick={subscribeFeed}
      >
        Subscribe feed
      </button>
      <button
        onClick={unsubscribeFeed}
      >
        Unsubscribe
      </button>
      <br /><br />
      <span>The WebSocket is currently {connectionStatus}</span>
  
      <BookWrapper>
        <BookHeader>
          <p>Order book</p>
          <TicketSelector />
        </BookHeader>
        <BookContent>
          <div>
            <TableHeader isPriceFirst={innerWidth <= 760} />
            {
              bidsArray.map((bid, index) => (
                <OrderItem
                  key={`bid-item-${bid[0]}`}
                  category='bid'
                  price={bid[0]}
                  size={bid[1]}
                  total={bid[2]}
                  totalSum={state.totalBid}
                  isMobile={innerWidth <= 760}
                />
              ))
            }
          </div>
          <div>
            { innerWidth > 760 ? <TableHeader isPriceFirst={true} /> : <br /> }
            {
              state.arrAsks.map((ask, index) => (
                <OrderItem
                  key={`ask-item-${ask[0]}`}
                  category='ask'
                  price={ask[0]}
                  size={ask[1]}
                  total={ask[2]}
                  totalSum={state.totalAsk}
                  isMobile={innerWidth <= 760}
                />
              ))
            }
          </div>
        </BookContent>
      </BookWrapper>
      <span>{lastMessage?.data}</span>
    </div>
  );
};

export default Orderbook