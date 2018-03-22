# Create the private key for the registration (not the certificate)
resource "tls_private_key" "private_key" {
  algorithm = "RSA"
}

# Set up a registration using a private key from tls_private_key
resource "acme_registration" "reg" {
  server_url      = "https://acme-v01.api.letsencrypt.org/directory"
  account_key_pem = "${tls_private_key.private_key.private_key_pem}"
  email_address   = "${var.CLOUDFLARE_EMAIL}"
}

# Create a certificate
resource "acme_certificate" "certificate" {
  server_url                = "https://acme-v01.api.letsencrypt.org/directory"
  account_key_pem           = "${tls_private_key.private_key.private_key_pem}"
  common_name               = "uat.nitrotasks.com"

  dns_challenge {
    provider = "cloudflare"
    config {
      CLOUDFLARE_EMAIL = "${var.CLOUDFLARE_EMAIL}"
      CLOUDFLARE_API_KEY = "${var.CLOUDFLARE_API_KEY}"
    }
  }

  registration_url = "${acme_registration.reg.id}"
}

resource "local_file" "ssl_certificate" {
  content     = "${acme_certificate.certificate.certificate_pem}"
  filename = "${path.module}/cert/cert.pem"
}
resource "local_file" "ssl_certificate_key" {
  content     = "${acme_certificate.certificate.private_key_pem}"
  filename = "${path.module}/cert/cert.pem.key"
}