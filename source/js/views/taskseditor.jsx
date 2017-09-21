import preact from 'preact'

export default class TasksEditor extends preact.Component {
  state = {
    showEditor: ('task' in this.props),
    animate: false,
    noRender: false,
  }
  componentDidMount() {
    window.addEventListener('resize', this.showEditorCb)
    this.showEditorCb()
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      showEditor: ('task' in newProps),
      animate: true
    })

    setTimeout(() => {
      this.setState({
        animate: false
      })
    }, 300)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.showEditorCb)
  }
  showEditorCb = () => {
    if (window.innerWidth < 700 && this.state.noRender === true) {
      this.setState({
        noRender: false
      })
    } else if (window.innerWidth >= 700 && this.state.noRender === false) {
      this.setState({
        noRender: true
      })
    }
  }
  triggerBack = () => {
    window.history.back()
  }
  render() {
    if (this.state.noRender) {
      return null
    }
    let className = 'tasks-editor'
    if (this.state.showEditor && this.state.animate) {
      className += ' animate-in'
    } else if (!this.state.showEditor && this.state.animate) {
      className += ' animate-out'
    } else if (!this.state.showEditor) {
      className += ' hide'
    }
    return(
      <section class={className}>
        <button onClick={this.triggerBack}> Go Back</button>
        Hi
      </section>
    )
  }
}