export default class List {
  constructor(props) {
    this.id = props.id
    this.name = props.name
    this.notes = props.notes || null
    this.serverId = props.serverId || null
    this.lastSync = props.lastSync || null
    this.order = props.order || []
    this.localOrder = props.localOrder || []
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      notes: this.notes,
      serverId: this.serverId,
      lastSync: this.lastSync,
      order: this.order,
      localOrder: this.localOrder
    }
  }
}