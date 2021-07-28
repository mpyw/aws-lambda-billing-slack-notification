import * as config from '../config';
import { billing } from '../util';
import { ScheduledHandler } from 'aws-lambda';
import dayjs, { Dayjs } from 'dayjs';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';
import { BillingOfServiceResult } from '../util/billing';
import { slackOptions } from '../config';

const envs = {
  ACCOUNT_NAME: process.env.ACCOUNT_NAME as string,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
} as const;

const now = dayjs();

export const handler: ScheduledHandler = async () => {
  if (!envs.SLACK_WEBHOOK_URL) {
    throw new Error('Missing environment variable: SLACK_WEBHOOK_URL');
  }

  const { start, end } = prepareDates();

  const summary = await billing.summary(start, end);

  const fields = Object.entries(summary)
    .filter(ignoreSmallAmountFilter)
    .sort(sortComparator)
    .map(([service, { usd, jpy }]) => ({
      title: `${
        config.serviceAliases[service as keyof typeof config.serviceAliases] ||
        service
      } ${
        config.serviceEmoji[service as keyof typeof config.serviceEmoji] ||
        ':question:'
      }`,
      value: `${Math.floor(jpy / 100) * 100}円 ($${
        Math.floor(usd * 100) / 100
      })`,
      short: true,
    }));

  const slack = new IncomingWebhook(envs.SLACK_WEBHOOK_URL);
  const { text } = await slack.send(preparePayload(envs.ACCOUNT_NAME, fields));

  console.log(text);
};

const preparePayload = (
  accountName: string,
  fields: Exclude<
    Required<IncomingWebhookSendArguments>['attachments'][number]['fields'],
    undefined
  >
): IncomingWebhookSendArguments => {
  const previousMonth = `${now.subtract(1, 'month').month()}月`;
  const whose = accountName ? ` ${accountName} の` : '';

  const messages = isStarting()
    ? {
        fallback: `${previousMonth}の${whose} AWS 利用費は ${fields[0]?.value} です。`,
        pretext: `${previousMonth}の${whose} AWS 利用費が確定しました`,
        color: '#e0a837',
      }
    : {
        fallback: `今月の${whose} AWS 利用費は ${fields[0]?.value} です。`,
        pretext: `今月の${whose} AWS 利用費は…`,
        color: 'good',
      };

  return {
    ...slackOptions,
    attachments: [
      {
        ...messages,
        fields,
      },
    ],
  };
};

const isStarting = (): boolean => {
  return now.startOf('date').isSame(now.startOf('month'));
};

const prepareDates = (): Record<'start' | 'end', Dayjs> => {
  let start = now.startOf('month');
  let end = start.add(1, 'month');

  if (isStarting()) {
    start = start.subtract(1, 'month');
    end = end.subtract(1, 'month');
  }

  return { start, end };
};

const ignoreSmallAmountFilter = ([, { jpy }]: [
  unknown,
  BillingOfServiceResult
]): boolean => {
  return Math.floor(jpy / 100) * 100 > 0;
};

const sortComparator = (
  [x, { jpy: a }]: [string, BillingOfServiceResult],
  [y, { jpy: b }]: [string, BillingOfServiceResult]
): number => {
  if (x === 'Total') return 0;
  if (y === 'Total') return 1;
  if (x === 'Tax') return 0;
  if (y === 'Tax') return 1;
  return Number(a < b) - Number(a > b);
};
