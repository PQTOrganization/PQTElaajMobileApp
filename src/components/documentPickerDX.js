import {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  Dimensions,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/core';
import RNFS from 'react-native-fs';
import {Button, useTheme} from 'react-native-paper';
import BottomSheetModal from './bottomSheetModal';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
// import pickDirectory from 'react-native-document-picker';
//import {BackHandler, View} from 'react-native';

const CAPTURE_BUTTON_SIZE = 78;
const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

// type Nav = {
//   navigate: (value: string, options: any) => void,
// };

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

  console.log('doc upload id', docUploadID);
  const openDocumentPicker = id => {
    DocumentPicker.pick({type: DocumentPicker.types.pdf})
      .then(response => {
        // console.log('response', response);
        RNFS.readFile(response?.[0].uri, 'base64')
          .then(res => {
            // console.log('FILE READ', res);
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
  };

  // const onAcceptPhoto = () => {
  //   // console.log('onAcceptPhoto');

  //   // DeviceEventEmitter.emit('event.image.captured', data);
  //   // navigation.goBack();
  //   RNFS.readFile(photoPath, 'base64')
  //     .then(res => {
  //       let data = JSON.stringify({
  //         key: 'imagecaptured',
  //         data: res,
  //       });
  //       console.log('onAcceptPhoto res', res.length);
  //       DeviceEventEmitter.emit('event.image.captured', data);
  //       navigation.goBack();
  //     })
  //     .catch(err => console.log('Error reading photo file: ', err));
  // };

  // const onRejectPhoto = () => {
  //   setPhotoPath('');
  //   navigation.goBack();
  // };

  // const theme = useTheme();
  // let {width, height} = Dimensions.get('window');

  return (
    <View
      style={{
        alignContent: 'center',
        backgroundColor: 'green',
        justifyContent: 'center',
      }}>
      <Text style={{textColor: 'white'}}>Processing</Text>
    </View>
  );
};

export default DocumentPickerDX;
