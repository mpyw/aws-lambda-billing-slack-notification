# AWS Lambda Billing Slack Notification

Node.js 14 以降向けの AWS 当月利用料金 Slack 通知スクリプト

![実行例](https://user-images.githubusercontent.com/1351893/45200732-2387f880-b2ad-11e8-8f22-be0ee86c9193.png)

## 環境構築手順

1. [Serverless Getting Started Guide](https://www.serverless.com/framework/docs/getting-started/) を参考に， Serverless Framework をグローバルインストール
2. `npm i`　を実行

## 設定

絵文字は会社で使っているやつに合わせているので，各自 **[src/config.ts](./src/config.ts)** の修正は必須です。

## 使い方

### TypeScript のビルド

```bash
npm run build
```

### デプロイを実行

```bash
# 単一アカウント
SLACK_WEBHOOK_URL='https://...' npm run deploy

# 複数アカウント
SLACK_WEBHOOK_URL='https://...' AWS_PROFILE=xxxxx ACCOUNT_NAME=アカウントX npm run deploy
SLACK_WEBHOOK_URL='https://...' AWS_PROFILE=yyyyy ACCOUNT_NAME=アカウントY npm run deploy
```
