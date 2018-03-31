import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { Link } from '../link.jsx'

export class TasksList extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.generateState(props)
  }
  generateState(props) {
    const list = NitroSdk.getTasks(props.listId)
    return {
      tasks: list.tasks
    }
  }
  componentDidMount() {
    NitroSdk.bind('update', this.tasksUpdate)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
  }
  tasksUpdate = (event, listId) => {
    if (event === 'tasks' && listId === this.props.listId) {
      this.setState(this.generateState(this.props))
    }
  }
  render() {
    return (
      <View>
        {this.state.tasks.map(task => {
          const link = `/${this.props.listId}/${task.id}`
          return (
            <Text key={task.id}>
              <Link to={link}>{task.name}</Link>
            </Text>
          )
        })}
      </View>
    )
  }
}
TasksList.propTypes = {
  listId: PropTypes.string
}
