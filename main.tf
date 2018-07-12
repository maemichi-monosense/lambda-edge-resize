terraform {
  required_version = "~> 0.11.0"

  backend "s3" {
    profile        = "akb48shop"
    region         = "ap-northeast-1"
    bucket         = "infra.akb48shop.tokyo"
    key            = "poc-lambda-edge-resize"
    dynamodb_table = "TerraformLock"
  }
}
