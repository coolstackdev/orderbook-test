import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useOrderbookState } from '../providers/OrderbookProvider';
import OrderItem from './OrderItem';

export const Orderbook = () => {
  const { state, dispatch } = useOrderbookState();

  const feedUrl = process.env.REACT_APP_FEED_URL || 'wss://www.cryptofacilities.com/ws/v1'
  const [socketUrl] = useState(feedUrl);
  const [socketOpen, setSocketOpen] = useState<boolean>(true)
  const [isBtc, setIsBtc] = useState<boolean>(true)

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
  }, [lastMessage])

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
      <br /><br />
      { state.asks ? <span>Asks: {JSON.stringify(state.asks)}</span> : null}
      <br/><br/>
      { state.bids ? <span>Bids: {JSON.stringify(state.bids)}</span> : null}
      <br/><br/>
      {lastMessage ? <span>Message: {lastMessage.data}</span> : null}
      <br />

  
      <div className="order-book">

      </div>
    </div>
  );
};

export default Orderbook