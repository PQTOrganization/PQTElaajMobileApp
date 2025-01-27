import {Platform} from 'react-native';
import {
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

export const getCameranGalleryPermissions = async () => {
  await requestCameraPermission();
  await requestGalleryPermission();
};

const requestCameraPermission = async () => {
  try {
    let granted = '';

    if (Platform.OS == 'ios')
      return request(PERMISSIONS.IOS.CAMERA).then(response => {
        if (response == RESULTS.GRANTED) {
          console.log('You can use the camera');
          return true;
        } else {
          console.log('Camera permission status: ', granted);
        }
      });
    else
      return request(PERMISSIONS.ANDROID.CAMERA).then(response => {
        if (response == RESULTS.GRANTED) {
          console.log('You can use the camera');
          return true;
        } else {
          console.log('Camera permission status: ', granted);
          return false;
        }
      });
  } catch (error) {
    console.warn(error);
  }
};

const requestGalleryPermission = async () => {
  try {
    if (Platform.OS == 'ios')
      return request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(response => {
        console.log('request gallery response: ', {response});
        if (response == RESULTS.GRANTED) {
          console.log('You can use the gallery');
          return true;
        } else {
          return false;
        }
      });
    else if (Platform.Version >= 13)
      return requestMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ]).then(response => {
        console.log('request gallery response (Android 13): ', {response});
        if (response == RESULTS.GRANTED) {
          console.log('You can use the gallery');
          return true;
        } else {
          return false;
        }
      });
    else
      return requestMultiple([
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ]).then(response => {
        console.log('request gallery response: ', {response});
        if (response == RESULTS.GRANTED) {
          console.log('You can use the gallery');
          return true;
        } else {
          return false;
        }
      });
  } catch (error) {
    console.warn(error);
  }
};

export const requestLocationPermission = async () => {
  try {
    let granted = '';

    if (Platform.OS == 'ios')
      return request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(response => {
        console.log('request location response: ', {response});
        if (response == RESULTS.GRANTED) {
          console.log('You can use the location');
          return true;
        } else {
          console.log('Location permission status: ', granted);
          return false;
        }
      });
    else
      return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
        response => {
          console.log('request location response: ', {response});
          if (response == RESULTS.GRANTED) {
            console.log('You can use the location');
            return true;
          } else {
            console.log('Location permission status: ', granted);
            return false;
          }
        },
      );
  } catch (error) {
    console.warn(error);
  }
};
