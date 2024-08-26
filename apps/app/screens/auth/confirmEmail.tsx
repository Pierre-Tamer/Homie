import { Dimensions, Image, StyleSheet, TextInput } from 'react-native';
import { useFormik } from 'formik';

import {
  View,
  Text,
  Button,
  HideKeyboard,
} from '../../components/basic/Themed';
import { useAuthStore } from '../../store/auth.store';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConfirmMailScreen() {
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);
  const isCompleteProfile = useAuthStore((state) => state.isCompleteProfile);

  const handleVerify = () => {
    console.log(true, true, isCompleteProfile);
    setIsSignedIn(true, true, isCompleteProfile);
  };

  return (
    <HideKeyboard>
      <View style={styles.container}>
        <View style={{ backgroundColor: '#D7CDFF' }}>
          <Image
            source={require('../../assets/auth_bg.png')}
            style={{
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height * 0.36,
            }}
            resizeMode="contain"
          />
        </View>
        {/* <SvgUri uri={require('../../assets/auth_bg.svg')} /> */}
        <View
          style={{
            backgroundColor: 'transparent',
            alignItems: 'center',
            marginTop: 30,
            flex: 1,
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: 'transparent',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={styles.title}>Verify Phone Number</Text>
            <Text style={{ fontFamily: 'Poppins_300Light', color: '#9E8FF2' }}>
              Please enter the code sent to your phone number
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#e6e2ff',
              padding: 15,
              borderRadius: 10,
            }}
          >
            <TextInput
              placeholder="Enter Code"
              style={{
                width: Dimensions.get('screen').width * 0.8,
                height: 50,
                backgroundColor: '#e6e2ff',
                fontFamily: 'Poppins_700Bold',
                fontSize: 24,
                color: '#49489D',
              }}
              placeholderTextColor="#9E8FF2"
              keyboardType="number-pad"
              textAlign="center"
              maxLength={4}
            />
          </View>

          <TouchableOpacity
            onPress={() => handleVerify()}
            style={{
              width: Dimensions.get('screen').width,
              alignItems: 'center',
            }}
          >
            <LinearGradient
              colors={['#7371FC', '#A57EE3']}
              end={{ x: 0, y: 0 }}
              start={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 15,
                width: '88%',
                borderRadius: 10,
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 18,
                }}
              >
                Verify
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </HideKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: 'Poppins_700Bold',
    color: '#49489D',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  input: {
    width: 250,
    height: 30,
  },
});
