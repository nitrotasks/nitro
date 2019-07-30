data "aws_caller_identity" "current" {}

data "aws_lambda_function" "lambda_uat" {
  function_name = "nitro-uat"
}

data "aws_lambda_function" "lambda_prod" {
  function_name = "nitro-prod"
}

data "aws_acm_certificate" "nitrotasks" {
  domain   = "nitrotasks.com"
  statuses = ["ISSUED"]
  provider = "aws.east"
}
