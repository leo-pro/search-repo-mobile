import 'react-native-gesture-handler';
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { StatusBar } from 'react-native';

import Routes from './routes';

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#24292e" />
      <Routes />
    </NavigationContainer>
  );
}

export default App;
