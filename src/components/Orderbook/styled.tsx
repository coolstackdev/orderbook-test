import styled from 'styled-components'

type TextProps = {
  color?: string;
}

type ItemWrapperProps = {
  percent?: number;
  category?: 'bid' | 'ask';
  isPriceFirst?: boolean;
  deepChartRight?: boolean;
}

export const BookWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  background: #0a2c4d;
  padding: 5px;
`

export const BookHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background: #050b24;
  padding: 0 30px 0 10px;
  margin-bottom: 1px;

  p {
    color: white;
    font-size: 18px;
  }
`

export const BookContent = styled.div`
  background: #050b24;
  padding: 5px 0;
  display: flex;
  flex-wrap: wrap;

  & > div {
    width: 50%;
  }

  @media (max-width: 768px) {
    & > div {
      width: 100%;
    }
  }
`

export const ItemWrapper = styled.div<ItemWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center; 
  background: transparent;
  text-align: right;
  height: 30px;
  position: relative;

  &:after {
    content: "";
    width: ${props => props?.percent}%;
    background-color: ${props => props.category === 'bid' ? '#b52f2833' : '#62aa6233'};
    height: 30px;
    display: block;
    position: absolute;
    ${props => props.deepChartRight ? 'right: 0px;' : 'left: 0px;' }
  }
`



export const Text = styled.p<TextProps>`
  color: ${props => props.color ? props.color : 'white'};
  width: 30%;
  text-align: right;
  padding-right: 10px;
`