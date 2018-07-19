# deploy
> deploy whole stack of CloudFront with Lambda@Edge

```bash
saku deploy-func deploy-infra
```

# deploy-func
> deploy Lambda functions

```bash
cd resizer && sls deploy
```

# deploy-infra
> deploy CloudFront with Lambda@Edge

```bash
cd infra && terraform plan -out=.terraform/plan -var-file=../lambda.json && terraform apply .terraform/plan
```
