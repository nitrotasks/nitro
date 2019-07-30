terraform {
  backend "s3" {
    bucket = "dymajo-terraform-state"
    key    = "nitro-prod-lambda"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-west-2"
}

module "prod-lambda" {
  source       = "../../modules/lambda"
  environment  = "prod"
  proxy_target = "https://api.nitrotasks.com/a/"
}
