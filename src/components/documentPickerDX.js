import {useEffect, useRef, useState} from 'react';
import {Text, View, DeviceEventEmitter} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {SafeAreaView} from 'react-native-safe-area-context';

const DocumentPickerDX = ({route}) => {
  const navigation = useNavigation();
  const [docUploadID, setDocUploadID] = useState(-1);

  useEffect(() => {
    if (route.params.id != -1) {
      console.log('here');
      setDocUploadID(route.params.id);
    }
    if (route.params.open === 'true') {
      openDocumentPicker(route.params.id);
    }
  }, [route.params.open]);

  const openDocumentPicker = id => {
    setTimeout(() => {
      DocumentPicker.pick({type: DocumentPicker.types.pdf})
        .then(response => {
          RNFS.readFile(response?.[0].uri, 'base64')
            .then(res => {
              let data = JSON.stringify({
                id: id,
                key: 'docattached',
                data: res,
                type: 'pdf',
                name: response?.[0].name,
                size: response?.[0].size,
              });
              // console.log('openDocumentPicker res', res);
              console.log('emitting event', docUploadID);
              DeviceEventEmitter.emit('event.docattached', data);
              navigation.goBack();
            })
            .catch(err => {
              console.log('Error reading document file: ', err);
              navigation.goBack();
            });
        })
        .catch(err => {
          console.log('ERROR', err);
          navigation.goBack();
        });
    }, 1000);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          alignContent: 'center',
          backgroundColor: 'green',
          justifyContent: 'center',
        }}>
        <Text style={{textColor: 'white'}}>Processing</Text>
      </View>
    </SafeAreaView>
  );
};

export default DocumentPickerDX;
