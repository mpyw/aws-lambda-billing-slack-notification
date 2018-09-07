const channel = '#general';
const webhookUrl  = 'https://hooks.slack.com/services/XXXXXXXXXXXXXXXXXX';

const emoji = {
  'Default': ':question:',
  'Total': ':money_with_wings:',
  'AWS CloudTrail': ':aws-cloudwatch:',
  'AWS Direct Connect': ':handshake:',
  'AWS Key Management Service': ':key:',
  'AWS Lambda': ':lambda:',
  'Amazon CloudFront': ':lightning:',
  'Amazon EC2 Container Registry (ECR)': ':docker:',
  'Amazon ElastiCache': ':redis:',
  'EC2 - Other': ':aws-es:',
  'Amazon Elastic Compute Cloud - Compute': ':linux_penguin:',
  'Amazon Elastic Load Balancing': ':scales:',
  'Amazon Elasticsearch Service': ':elasticsearch:',
  'Amazon Relational Database Service': ':mysql_dolphin:',
  'Amazon Route 53': ':route53:',
  'Amazon Simple Email Service': ':email:',
  'Amazon Simple Notification Service': ':iphone:',
  'Amazon Simple Storage Service': ':card_file_box:',
  'AmazonCloudWatch': ':aws-cloudwatch:',
  'Tax': ':moneybag:',
};

const aliases = {
  'Total': '合計',
  'AWS CloudTrail': 'CloudTrail',
  'AWS Direct Connect': 'DirectConnect',
  'AWS Key Management Service': 'KMS',
  'AWS Lambda': 'Lambda',
  'Amazon CloudFront': 'CloudFront',
  'Amazon EC2 Container Registry (ECR)': 'ECR',
  'Amazon ElastiCache': 'ElastiCache',
  'EC2 - Other': 'NATGateway',
  'Amazon Elastic Compute Cloud - Compute': 'EC2',
  'Amazon Elastic Load Balancing': 'ALB/ELB',
  'Amazon Elasticsearch Service': 'ES',
  'Amazon Relational Database Service': 'RDS',
  'Amazon Route 53': 'Route53',
  'Amazon Simple Email Service': 'SES',
  'Amazon Simple Notification Service': 'SNS',
  'Amazon Simple Storage Service': 'S3',
  'AmazonCloudWatch': 'CloudWatch',
  'Tax': '税金',
};

return { channel, webhookUrl, emoji, aliases };
