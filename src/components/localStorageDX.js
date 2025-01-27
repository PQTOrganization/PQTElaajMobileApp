import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {Image as ImageCompressor} from 'react-native-compressor';

const keyProfileImage = 'profileimage';

export const storeImage = async (photoPath, keyId) => {
  try {
    // await AsyncStorage.setItem(keyProfileImage + '_' + keyId, photoPath);
    const result = await ImageCompressor.compress('file://' + photoPath);
    RNFS.readFile(result, 'base64').then(async compressedImage => {
      await AsyncStorage.setItem(
        keyProfileImage + '_' + keyId,
        compressedImage,
      );
    });
  } catch (error) {
    console.error(error);
  }
};

export const retrieveImage = async keyId => {
  try {
    const photo = await AsyncStorage.getItem(keyProfileImage + '_' + keyId);
    let data = JSON.stringify({
      key: 'profileImageRetrieved',
      data: photo,
      type: 'image',
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
