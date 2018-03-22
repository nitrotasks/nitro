provider "docker" {
  host = "unix:///var/run/docker.sock"
}
resource "docker_container" "nitro-client" {
  image = "${docker_image.nitro-client.latest}"
  name = "nitro-client"
  restart = "always"
  networks = ["nitro_private_network"]
  volumes {
    host_path = "${path.module}/cert"
    container_path = "/etc/nginx/ssl"
  }
  ports {
    internal = 80
    external = 80
  }
  ports {
    internal = 443
    external = 443
  }
}
data "docker_registry_image" "nitro-client" {
  name = "dymajo/nitro-client:latest"
}
resource "docker_image" "nitro-client" {
  name          = "${data.docker_registry_image.nitro-client.name}"
  pull_triggers = ["${data.docker_registry_image.nitro-client.sha256_digest}"]
}