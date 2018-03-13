provider "docker" {
  host = "tcp://127.0.0.1:2375"
}

resource "docker_container" "nitro-client" {
  image = "nitro-client"
  name = "nitro-client"
  networks = ["nitro_private_network"]
  ports {
    internal = 80
    external = 80
  }
}