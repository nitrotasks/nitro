export default class Task {
  constructor(props) {
    this.id = props.id
    this.name = props.name
    this.type = props.type || 'task'
    this.notes = props.notes || null
    this.date = (props.date && props.date !== 'next') ? new Date(props.date) : props.date || null
    this.deadline = props.deadline ? new Date(props.deadline) : null
    this.list = props.list
    this.completed = props.completed ? new Date(props.completed) : null
    this.serverId = props.serverId || null
    this.lastSync = props.lastSync || null
    this.clientUpdate = props.clientUpdate || new Date()
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      date: this.date,
      deadline: this.deadline,
      notes: this.notes,
      list: this.list,
      completed: this.completed,
      serverId: this.serverId,
      lastSync: this.lastSync,
      clientUpdate: this.clientUpdate
    }
  }
}