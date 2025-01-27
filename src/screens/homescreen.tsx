import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  BackHandler,
  View,
  SafeAreaView,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import RNFetchBlob from 'react-native-fetch-blob';
import {Button, useTheme} from 'react-native-paper';

import messageFromSiteHandler from '../components/messageFromSiteHandler';

import Splash from './splash';

import VersionNumber from 'react-native-version-number';
import checkVersion from 'react-native-store-version';
import BottomSheetModal from '../components/bottomSheetModal';
import DocumentPickerDX from '../components/documentPickerDX';
import AttachmentOptionsDX from '../components/business/attachmentOptionsDX';
import {getCameranGalleryPermissions} from '../components/permissionsDX';
import {retrieveImage} from '../components/localStorageDX';

type Nav = {
  navigate: (value: string, options: any) => void;
};

const HomeScreen = () => {
  const theme = useTheme();
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation<Nav>();

  const [viewLoaded, setViewLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isDocumentPickerOpen, setIsDocumentPickerOpen] = useState(false);
  const [attachmentMode, setAttachmentMode] = useState('images');
  const [docUploadID, setDocUploadID] = useState(-1);
  const [userId, setUserId] = useState(-1);

  useEffect(() => {
    checkAppVersion();
    DeviceEventEmitter.addListener('event.image.captured', eventData => {
      sendDataToWebView(eventData);
    });

    DeviceEventEmitter.addListener('event.docattached', docData =>
      sendDataToWebView(docData),
    );

    DeviceEventEmitter.addListener('SendToWeb', jsonMessage => {
      sendDataToWebView(jsonMessage);
    });

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    const req = {key: 'GoBack'};
    sendDataToWebView(JSON.stringify(req));
    return true;
  };

  const sendDataToWebView = (data: any) => {
    // let strData = JSON.stringify(data);
    console.log('sending data to web: ');
    // console.log({webviewRef});
    try {
      webviewRef?.current?.postMessage(data);
    } catch (ex) {
      console.log('EXCEPTION', ex);
    }
  };

  const _messageFromSiteHandler = async (event: any) => {
    let {
      nativeEvent: {data},
    } = event;

    const eventData = JSON.parse(data);

    if (eventData.type === 'webpage')
      navigation.navigate('WebPageView', {
        url: eventData.data,
      });
    else if (eventData.type === 'opencamera') {
      await getCameranGalleryPermissions();
      setIsBottomSheetOpen(!isBottomSheetOpen);
      setAttachmentMode('images');
      let data = JSON.parse(eventData.data);
      setUserId(data.userId);
    } else if (eventData.type === 'opendocupload') {
      await getCameranGalleryPermissions();
      let data = JSON.parse(eventData.data);
      setDocUploadID(data.id);
      setIsBottomSheetOpen(!isBottomSheetOpen);
      setAttachmentMode('docupload');
    } else if (eventData.type === 'getProfileImageFromLocalStorage') {
      let data = JSON.parse(eventData.data);
      retrieveProfileImageFromDevice(data.userId);
    } else messageFromSiteHandler(event);
  };

  const retrieveProfileImageFromDevice = async (userId: number) => {
    let imageData = await retrieveImage(userId);
    DeviceEventEmitter.emit('SendToWeb', imageData);
  };

  const onBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
  };

  const downloadFileOniOS = ({nativeEvent: {downloadUrl}}: any) => {
    console.log({downloadUrl});

    const dirs = RNFetchBlob.fs.dirs;
    const fileName = downloadUrl.split('/').pop();

    RNFetchBlob.config({path: dirs.DocumentDir + '/' + fileName})
      .fetch('GET', downloadUrl)
      .then((res: any) => {
        const fileName = res.path().split('/').pop();

        console.log('The file saved to ', res.path());
        Alert.alert('File Saved', `The file ${fileName} has been downloaded`, [
          {text: 'OK'},
        ]);
      });
  };

  const sendMsg = () => {
    const jsonData = JSON.stringify({
      policyNumber: '123',
      employeeCode: '456',
      employeeSRNumber: '789',
    });

    messageFromSiteHandler({
      nativeEvent: {
        data: JSON.stringify({
          type: 'openmediq',
          data: jsonData,
        }),
      },
    });
  };

  const checkAppVersion = async () => {
    const check = await checkVersion({
      version: VersionNumber.appVersion, // app local version
      iosStoreURL: 'https://apps.apple.com/pk/app/elaaj/id1440986057',
      androidStoreURL:
        'https://play.google.com/store/apps/details?id=com.pakqatar.elaajapp',
      country: 'jp', // default value is 'jp'
    });

    if (check.result === 'new') {
      setOpenModal(true);
    }
  };

  const gotoStore = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/pk/app/elaaj/id1440986057');
    } else {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.pakqatar.elaajapp',
      );
    }
  };

  const openCamera = () => {
    setIsBottomSheetOpen(false);
    navigation.navigate('Camera', {
      module: 'camera',
      id: docUploadID,
      mode: attachmentMode,
      keyId: userId,
    });
  };

  const openGallery = () => {
    setIsBottomSheetOpen(false);
    navigation.navigate('Camera', {
      module: 'gallery',
      id: docUploadID,
      mode: attachmentMode,
      keyId: userId,
    });
  };

  const openDocumentPicker = () => {
    setIsBottomSheetOpen(false);

    setIsDocumentPickerOpen(true);
    navigation.navigate('DocumentPicker', {id: docUploadID, open: 'true'});
  };

  const cameraClose = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#007A48',
        height: '100%',
      }}>
      {openModal === true && (
        <>
          <Modal
            visible={openModal}
            animationType="slide"
            transparent={true}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 22,
              // height: 230,
              width: 275,
              borderColor: 'black',
              backgroundColor: 'red',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 22,
              }}>
              <View
                style={{
                  margin: 20,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 35,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                <Text
                  style={{
                    marginBottom: 15,
                    textAlign: 'center',
                    color: 'black',
                  }}>
                  Your mobile is running an old version of Elaaj app. Upgrade to
                  new version now.
                </Text>
                <Pressable
                  style={{
                    borderRadius: 20,
                    padding: 15,
                    elevation: 2,
                    backgroundColor: 'green',
                  }}
                  onPress={() => gotoStore()}>
                  <Text
                    style={{
                      // marginBottom: 15,
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    Upgrade
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      )}
      {!viewLoaded && <Splash progress={loadProgress} />}

      <AttachmentOptionsDX
        mode={attachmentMode}
        open={isBottomSheetOpen}
        onClose={onBottomSheetClose}
        openCamera={openCamera}
        openGallery={openGallery}
        openDocumentPicker={openDocumentPicker}
      />
      <WebView
        ref={webviewRef}
        source={{
          // uri: 'http://192.168.0.110:3000/test',
          uri: 'https://elaaj.webapp.compass-dx.com/',
          // uri: 'https://elaaj.pakqatar.com.pk/',
        }}
        javaScriptEnabled={true}
        cacheEnabled={false}
        setBuiltInZoomControls={false}
        onLoadProgress={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          setViewLoaded(nativeEvent.progress > 0.9);
          setLoadProgress(nativeEvent.progress);
        }}
        onMessage={_messageFromSiteHandler}
        onFileDownload={downloadFileOniOS}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
