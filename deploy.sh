#!/bin/bash
# changes to working directory of the script
cd "$(dirname "$0")"
git pull

curl https://releases.hashicorp.com/terraform/0.11.3/terraform_0.11.3_linux_amd64.zip > terraform.zip
unzip -o terraform.zip
chmod +x ./terraform

mkdir ~/.terraform.d
mkdir ~/.terraform.d/plugins
mkdir ~/.terraform.d/plugins/linux_amd64
wget https://github.com/vancluever/terraform-provider-acme/releases/download/v0.5.0/terraform-provider-acme_v0.5.0_linux_amd64.zip -O /tmp/acme.zip
unzip -o /tmp/acme.zip -d /tmp
cp /tmp/terraform-provider-acme ~/.terraform.d/plugins/linux_amd64

./terraform init
./terraform apply -auto-approve > ./terraform.log
