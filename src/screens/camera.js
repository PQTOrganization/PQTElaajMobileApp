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
import BottomSheetModal from '../components/bottomSheetModal';
import ImageCropPicker from 'react-native-image-crop-picker';
import pickDirectory from 'react-native-document-picker';
import {storeImage} from '../components/localStorageDX';

const CAPTURE_BUTTON_SIZE = 78;
const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

const CameraScreen = ({route}) => {
  const [photoPath, setPhotoPath] = useState('');
  const [photo, setPhoto] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [docUploadID, setDocUploadID] = useState(-1);
  const [mode, setMode] = useState('');
  const [keyId, setKeyId] = useState(-1);

  const navigation = useNavigation();

  useEffect(() => {
    if (route.params.id != -1) {
      setDocUploadID(route.params.id);
    }
    if (route.params.module === 'camera') {
      openReactCamera();
    } else {
      openGallery();
    }
  }, [route.params.module]);

  useEffect(() => {
    if (route.params.id != -1) {
      setDocUploadID(route.params.id);
    }
  }, [route.params.id]);

  useEffect(() => {
    if (route.params.mode) {
      setMode(route.params.mode);
    }
  }, [route.params.mode]);

  useEffect(() => {
    setKeyId(route.params.keyId);
  }, [route.params.keyId]);

  const openReactCamera = () => {
    ImageCropPicker.openCamera({
      cropping: true,
      showCropFrame: true,
      showCropGuidelines: true,
      // multiple:true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      // cropperToolbarTitle:'',
      cropperCircleOverlay: false,
      // showCropGuidelines:false,
      // showCropFrame:false,
      hideBottomControls: false, //to hide bottom
    })
      .then(image => {
        setPhoto(image);
        const fileName = 'documentphoto-' + new Date().getTime() + '.jpg';
        setFileName(fileName);
        setFileSize(image.size);
        const path = RNFS.DocumentDirectoryPath + '/' + fileName;
        RNFS.moveFile(image.path, path).then(() => setPhotoPath(path));
      })
      .catch(err => {
        console.log('ERROR CAMERA', err);
        // throw err;
        navigation.goBack();
      });
    return null;
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({
      cropping: true,
      showCropFrame: true,
      showCropGuidelines: true,
      // multiple:true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      // cropperToolbarTitle:'',
      cropperCircleOverlay: false,
      // showCropGuidelines:false,
      // showCropFrame:false,
      hideBottomControls: false, //to hide bottom
    })
      .then(image => {
        setPhoto(image);
        const fileName = 'documentphoto-' + new Date().getTime() + '.jpg';
        setFileName(fileName);
        setFileSize(image.size);
        const path = RNFS.DocumentDirectoryPath + '/' + fileName;
        RNFS.moveFile(image.path, path).then(() => setPhotoPath(path));
      })
      .catch(err => {
        console.log('ERROR CAMERA', err);
        // throw err;
        navigation.goBack();
      });
    return null;
  };

  const onAcceptPhoto = async () => {
    RNFS.readFile(photoPath, 'base64')
      .then(async res => {
        try {
          let data = JSON.stringify({
            id: docUploadID,
            key: 'imagecaptured',
            data: res,
            name: fileName,
            size: fileSize,
            type: 'image',
          });

          if (mode === 'images') {
            storeImage(photoPath, keyId);
          }

          DeviceEventEmitter.emit('event.image.captured', data);
          navigation.goBack();
        } catch (err) {
          console.log('ERROR', err);
        }
      })
      .catch(err => console.log('Error reading photo file: ', err));
  };

  const onRejectPhoto = () => {
    setPhotoPath('');
    navigation.goBack();
  };

  const theme = useTheme();

  return (
    <View style={{flex: 1}}>
      {photoPath != '' && (
        <View style={{flex: 1}}>
          <>
            <Image
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
              source={{uri: 'file://' + photoPath}}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Button
                onPress={onRejectPhoto}
                color={theme.colors.error}
                mode="contained"
                style={{flex: 1, borderRadius: 0}}>
                Reject
              </Button>
              <Button
                onPress={onAcceptPhoto}
                color={'green'}
                mode="contained"
                style={{flex: 1, borderRadius: 0}}>
                Accept
              </Button>
            </View>
          </>
        </View>
      )}
    </View>
  );
};

export default CameraScreen;
