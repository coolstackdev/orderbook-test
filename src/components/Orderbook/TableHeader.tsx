import { useMemo } from 'react';
import { ItemWrapper, Text } from './styled';

export type TableHeaderProps = {
  isPriceFirst: boolean;
}

export const TableHeader = ({ isPriceFirst }: TableHeaderProps) => {
  return useMemo(() => (
    <ItemWrapper>
      <Text color='#aaa'>{ isPriceFirst ? 'Price' : 'Total'}</Text>
      <Text color='#aaa'>Size</Text>
      <Text color='#aaa'>{ isPriceFirst ? 'Total' : 'Price' }</Text>
    </ItemWrapper>
  ), [isPriceFirst]);
};

export default TableHeader