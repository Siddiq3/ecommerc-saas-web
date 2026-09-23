import { formatMoney } from '@storekit/shared';

/** Money is integer paise everywhere in this system; format only at the edge. */
export function PriceText({ paise, className = '' }) {
  return <span className={className}>{formatMoney(paise)}</span>;
}
