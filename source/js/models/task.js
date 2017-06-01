export default class Task {
  constructor(props) {
    this.id = props.id
    this.name = props.name
    this.notes = props.notes || null
    this.list = props.list
    this.serverId = props.serverId || null
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      notes: this.notes,
      list: this.list,
      serverId: this.serverId,
    }
  }
}