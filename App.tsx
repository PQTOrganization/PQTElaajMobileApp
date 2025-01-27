import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/homescreen';
import WebPageScreen from './src/screens/webpagescreen';
import CameraScreen from './src/screens/camera';
import DocumentPickerDX from './src/components/documentPickerDX';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'android') StatusBar.setBackgroundColor('#007A48');

    StatusBar.setHidden(false);
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
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="DocumentPicker" component={DocumentPickerDX} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
