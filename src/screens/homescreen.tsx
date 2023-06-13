import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  BackHandler,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import RNFetchBlob from 'react-native-fetch-blob';
import {useTheme} from 'react-native-paper';

import messageFromSiteHandler from '../components/messageFromSiteHandler';

import Splash from './splash';

type Nav = {
  navigate: (value: string, options: any) => void;
};

const HomeScreen = () => {
  const theme = useTheme();
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation<Nav>();

  const [viewLoaded, setViewLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    DeviceEventEmitter.addListener('event.image.captured', eventData =>
      sendDataToWebView(eventData),
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
    console.log('sending data to web: ', data);
    webviewRef?.current?.postMessage(data);
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
    else messageFromSiteHandler(event);
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#007A48'}}>
      {!viewLoaded && <Splash progress={loadProgress} />}
      <View
        style={{
          flex: viewLoaded ? 1 : 0,
        }}>
        <WebView
          ref={webviewRef}
          source={{
            uri: 'https://elaaj.pakqatar.com.pk/',
            //uri: 'https://elaaj.webapp.compass-dx.com/',
          }}
          javaScriptEnabled={true}
          cacheEnabled={false}
          setBuiltInZoomControls={false}
          onLoadProgress={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            setViewLoaded(nativeEvent.progress > 0.999);
            setLoadProgress(nativeEvent.progress);
          }}
          onMessage={_messageFromSiteHandler}
          onFileDownload={downloadFileOniOS}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
