import axios from 'axios';

type Quote = {
  open: string;
  currencyPairCode: string;
};
type Result = {
  quotes: Quote[];
};

let quotes: null | Quote[] = null;

export const convert = async (
  source: string | number,
  pair: string
): Promise<number> => {
  if (!quotes) {
    ({
      data: { quotes },
    } = await axios.get<Result>(
      'https://www.gaitameonline.com/rateaj/getrate'
    ));
  }
  const result = quotes.find(
    ({ currencyPairCode }) => currencyPairCode === pair
  );
  if (!result) {
    throw new Error('Failed to fetch currency rate');
  }
  return Number(source) * Number(result.open);
};

export const usd2jpy = async (usd: string | number): Promise<number> =>
  convert(usd, 'USDJPY');
