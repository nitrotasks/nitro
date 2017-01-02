export default class Task {
  constructor(props) {
    this.id = props.id
    this.name = props.name
    this.list = props.list
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      list: this.list
    }
  }
}