import React from 'react'
import { View, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars, exitStyles } from '../../styles.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { Header } from './header.jsx'
import { TasksInput } from './tasksInput.jsx'
import { TasksList } from './tasksList.jsx'
import { TaskExpanded } from './taskExpanded.jsx'
import { ScrollView } from '../reusable/scrollView.jsx'
import { Datepicker } from '../datepicker.jsx'

export class Tasks extends React.Component {
  constructor(props) {
    super(props)
    this.scrollView = React.createRef()
    this.state = {
      headerVisible: false,
      listName: this.getListName(props.match.params.list)
    }
    UiService.scrollView = this.scrollView
  }
  componentDidMount() {
    NitroSdk.bind('update', this.tasksUpdate)
    TasksExpandedService.setGo(this.props.history.push) // hack for now
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.tasksUpdate)
  }
  triggerIntersection = e => {
    const newPos = !e[0].isIntersecting
    if (this.state.headerVisible !== newPos) {
      this.setState({
        headerVisible: newPos
      })
    }
  }
  tasksUpdate = event => {
    if (event === 'lists') {
      this.setState({
        listName: this.getListName(this.props.match.params.list)
      })
    }
  }
  getListName(listId) {
    const list = NitroSdk.getList(listId)
    if (list === null) {
      return ''
    } else {
      return list.name
    }
  }

  render() {
    const listId = this.props.match.params.list
    return (
      <View style={styles.wrapper}>
        <ScrollView ref={this.scrollView}>
          <Header listId={listId} onIntersect={this.triggerIntersection} />
          <TasksInput listId={listId} />
          <TasksList listId={listId} />
          <TaskExpanded triggerBack={this.props.history.goBack} />
        </ScrollView>
        <Datepicker pickerId="expanded" position="sheet" />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    height: '100%'
  }
})
