terraform {
  backend "s3" {
    bucket = "dymajo-terraform-state"
    key    = "nitro-uat-lambda"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-west-2"
}

module "uat-lambda" {
  source       = "../../modules/lambda"
  environment  = "uat"
  proxy_target = "https://uat.nitrotasks.com/a/"
}
