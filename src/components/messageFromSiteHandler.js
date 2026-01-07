import {Alert, Linking, Platform} from 'react-native';
import SendIntent from 'react-native-send-intent';
import SharedGroupPreferences from 'react-native-shared-group-preferences';

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

  console.log(eventData.data);

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
    case 'openmediq':
      await callMedIQ(JSON.parse(eventData.data));
      break;
    case 'openmaps':
      await openGoogleMaps(JSON.parse(eventData.data));
      break;
    case 'webpage':
    case 'Console':
      console.info(`[Console] ${JSON.stringify(eventData.data)}`);
      break;
    case 'read':
      await readMedIQ();
      break;
    default:
      console.log('Received Message from WebView: ' + eventData);
  }
};

const makeCall = phoneNumber => {
  Linking.openURL(`tel:${phoneNumber}`);
};

const callMedIQ = async employeeData => {
  const appURI =
    Platform.OS === 'ios'
      ? 'medIQpqt://'
      : 'https://homemediqs.page.link/PQT?uid=aqws23frdews34frTTsds&apiToken=asDR34sdeRT567j&baseURL=https://mediqs.com.pk';
  const storeURL =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/pk/app/pqt-mediq/id6477909336'
      : 'https://play.google.com/store/apps/details?id=com.homemedics.app.elaaj';
  const packageName = 'com.homemedics.app.elaaj';
  const appGroupIdentifier = 'group.com.pakqatar.elaaj';

  console.log('calling mediq', {employeeData});

  if (Platform.OS == 'ios') {
    try {
      await SharedGroupPreferences.setItem(
        'policyNumber',
        employeeData.policyNumber,
        appGroupIdentifier,
      );
      await SharedGroupPreferences.setItem(
        'employeeCode',
        employeeData.employeeCode,
        appGroupIdentifier,
      );
      await SharedGroupPreferences.setItem(
        'employeeSRNumber',
        employeeData.employeeSRNumber,
        appGroupIdentifier,
      );
      await SharedGroupPreferences.setItem(
        'employeeName',
        employeeData?.employeeName,
        appGroupIdentifier,
      );
      await SharedGroupPreferences.setItem(
        'mobileNumber',
        employeeData?.mobileNumber,
        appGroupIdentifier,
      );
      await SharedGroupPreferences.setItem(
        'emailAddress',
        employeeData?.emailAddress,
        appGroupIdentifier,
      );
      await SharedGroupPreferences.setItem(
        'customerCode',
        employeeData?.customerCode,
        appGroupIdentifier,
      );
      await SharedGroupPreferences.setItem(
        'customerName',
        employeeData?.customerName,
        appGroupIdentifier,
      );
      await SharedGroupPreferences.setItem(
        'branchId',
        employeeData?.branchId,
        appGroupIdentifier,
      );

      const supported = await Linking.canOpenURL(appURI);

      console.log({supported});

      if (supported) {
        await Linking.openURL(appURI);
      } else {
        await Linking.openURL(storeURL);
      }
    } catch (errorCode) {
      // errorCode 0 = There is no suite with that name.
      console.log(errorCode);
    }
  } else {
    SendIntent.isAppInstalled(packageName)
      .then(isInstalled => {
        if (isInstalled)
          return SendIntent.openApp(packageName, {
            policyNumber: employeeData.policyNumber,
            employeeCode: employeeData.employeeCode,
            employeeSRNumber: employeeData.employeeSRNumber,
            employeeName: employeeData?.employeeName,
            mobileNumber: employeeData?.mobileNumber,
            emailAddress: employeeData?.emailAddress,
            customerCode: employeeData?.customerCode,
            customerName: employeeData?.customerName,
            branchId: employeeData?.branchId,
          });
        else {
          return Linking.openURL(storeURL);
        }
      })
      .catch(err => Alert.alert(err.message));
  }
};

const readMedIQ = async () => {
  const appGroupIdentifier = 'group.com.pakqatar.elaaj';

  const data = await SharedGroupPreferences.getItem(
    'policyNumber',
    appGroupIdentifier,
  );

  console.log({data});
};

const openGoogleMaps = async directionData => {
  const currentLat = directionData?.currentLat;
  const currentLng = directionData?.currentLng;
  const destinationLat = directionData?.destinationLat;
  const destinationLng = directionData?.destinationLng;

  if (currentLat && currentLng && destinationLat && destinationLng) {
    const url = Platform.select({
      ios: `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`,
      android: `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`,
      //'geo:' + latitude + ',' + longitude + '?q=' + label,
    });
    Linking.openURL(url);
  } else {
    console.error('Current location or destination location is not available');
  }
};
