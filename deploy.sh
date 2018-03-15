#!/bin/bash
# changes to working directory of the script
cd "$(dirname "$0")"
git pull

curl https://releases.hashicorp.com/terraform/0.11.3/terraform_0.11.3_linux_amd64.zip > terraform.zip
unzip -o terraform.zip
chmod +x ./terraform

./terraform init
./terraform apply -auto-approve
