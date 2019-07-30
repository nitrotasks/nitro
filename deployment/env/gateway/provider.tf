terraform {
  backend "s3" {
    bucket = "dymajo-terraform-state"
    key    = "nitro-gateway"
    region = "us-west-2"
  }
}

provider "aws" {
  region = "us-west-2"
}

provider "aws" {
  region = "us-east-1"
  alias  = "east"
}
