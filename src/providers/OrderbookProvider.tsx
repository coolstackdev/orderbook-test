import React, { useReducer, createContext, useContext, Dispatch } from 'react'
import { OrderbookActions, OrderbookState, orderbookReducer } from '../reducers/orderbook'

interface OrderbookContextProps {
  state: OrderbookState;
  dispatch: Dispatch<OrderbookActions>;
}

const initialState: OrderbookState = {
  asks: {},
  bids: {}
}

export const OrderbookContext = createContext({} as OrderbookContextProps)

export const OrderbookProvider = (props: any) => {
  const [state, dispatch] = useReducer(orderbookReducer, initialState)
  const value = { state, dispatch }

  return <OrderbookContext.Provider value={value}>{props.children}</OrderbookContext.Provider>
}

export const useOrderbookState = () => useContext(OrderbookContext)
