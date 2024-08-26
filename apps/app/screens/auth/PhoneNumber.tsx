import { StyleSheet, ActivityIndicator, Dimensions, Image } from 'react-native';
import { useFormik } from 'formik';
import { AuthCredentialsDto } from 'dto';
import { createValidator } from 'class-validator-formik';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { useMutation } from 'react-query';
import PhoneInput from 'react-native-phone-number-input';

import { View, Text, HideKeyboard } from '../../components/basic/Themed';
import { loginApi } from '../../api/auth';
import { useAuthStore } from '../../store/auth.store';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function PhoneNumberScreen() {
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);
  const setTokens = useAuthStore((state) => state.setTokens);

  const { isError, mutate, isLoading } = useMutation(loginApi, {
    onError: (err) => console.log(err),
    onSuccess: async (res) => {
      const { accessToken, refreshToken, iscompleteProfile, expAccessToken } =
        res.data;
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      setTokens(accessToken, expAccessToken, refreshToken);
      setIsSignedIn(true, false, iscompleteProfile);
    },
  });

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: { phoneNumber: '' },
    onSubmit: (values) => mutate(values),
    validate: createValidator(AuthCredentialsDto),
  });

  const phoneInput = React.useRef<PhoneInput>(null);

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
            <Text style={styles.title}>Phone Number</Text>
            <Text style={{ fontFamily: 'Poppins_300Light', color: '#9E8FF2' }}>
              Please enter your Country & your Phone Number
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#e6e2ff',
              padding: 15,
              borderRadius: 10,
            }}
          >
            <PhoneInput
              ref={phoneInput}
              defaultValue={values.phoneNumber}
              defaultCode="EG"
              layout="first"
              onChangeFormattedText={handleChange('phoneNumber')}
              autoFocus
              textContainerStyle={{
                backgroundColor: '#dad5ff',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              countryPickerButtonStyle={{
                backgroundColor: '#dad5ff',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 15,
              }}
              containerStyle={{
                backgroundColor: 'transparent',
                alignItems: 'center',
              }}
              textInputStyle={{
                color: '#978FFF',
                fontFamily: 'Poppins_400Regular',
              }}
              codeTextStyle={{
                color: '#978FFF',
                fontFamily: 'Poppins_400Regular',
              }}
            />
          </View>
          {touched.phoneNumber && errors.phoneNumber && (
            <Text>{errors.phoneNumber}</Text>
          )}

          <TouchableOpacity
            onPress={() => handleSubmit()}
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
                Log In
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {isLoading && (
            <ActivityIndicator size="small" animating={isLoading} />
          )}
          {isError && <Text>Login not valid</Text>}
        </View>
      </View>
    </HideKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F2F0FF',
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
