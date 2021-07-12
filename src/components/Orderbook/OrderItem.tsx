import { useMemo } from 'react';
import { ItemWrapper, Text } from './styled';

export type OrderItemProps = {
  category: 'bid' | 'ask';
  price: number;
  size: number;
  total: number;
  totalSum: number;
  isMobile: boolean;
}

export const OrderItem = ({category, price, size, total, totalSum, isMobile}: OrderItemProps) => {
  const deepChartRight = useMemo(() => {
    return isMobile || (!isMobile && category === 'bid')
  }, [isMobile, category])

  const isPriceFirst = useMemo(() => {
    return isMobile || (!isMobile && category === 'ask')
  }, [isMobile, category])

  return useMemo(() => (
    <ItemWrapper percent={total / totalSum * 100} category={category} deepChartRight={deepChartRight}>
      {
        isPriceFirst ? <Text color='green'>{ price.toFixed(2) }</Text> : <Text>{ total }</Text>
      }
      <Text>{ size }</Text>
      {
        isPriceFirst ? <Text>{ total }</Text> : <Text color='green'>{ price.toFixed(2) }</Text>
      }
    </ItemWrapper>
  ), [price, size, total, totalSum, category, deepChartRight, isPriceFirst]);
};

export default OrderItem
