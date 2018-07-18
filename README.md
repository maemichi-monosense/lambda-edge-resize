# Lambda@Edge Resize
Resize jpeg image in CloudFront by Lambda@Edge

## How to Deploy
```shell
touch lambda.json
cd resizer
sls deploy

cd ..
terraform plan -out=.terraform/plan -var-file=lambda.json
terraform apply .terraform/plan
```

or
```shell
cd resizer
yarn deploy
```
