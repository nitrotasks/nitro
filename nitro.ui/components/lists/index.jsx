import React from 'react'
import { View, Text } from 'react-native'
import { Link } from 'react-router-dom'

export class Lists extends React.Component {
    render() {
        return (
            <View>
                <Text>Lists Component</Text>
                <Link to="/list1"><Text>List1</Text></Link>
                <Link to="/list2"><Text>List2</Text></Link>
            </View>
        )
    }   
}