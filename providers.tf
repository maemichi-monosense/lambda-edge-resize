provider "aws" {
  region = "ap-northeast-1"

  //  alias = "tokyo"

  allowed_account_ids = ["${var.aws_account_id}"]
}
