import React from 'react';
import {Image, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import FadeInViewDX from '../components/fadeinviewdx';

const Splash = props => {
  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        backgroundColor: '#FFFFFF',
      }}>
      <FadeInViewDX
        style={{
          width: '100%',
          alignItems: 'center',
          margin: 16,
        }}>
        <Image
          source={require('../assets/elaaj_logo_white_bg.png')}
          resizeMode="contain"
          style={{height: 200}}
        />
      </FadeInViewDX>
      <ProgressBar
        /*progress={props.progress}*/ style={{width: 200}}
        animatedValue={props.progress}
      />
    </View>
  );
};

export default Splash;
