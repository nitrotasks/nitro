#!/bin/bash
echo "Building Go Proxy..."
cd ./nitro.web
go get -v ./
go build

echo "Zipping Go Proxy..."
zip ../deployment/bin/deployment.zip ./nitro.web
cd ..

echo "Substituting Entrypoints..."
echo "Using $2"
sed -i -e 's/\/generated\//https:\/\/'"$2"'\/generated\//g' ./dist/index.html
sed -i -e 's/\/generated\//https:\/\/'"$2"'\/generated\//g' ./dist/sw.js

echo "Zipping JS Bundle..."
zip -r deployment/bin/deployment.zip ./dist

echo "Installing Terraform"
curl https://releases.hashicorp.com/terraform/0.12.5/terraform_0.12.5_linux_amd64.zip -o terraform.zip
unzip -o terraform.zip 

echo "Terraform Init..."
cd deployment/env/$1
../../../terraform init

echo "Terraform Apply..."
../../../terraform apply --auto-approve
