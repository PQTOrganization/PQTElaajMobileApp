import {useEffect, useRef, useState} from 'react';
import {Modal, StyleSheet} from 'react-native';
//import BottomSheet, {BottomSheetMethods} from '@devvie/bottom-sheet';
import RBSheet from 'react-native-raw-bottom-sheet';

const BottomSheetModal = props => {
  const refRBSheet = useRef();

  useEffect(() => {
    if (props.open === true) {
      refRBSheet.current.open();
    } else {
      refRBSheet?.current?.close();
    }
  }, [props.open]);

  return (
    <RBSheet
      ref={refRBSheet}
      useNativeDriver={true}
      height={125}
      onClose={() => props.onClose()}
      customStyles={{
        wrapper: {
          backgroundColor: 'transparent',
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
      }}
      customModalProps={{
        animationType: 'slide',
        statusBarTranslucent: true,
      }}
      customAvoidingViewProps={{
        enabled: false,
      }}>
      {props.children}
    </RBSheet>
  );
};

export default BottomSheetModal;
