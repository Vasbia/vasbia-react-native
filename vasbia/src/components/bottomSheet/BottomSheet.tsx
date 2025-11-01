import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import XBIcon from '../../assets/icons/XBIcon';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <View style={styles.sheetContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <XBIcon />
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: "rgba(0,0,0,0.4)",
    marginLeft: 16,
    marginRight: 16,
  },
  sheetContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    elevation: 4,
  },
  closeButton: {
    marginTop: 25,
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
});
