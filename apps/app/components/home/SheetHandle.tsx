import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const RADIUS = 24;

const SheetHandle: FC = () => {
  return (
    <Shadow
      sides={['top']}
      corners={['topLeft', 'topRight']}
      radius={RADIUS}
      viewStyle={styles.shadowContainer}
    >
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
    </Shadow>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    backgroundColor: '#F2F0FF',
  },
  handle: {
    width: 30,
    height: 4,
    backgroundColor: '#49489D',
    borderRadius: 4,
  },
});

export default SheetHandle;
