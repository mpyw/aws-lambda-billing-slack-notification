const postAsync = require('./postAsync');
const getBillingOfServices = require('./getBillingOfServices');
const {
  channel, webhookUrl, emoji, aliases,
} = require('./config');

exports.handler = async () => {
  const fields = await Promise.all([true, false].map(getBillingOfServices))
    .filter(([, billing]) => Math.floor(billing / 100) * 100 > 0)
    .sort(([x, a], [y, b]) => {
      if (x === 'Total') return 0;
      if (y === 'Total') return 1;
      if (x === 'Tax') return 0;
      if (y === 'Tax') return 1;
      return (a < b) - (a > b);
    })
    .map(([service, billing]) => ({
      title: `${aliases[service] || service} ${emoji[service] || emoji.Default}`,
      value: `${Math.floor(billing / 100) * 100}円`,
      short: true,
    }));

  const params = {
    channel,
    username: 'AWS',
    icon_emoji: ':aws:',
    attachments: [{
      fallback: `今月のAWSの利用費は${fields[0].value}です。`,
      pretext: '今月のAWSの利用費は…',
      color: 'good',
      fields,
    }],
  };

  await postAsync(webhookUrl, JSON.stringify(params));
};
