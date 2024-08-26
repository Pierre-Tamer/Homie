import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { useFormik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useListingStore } from '../store/listing.store';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'react-native';
import { TextInput } from '../components/basic/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from 'react-query';
import { createListingApi, getListingsApi } from '../api';
import { AxiosError } from 'axios';
import MultiSwitch from 'react-native-multiple-switch';
import { set } from 'react-native-reanimated';

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
};

const CreateListing = ({ bottomSheetRef }: Props) => {
  const selectedLocation = useListingStore((state) => state.selectedLocation);
  const setSelectedLocation = useListingStore(
    (state) => state.setSelectedLocation,
  );
  const setAddListing = useListingStore((state) => state.setAddListing);
  const setListings = useListingStore((state) => state.setListings);
  const fetchedRegion = useListingStore((state) => state.fetchedRegion);

  const [confirmLocation, setConfirmLocation] = React.useState(false);

  const reloadListings = useMutation(getListingsApi, {
    onError: (err) => console.log(err),
    onSuccess: (data) => {
      const { listings, polygon } = data.data;
      console.log(data.data);
      setListings(listings, polygon);
    },
  });

  const { mutate } = useMutation(createListingApi, {
    onError: (err: AxiosError) => console.log(err.response?.data),
    onSuccess: async () => {
      console.log('success');
      reloadListings.mutate(fetchedRegion!);
      setSelectedLocation(null);
      setAddListing(false);
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue } =
    useFormik({
      initialValues: {
        listingType: 'RENT',
        title: '',
        description: '',
        price: 0,
        floor: 1,
        rooms: 1,
        bathrooms: 1,
        area: 1,
        location: [0, 0],
        photos: [] as ImagePicker.ImageInfo[],
      },
      onSubmit: (values) => mutate(values as any),
      // validate: createValidator(CreateListingDto),
    });

  React.useEffect(() => {
    if (selectedLocation) {
      setFieldValue('location', selectedLocation);
    }
  }, [selectedLocation]);

  React.useEffect(() => {
    const getPermission = async () => {
      const picker = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!picker.granted) {
        alert('permisson denied!');
      }
    };
    getPermission();
  }, []);

  const pickImage = async () => {
    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [16, 9],
    });
    console.log(results);
    if (!results.cancelled) {
      setFieldValue('photos', [...values.photos, results]);
    }
  };

  if (!confirmLocation) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginRight: 15 }}>select a location</Text>
        <TouchableOpacity
          onPress={() => {
            if (selectedLocation) {
              setConfirmLocation(true);
              bottomSheetRef.current?.expand();
            }
          }}
          style={{
            backgroundColor: '#f888ba',
            width: 75,
            height: 35,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
        >
          <Text>confirm</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const PrevButton = () => (
    <View>
      <FontAwesome5 name="arrow-circle-left" size={24} color="#49489D" />
    </View>
  );

  const NextButton = () => (
    <View>
      <FontAwesome5 name="arrow-circle-right" size={24} color="#49489D" />
    </View>
  );

  return (
    <BottomSheetScrollView>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={pickImage}
          style={{
            backgroundColor: '#f888ba',
            width: 85,
            height: 35,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white' }}>add photos</Text>
        </TouchableOpacity>

        <View style={{ height: 200 }}>
          <Swiper
            showsButtons={true}
            dotColor="#F2F0FF"
            activeDotColor="#49489D"
            prevButton={<PrevButton />}
            nextButton={<NextButton />}
          >
            {values.photos.map((photo) => (
              <View>
                <Image
                  key={photo.uri}
                  source={{ uri: photo.uri }}
                  style={{ width: '100%', height: 200, borderRadius: 10 }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        </View>
        <MultiSwitch
          items={['RENT', 'SELL']}
          value={values.listingType}
          onChange={(val) => setFieldValue('listingType', val)}
          mediumHeight
          containerStyle={{
            backgroundColor: '#e6e2ff',
          }}
          sliderStyle={{
            backgroundColor: '#8c78f0',
          }}
          activeTextStyle={{
            color: 'white',
          }}
        />
        <TextInput
          title="title"
          style={{ backgroundColor: '#e6e2ff' }}
          placeholder="short title"
          onChangeText={handleChange('title')}
          onBlur={handleBlur('title')}
          value={values.title}
        />
        <TextInput
          title="description"
          style={{ backgroundColor: '#e6e2ff' }}
          placeholder="long description"
          onChangeText={handleChange('description')}
          onBlur={handleBlur('description')}
          value={values.description}
        />
        <TextInput
          title="price"
          style={{ backgroundColor: '#e6e2ff' }}
          placeholder="price"
          keyboardType="numeric"
          onChangeText={handleChange('price')}
          onBlur={handleBlur('price')}
          value={values.price.toString()}
        />
        <TextInput
          title="floor"
          style={{ backgroundColor: '#e6e2ff' }}
          placeholder="floor"
          keyboardType="numeric"
          onChangeText={handleChange('floor')}
          onBlur={handleBlur('floor')}
          value={values.floor.toString()}
        />
        <TextInput
          title="rooms"
          style={{ backgroundColor: '#e6e2ff' }}
          placeholder="rooms"
          keyboardType="numeric"
          onChangeText={handleChange('rooms')}
          onBlur={handleBlur('rooms')}
          value={values.rooms.toString()}
        />
        <TextInput
          title="bathrooms"
          style={{ backgroundColor: '#e6e2ff' }}
          placeholder="bathrooms"
          keyboardType="numeric"
          onChangeText={handleChange('bathrooms')}
          onBlur={handleBlur('bathrooms')}
          value={values.bathrooms.toString()}
        />
        <TextInput
          title="area"
          style={{ backgroundColor: '#e6e2ff' }}
          placeholder="area"
          keyboardType="numeric"
          onChangeText={handleChange('area')}
          onBlur={handleBlur('area')}
          value={values.area.toString()}
        />
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
              paddingVertical: 10,
              width: '90%',
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
              Create
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </BottomSheetScrollView>
  );
};

export default CreateListing;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    height: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
});
