provider "docker" {
  host = "tcp://127.0.0.1:2375"
}

resource "docker_container" "nitro-client" {
  image = "${docker_image.nitro-client.latest}"
  name = "nitro-client"
  networks = ["nitro_private_network"]
  ports {
    internal = 80
    external = 80
  }
}
data "docker_registry_image" "nitro-client" {
  name = "dymajo/nitro-client:latest"
}
resource "docker_image" "nitro-client" {
  name          = "${data.docker_registry_image.nitro-client.name}"
  pull_triggers = ["${data.docker_registry_image.nitro-client.sha256_digest}"]
}