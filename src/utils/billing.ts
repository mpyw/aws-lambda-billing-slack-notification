import {
  CostExplorer,
  GetCostAndUsageCommandInput,
  GetCostAndUsageResponse,
} from '@aws-sdk/client-cost-explorer';
import { usd2jpy } from './currency';
import { Dayjs } from 'dayjs';

export type BillingOfServiceResult = {
  usd: number;
  jpy: number;
};
export type BillingOfServicesResult = Record<string, BillingOfServiceResult>;

const ce = new CostExplorer({ region: 'us-east-1' });

export const summary = async (
  start: Dayjs,
  end: Dayjs
): Promise<BillingOfServicesResult> => {
  const results = await Promise.all([
    request(start, end, true),
    request(start, end, false),
  ]);

  return Object.assign({}, ...results);
};

export const request = async (
  start: Dayjs,
  end: Dayjs,
  total: boolean
): Promise<BillingOfServicesResult> => {
  const params: GetCostAndUsageCommandInput = {
    TimePeriod: {
      Start: start.format('YYYY-MM-DD'),
      End: end.format('YYYY-MM-DD'),
    },
    GroupBy: [{ Key: 'SERVICE', Type: 'DIMENSION' }],
    Granularity: 'MONTHLY',
    Metrics: ['BlendedCost'],
  };

  if (total) {
    delete params.GroupBy;
  }

  const response = await ce.getCostAndUsage(params);
  return total ? handleTotal(response) : handleGroups(response);
};

const handleTotal = async ({
  ResultsByTime: [{ Total }] = [{}],
}: GetCostAndUsageResponse): Promise<BillingOfServicesResult> => {
  return {
    Total: {
      usd: Number(Total?.BlendedCost.Amount || 0),
      jpy: await usd2jpy(Total?.BlendedCost.Amount || 0),
    },
  };
};

const handleGroups = async ({
  ResultsByTime: [{ Groups }] = [{}],
}: GetCostAndUsageResponse): Promise<BillingOfServicesResult> => {
  const entries = await Promise.all(
    Groups?.map(
      async ({
        Keys: [Key] = [],
        Metrics: { BlendedCost: { Amount } } = {},
      }) => ({
        [Key]: {
          usd: Number(Amount || 0),
          jpy: await usd2jpy(Number(Amount || 0)),
        },
      })
    ) || []
  );

  return Object.assign({}, ...entries);
};
