import React from 'react';
import styled from 'styled-components'

export type OrderItemProps = {
  price: string;
  size: string;
  total: string;
}

type TextProps = {
  green?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; 
  background: transparent;
  text-align: right;
  padding: 0 10px;
`

const Text = styled.p<TextProps>`
  color: ${props => props.green ? 'green' : 'white'};
`

export const OrderItem = ({price, size, total}: OrderItemProps) => {
  return (
    <Wrapper>
      <Text green>{ price }</Text>
      <Text>{ size }</Text>
      <Text>{ total }</Text>
    </Wrapper>
  );
};

export default OrderItem