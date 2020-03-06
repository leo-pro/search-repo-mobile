import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import User from './pages/User';
import StarredRepo from './pages/StarredRepo';

const Stack = createStackNavigator();

function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#24292e',
        },
        headerTintColor: '#ffffff',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Main"
        component={Main}
        options={{ title: 'Usuários' }}
      />
      <Stack.Screen
        name="User"
        component={User}
        options={({ route }) => ({
          title: route.params.user.name,
        })}
      />
      <Stack.Screen
        name="StarredRepo"
        component={StarredRepo}
        options={({ route }) => ({
          title: route.params.starredRepo.full_name,
        })}
      />
    </Stack.Navigator>
  );
}

export default Routes;
