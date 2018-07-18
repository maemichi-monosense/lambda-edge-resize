provider "aws" {
  region  = "ap-northeast-1"
  profile = "yuya"

  allowed_account_ids = ["${var.aws_account_id}"]
}
