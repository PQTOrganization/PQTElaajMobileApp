import messaging from '@react-native-firebase/messaging';
import {Platform, DeviceEventEmitter} from 'react-native';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';

export default FirebaseNotificationDX = () => {
  if (Platform.OS == 'ios')
    checkNotifications().then(({status, settings}) => {
      console.log('check: ', {status}, {settings});
      if (status == 'denied') {
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {
          console.log('request: ', {status}, {settings});
          if (status == 'granted') getToken();
        });
      } else if (status == 'granted') getToken();
    });
  else getToken();
};

const getToken = () => {
  try {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        const saveToken = {
          key: 'firebaseToken',
          data: token,
        };
        DeviceEventEmitter.emit('SendToWeb', JSON.stringify(saveToken));
      });

    messaging().onTokenRefresh(token => {
      const saveToken = {
        key: 'firebaseToken',
        data: token,
      };
      DeviceEventEmitter.emit('SendToWeb', JSON.stringify(saveToken));
    });
  } catch (error) {
    console.log('Firebase loading error: ', error);
  }
};
