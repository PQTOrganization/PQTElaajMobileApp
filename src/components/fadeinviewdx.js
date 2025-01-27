import React, {useRef, useEffect} from 'react';
import {Animated, useAnimatedValue} from 'react-native';

const FadeInViewDX = props => {
  const fadeAnim = useAnimatedValue(0); // useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>
  );
};

export default FadeInViewDX;
