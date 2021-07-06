type Indexable = { [label: string]: number };

export interface OrderbookState {
    asks: Indexable;
    bids: Indexable;
}

export type OrderbookActions =
    |   { type: 'SET_ASKS', payload: number[][] }
    |   { type: 'SET_BIDS', payload: number[][] }
    |   { type: 'UPDATE_ASKS', payload: number[][] }
    |   { type: 'UPDATE_BIDS', payload: number[][] }

export const orderbookReducer = (state: OrderbookState, action: OrderbookActions) => {
    switch (action.type) {
        case 'SET_ASKS':
            const asks: Indexable = {}
            if (action.payload.length) {
                action.payload.forEach(orderItem => {
                    asks[orderItem[0] * 100] = orderItem[1]
                })
            }
            return {
                ...state,
                asks
            }
        case 'SET_BIDS':
            const bids: Indexable = {}
            if (action.payload.length) {
                action.payload.forEach(orderItem => {
                    bids[orderItem[0] * 100] = orderItem[1]
                })
            }
            return {
                ...state,
                bids
            }
        case 'UPDATE_ASKS':
            const updatedAsks: Indexable = state.asks
            action.payload.forEach(orderItem => {
                if (orderItem[1] === 0)
                    delete updatedAsks[orderItem[0]]
                else
                    updatedAsks[orderItem[0] * 100] = orderItem[1]
            });
            return {
                ...state,
                asks: updatedAsks
            }
        case 'UPDATE_BIDS':
            const updatedBids: Indexable = state.bids
            action.payload.forEach(orderItem => {
                if (orderItem[1] === 0)
                    delete updatedBids[orderItem[0]]
                else
                    updatedBids[orderItem[0] * 100] = orderItem[1]
            });
            return {
                ...state,
                bids: updatedBids
            }
      default:
        return state
    }
  }
