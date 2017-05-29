export default class Task {
  constructor(props) {
    this.id = props.id
    this.name = props.name
    this.list = props.list
    this.serverId = props.serverId || null
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      list: this.list,
      serverId: this.serverId,
    }
  }
}