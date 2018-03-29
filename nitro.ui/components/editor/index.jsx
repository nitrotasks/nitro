import React from 'react'
import { View, Text } from 'react-native'

export class Editor extends React.Component {
    render() {
        const taskId = this.props.match.params.task
        return (
            <View>
                <Text>Task Editor Component - {taskId}</Text>
            </View>
        )
    }   
}