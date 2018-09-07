# AWS Lambda Billing Slack Notification

Node.js 8.0 以降向けのAWS当月利用料金Slack通知スクリプト

![実行例](https://user-images.githubusercontent.com/1351893/45200732-2387f880-b2ad-11e8-8f22-be0ee86c9193.png)

## 使い方

1. AWS Lambda に `src` のファイルをすべてインポート
2. `src/config.js` で設定項目を編集
3. AWS Lambda が `es:GetCostAndUsage` を使えるように権限を割り当てる
4. 毎日1回，適当な時刻に実行するように設定

絵文字は会社で使っているやつに合わせているので各自修正必須です
