import { useMemo } from 'react';
export const TicketSelector = () => {
  return useMemo(() => (
    <select>
      <option value="0.5">0.5</option>
      <option value="1">1</option>
      <option value="2.5">2.5</option>
    </select>
  ), []);
};

export default TicketSelector