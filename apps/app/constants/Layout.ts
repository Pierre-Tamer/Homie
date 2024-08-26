import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default {
  window: {
    width,
    height,
  },
  screen: {
    width: screenWidth,
    height: screenHeight,
  },
  isSmallDevice: width < 375,
};
