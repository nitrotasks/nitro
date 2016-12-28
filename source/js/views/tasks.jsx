import preact from 'preact'

export default class Tasks extends preact.Component {
  render() {
    return (
      <div>
        Tasks Component. List Id: {this.props.list}
      </div>
    )
  }
}