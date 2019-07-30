resource "aws_api_gateway_rest_api" "nitro" {
  name        = "nitro"
  description = "Gateway for Nitro"
}

resource "aws_api_gateway_resource" "lambda_proxy" {
  rest_api_id = aws_api_gateway_rest_api.nitro.id
  parent_id   = aws_api_gateway_rest_api.nitro.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "lambda_root_method" {
  rest_api_id   = aws_api_gateway_rest_api.nitro.id
  resource_id   = aws_api_gateway_rest_api.nitro.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "lambda_proxy_method" {
  rest_api_id   = aws_api_gateway_rest_api.nitro.id
  resource_id   = aws_api_gateway_resource.lambda_proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root_integration" {
  rest_api_id             = aws_api_gateway_rest_api.nitro.id
  resource_id             = aws_api_gateway_rest_api.nitro.root_resource_id
  http_method             = aws_api_gateway_method.lambda_root_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:${data.aws_caller_identity.current.account_id}:function:$${stageVariables.lbfunc}/invocations"
}

resource "aws_api_gateway_integration" "lambda_proxy_integration" {
  rest_api_id             = aws_api_gateway_rest_api.nitro.id
  resource_id             = aws_api_gateway_resource.lambda_proxy.id
  http_method             = aws_api_gateway_method.lambda_proxy_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:${data.aws_caller_identity.current.account_id}:function:$${stageVariables.lbfunc}/invocations"
}

locals {
  execution_arn = "arn:aws:execute-api:us-west-2:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.nitro.id}/*/${aws_api_gateway_method.lambda_proxy_method.http_method}/*"
}

resource "aws_lambda_permission" "apigw_lambda_uat" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = data.aws_lambda_function.lambda_uat.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = local.execution_arn
}

resource "aws_lambda_permission" "apigw_lambda_prod" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = data.aws_lambda_function.lambda_prod.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = local.execution_arn
}

resource "aws_api_gateway_deployment" "uat" {
  depends_on  = [aws_api_gateway_integration.lambda_proxy_integration]
  rest_api_id = aws_api_gateway_rest_api.nitro.id
  stage_name  = "uat"

  variables = {
    lbfunc = data.aws_lambda_function.lambda_uat.function_name
  }
}

resource "aws_api_gateway_deployment" "prod" {
  depends_on  = [aws_api_gateway_integration.lambda_proxy_integration, aws_api_gateway_deployment.uat]
  rest_api_id = aws_api_gateway_rest_api.nitro.id
  stage_name  = "prod"

  variables = {
    lbfunc = data.aws_lambda_function.lambda_prod.function_name
  }
}

resource "aws_api_gateway_domain_name" "uat" {
  certificate_arn = data.aws_acm_certificate.nitrotasks.arn
  domain_name     = "uat.nitrotasks.com"
}

resource "aws_api_gateway_domain_name" "prod" {
  certificate_arn = data.aws_acm_certificate.nitrotasks.arn
  domain_name     = "go.nitrotasks.com"
}

resource "aws_api_gateway_base_path_mapping" "uat" {
  api_id      = "${aws_api_gateway_rest_api.nitro.id}"
  stage_name  = "${aws_api_gateway_deployment.uat.stage_name}"
  domain_name = "${aws_api_gateway_domain_name.uat.domain_name}"
}

resource "aws_api_gateway_base_path_mapping" "prod" {
  api_id      = "${aws_api_gateway_rest_api.nitro.id}"
  stage_name  = "${aws_api_gateway_deployment.prod.stage_name}"
  domain_name = "${aws_api_gateway_domain_name.prod.domain_name}"
}

