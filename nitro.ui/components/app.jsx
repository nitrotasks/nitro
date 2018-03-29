import React, { Component } from 'react';
import logo from '../../assets/icons/logo.svg';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Lists } from './lists/index.jsx'
import { Tasks } from './tasks/index.jsx'
import { Editor } from './editor/index.jsx'

class App extends Component {
  render() {
    return (
      <View>
        <View style={styles.header}>
          <Image accessibilityLabel="React logo" source={logo} resizeMode="contain" style={styles.logo} />
          <Text style={styles.title}>React Native for Web</Text>
        </View>
        <BrowserRouter>
          <Switch>
            <Route path="/:list/:task" component={Editor} />
            <Route path="/:list" component={Tasks} />
            <Route path="/" component={Lists} />
          </Switch>
        </BrowserRouter>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 80
  },
  header: {
    padding: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginVertical: '1em',
    textAlign: 'center'
  }
});

export default App;