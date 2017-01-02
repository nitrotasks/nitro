export default class List {
  constructor(props) {
    this.id = props.id
    this.name = props.name
  }
  toObject() {
    return {
      id: this.id,
      name: this.name
    }
  }
}