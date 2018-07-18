# Lambda@Edge Resize
Resize jpeg image in CloudFront by Lambda@Edge

## How to Deploy
```shell
touch lambda.json
cd resizer
sls deploy

cd ..

cd infra
terraform plan -out=.terraform/plan -var-file=../lambda.json
terraform apply .terraform/plan
```

or
```shell
cd resizer
yarn deploy
```

## Dependency
- `resizer`: stand alone
- `infra`: depends on `resizer`
