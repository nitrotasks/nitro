import React from 'react'
import { View } from 'react-native'

import { Header } from './header.jsx'
import { TasksInput } from './tasksInput.jsx'
import { TasksList } from './tasksList.jsx'

export class Tasks extends React.Component {
  render() {
    const listId = this.props.match.params.list
    return (
      <View>
        <Header listId={listId} />
        <TasksInput listId={listId} />
        <TasksList listId={listId} />
      </View>
    )
  }
}
