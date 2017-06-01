export default class List {
  constructor(props) {
    this.id = props.id
    this.name = props.name
    this.serverId = props.serverId || null
    this.lastSync = props.lastSync || null
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      serverId: this.serverId,
      lastSync: this.lastSync,
    }
  }
}