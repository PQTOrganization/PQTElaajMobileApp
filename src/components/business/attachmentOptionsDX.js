import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheetModal from '../bottomSheetModal';

const AttachmentOptionsDX = props => {
  return (
    <BottomSheetModal open={props?.open} onClose={props.onClose}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          alignContent: 'flex-end',
          width: '100%',
          paddingRight: 10,
        }}>
        <TouchableOpacity
          onPress={props.onClose}
          style={{
            width: '11%',
            alignItems: 'flex-end',
            alignContent: 'flex-end',
          }}>
          <Icon size={24} color="black" name="close" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          marginTop: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View
          style={{
            width: props.mode === 'images' ? '50%' : '30%',
            paddingRight: props.mode === 'images' ? 30 : 0,
            alignItems: 'flex-end',
            // borderColor: 'blue',
            // borderStyle: 'solid',
            // borderWidth: 1,
          }}>
          <TouchableOpacity
            onPress={props.openCamera}
            style={{
              alignItems: 'center',
            }}>
            <>
              <Icon size={40} color="#8B0037" name="photo-camera" />
              <Text
                style={{
                  color: '#8B0037',
                  fontWeight: 'bold',
                  marginBottom: 5,
                }}>
                Camera
              </Text>
            </>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: props.mode === 'images' ? '50%' : '30%',
            alignItems: props.mode === 'images' ? 'flex-start' : 'center',
            paddingLeft: props.mode === 'images' ? 30 : 0,
            // borderColor: 'blue',
            // borderStyle: 'solid',
            // borderWidth: 1,
          }}>
          <TouchableOpacity
            onPress={props.openGallery}
            style={{
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <>
              <Icon size={40} color="green" name="collections" />
              <Text
                style={{color: 'green', fontWeight: 'bold', marginBottom: 5}}>
                Gallery
              </Text>
            </>
          </TouchableOpacity>
        </View>
        {props.mode === 'docupload' && (
          <View
            style={{
              width: props.mode === 'images' ? '50%' : '30%',
              alignItems: 'flex-start',
              paddingLeft: props.mode === 'images' ? 30 : 15,
              // borderColor: 'blue',
              // borderStyle: 'solid',
              // borderWidth: 1,
            }}>
            <TouchableOpacity
              onPress={props.openDocumentPicker}
              style={{
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <>
                <Icon size={40} color="blue" name="description" />
                <Text
                  style={{color: 'blue', fontWeight: 'bold', marginBottom: 5}}>
                  File
                </Text>
              </>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheetModal>
  );
};

export default AttachmentOptionsDX;
