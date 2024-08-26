import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useFormik } from 'formik';
import { createValidator } from 'class-validator-formik';
import { useMutation } from 'react-query';
import * as React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { createProfileDto } from 'dto';
import moment from 'moment';

import {
  View,
  Text,
  TextInput,
  HideKeyboard,
} from '../../components/basic/Themed';
import { createProfileApi } from '../../api';
import { useAuthStore } from '../../store/auth.store';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpStep2Screen() {
  const [showDate, setShowDate] = React.useState(false);
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);

  React.useEffect(() => {
    const getPermission = async () => {
      const picker = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!picker.granted) {
        alert('permisson denied!');
      }
    };
    getPermission();
  }, []);

  const createProfile = useMutation(createProfileApi, {
    onError: (err: AxiosError) => console.log(err.response?.data),
    onSuccess: async () => {
      setIsSignedIn(true, true, true);
    },
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      birthDay: '',
      photo: null as ImagePicker.ImageInfo | null,
    },
    onSubmit: (values) => createProfile.mutate(values),
    validate: createValidator(createProfileDto),
  });

  const pickImage = async () => {
    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    console.log(results);
    if (!results.cancelled) {
      setFieldValue('photo', results);
    }
  };

  const handleDatePicked = (date: Date) => {
    setFieldValue('birthDay', date.toISOString());
    setShowDate(false);
  };

  return (
    <HideKeyboard>
      <View style={[styles.container, { position: 'relative' }]}>
        <View style={{ position: 'absolute', backgroundColor: 'transparent' }}>
          <Image
            source={require('../../assets/profile_bg.png')}
            style={{
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height * 0.4,
              top: 0,
              left: 0,
            }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
            <Image
              source={
                values.photo
                  ? { uri: values.photo.uri }
                  : require('../../assets/add_photo.png')
              }
              style={{
                width: 150,
                height: 150,
                borderRadius: 150 / 2,
                overflow: 'hidden',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: '#e6e2ff',
              padding: 15,
              borderRadius: 10,
              width: Dimensions.get('screen').width * 0.8,
            }}
          >
            <TextInput
              title="First Name"
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              style={{ height: 40 }}
              placeholder="your first name"
              multiline={true}
              maxLength={280}
              returnKeyType="done"
              blurOnSubmit={true}
              enablesReturnKeyAutomatically={true}
            />
            {touched.firstName && errors.firstName && (
              <Text>{errors.firstName}</Text>
            )}
            <TextInput
              title="Last Name"
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
              style={{ height: 40 }}
              placeholder="your last name"
              multiline={true}
              maxLength={280}
              returnKeyType="done"
              blurOnSubmit={true}
              enablesReturnKeyAutomatically={true}
            />
            {touched.lastName && errors.lastName && (
              <Text>{errors.lastName}</Text>
            )}
            <View style={styles.dateView}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                }}
              >
                <Text style={styles.small}>Birthday: </Text>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setShowDate(true)}
                >
                  <Text style={{ color: '#49489D' }}>
                    {values.birthDay !== ''
                      ? moment(values.birthDay).format('MMM D, YYYY')
                      : 'Pick date'}
                  </Text>
                </TouchableOpacity>
              </View>
              {showDate && (
                <DateTimePicker
                  isVisible={showDate}
                  onConfirm={handleDatePicked}
                  onCancel={() => setShowDate(false)}
                />
              )}
            </View>
          </View>
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
                width: '80%',
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
                Complete Sign Up
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
    backgroundColor: '#f2f0ff',
  },
  dateView: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
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
  small: {
    color: '#000',
  },
});
