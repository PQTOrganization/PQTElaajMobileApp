import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/homescreen';
import WebPageScreen from './src/screens/webpagescreen';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor('#007A48');
    StatusBar.setBarStyle('light-content');
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WebPageView" component={WebPageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
