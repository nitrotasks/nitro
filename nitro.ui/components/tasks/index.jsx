import React from 'react'
import { View, Text } from 'react-native'
import { Link } from 'react-router-dom'

export class Tasks extends React.Component {
    render() {
        const listId = this.props.match.params.list
        return (
            <View>
                <Text>Tasks Component - {listId}</Text>
                <Link to={`/${listId}/task1`}><Text>List1</Text></Link>
            </View>
        )
    }   
}