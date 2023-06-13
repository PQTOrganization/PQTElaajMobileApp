import {Linking} from 'react-native';

import emitter from './event';
import FirebaseNotificationDX from './FirebaseNotificationDX';
import {
  getCameranGalleryPermissions,
  requestLocationPermission,
} from './permissionsDX';

export default messageFromSiteHandler = async event => {
  let {
    nativeEvent: {data},
  } = event;

  const eventData = JSON.parse(data);

  switch (eventData.type) {
    case 'call':
      makeCall(eventData.data);
      break;
    case 'setUpFirebase':
      FirebaseNotificationDX();
      break;
    case 'AskCameraStoragePermission':
      await getCameranGalleryPermissions();
      const uploadAction = {
        key: 'uploadAction',
        data: eventData.data,
      };
      emitter.emit('SendToWeb', JSON.stringify(uploadAction));
      break;
    case 'AskLocationPermission':
      const granted = await requestLocationPermission();
      emitter.emit(
        'SendToWeb',
        JSON.stringify({
          key: 'locationpermissionprocessed',
          data: {granted},
        }),
      );
      break;
    case 'webpage':

    case 'Console':
      console.info(`[Console] ${JSON.stringify(eventData.data)}`);
      break;
    default:
      console.log('Received Message from WebView: ' + eventData);
  }
};

const makeCall = phoneNumber => {
  Linking.openURL(`tel:${phoneNumber}`);
};
