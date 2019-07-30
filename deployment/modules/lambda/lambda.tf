resource "aws_lambda_function" "lambda" {
  function_name    = "nitro-${var.environment}"
  description      = "Nitro - ${var.environment}"
  role             = aws_iam_role.lambda.arn
  runtime          = "go1.x"
  handler          = "nitro.web"
  memory_size      = 1536
  timeout          = 30
  filename         = "../../bin/deployment.zip"
  source_code_hash = "${filebase64sha256("../../bin/deployment.zip")}"

  environment {
    variables = {
      PROXY_TARGET = var.proxy_target
      USE_LAMBDA   = "true"
      STATIC_PATH  = "./dist"
    }
  }
}
