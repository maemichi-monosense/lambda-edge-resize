terraform {
  required_version = "~> 0.11.0"

  backend "s3" {
    profile = "yuya"
    region  = "ap-northeast-1"
    bucket  = "infra.yuya.tokyo"
    key     = "poc-lambda-edge-resize"
  }
}
