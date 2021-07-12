type Indexable = { [label: string]: number };

export interface OrderbookState {
    asks: Indexable;
    bids: Indexable;
    arrAsks: number[][];
    arrBids: number[][];
    ticketSize: number;
    totalAsk: number;
    totalBid: number;
}

export type OrderbookActions =
    | { type: 'SET_ASKS', payload: number[][] }
    | { type: 'SET_BIDS', payload: number[][] }
    | { type: 'UPDATE_ASKS', payload: number[][] }
    | { type: 'UPDATE_BIDS', payload: number[][] }
    | { type: 'RESET_FEED' }
    | { type: 'SET_TICKET_SIZE', payload: number }  


const convertToArr = (hash: Indexable, category: 'ask' | 'bid', ticketSize: number) => {
    let total: number = 0;
    let length: number = 0;
    const result: number[][] = []

    let arrPrices = Object.keys(hash)

    // if `buy-side` reverse array because price is sorted as acendant
    if (category  === 'bid') {
        arrPrices.reverse()
    }
    for(let i = 0; i < arrPrices.length ; i++) {
        // restrict resultArray length after calculating based on ticketSize
        length++;
        if (length > 15) {
            break;
        }

        let price = arrPrices[i]
        total += Number(hash[price])
        result.push([Number(price) / 100, Number(hash[price]), total])
    }
    return {
        total,
        result
    }
}

export const orderbookReducer = (state: OrderbookState, action: OrderbookActions) => {
    let total: number = 0;
    let result: number[][] = [];

    switch (action.type) {
        case 'SET_ASKS':
            const asks: Indexable = {}
            if (action.payload.length) {
                action.payload.forEach(orderItem => {
                    asks[orderItem[0] * 100] = orderItem[1]
                })
            }

            // convert into array
            ({ total, result } = convertToArr(asks, 'ask', state.ticketSize));
            return {
                ...state,
                asks,
                totalAsk: total,
                arrAsks: result
            }
        case 'SET_BIDS':
            const bids: Indexable = {}
            if (action.payload.length) {
                action.payload.forEach(orderItem => {
                    bids[orderItem[0] * 100] = orderItem[1]
                })
            }

            // convert into array
            ({ total, result } = convertToArr(bids, 'bid', state.ticketSize));
            return {
                ...state,
                bids,
                totalBid: total,
                arrBids: result
            }
        case 'UPDATE_ASKS':
            const updatedAsks: Indexable = JSON.parse(JSON.stringify(state.asks))
            action.payload.forEach(orderItem => {
                if (Number(orderItem[1]) === 0)
                    delete updatedAsks[orderItem[0]]
                else
                    updatedAsks[orderItem[0] * 100] = orderItem[1]
            });

            // convert into array
            ({ total, result } = convertToArr(updatedAsks, 'ask', state.ticketSize));
            return {
                ...state,
                asks: updatedAsks,
                totalAsk: total,
                arrAsks: result
            }
        case 'UPDATE_BIDS':
            const updatedBids: Indexable = JSON.parse(JSON.stringify(state.bids))
            action.payload.forEach(orderItem => {
                if (Number(orderItem[1]) === 0)
                    delete updatedBids[orderItem[0]]
                else
                    updatedBids[orderItem[0] * 100] = orderItem[1]
            });

            // convert into array
            ({ total, result } = convertToArr(updatedBids, 'bid', state.ticketSize));
            return {
                ...state,
                bids: updatedBids,
                totalBid: total,
                arrBids: result
            }
        case 'RESET_FEED':
            return {
                ...state,
                asks: {},
                arrAsks: [],
                bids: {},
                arrBids: [],
                totalAsk: 0,
                totalBid: 0,
            }
        case 'SET_TICKET_SIZE':
            return {
                ...state,
                ticketSize: action.payload
            }
      default:
        return state
    }
  }
