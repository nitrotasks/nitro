export default class Task {
  constructor(props) {
    this.id = props.id
    this.name = props.name
    this.type = props.type || 'task'
    this.notes = props.notes || null
    this.list = props.list
    this.serverId = props.serverId || null
    this.lastSync = props.lastSync || null
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      notes: this.notes,
      list: this.list,
      serverId: this.serverId,
      lastSync: this.lastSync,
    }
  }
}