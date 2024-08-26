import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useListingStore } from '../../store/listing.store';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Root', undefined>;
};
const Listing: React.FC<Props> = ({ navigation }) => {
  const selectedListing = useListingStore((state) => state.selectedListing);
  const setSelectedListing = useListingStore(
    (state) => state.setSelectedListing,
  );

  if (!selectedListing) return <Text>laoding...</Text>;

  // previous and next buttons for swiper
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

  const icons: any = {
    bathrooms: <FontAwesome name="bathtub" size={20} color="#49489D" />,
    area: <FontAwesome name="arrows" size={20} color="#49489D" />,
    floor: <MaterialCommunityIcons name="stairs" size={24} color="#49489D" />,
    rooms: <FontAwesome name="bed" size={24} color="#49489D" />,
  };

  function formatPriceInEGP(price: number): string {
    const formattedPrice = `EGP ${price
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return formattedPrice;
  }

  const {
    area,
    floor,
    rooms,
    bathrooms,
    photos,
    title,
    listingType,
    price,
    description,
  } = selectedListing;
  return (
    <View
      style={{
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        height: '100%',
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity
        style={{ paddingHorizontal: 10 }}
        onPress={() => setSelectedListing(null)}
      >
        <AntDesign name="arrowleft" size={24} color="#49489D" />
      </TouchableOpacity>
      <View style={{ height: 200 }}>
        <Swiper
          showsButtons={true}
          dotColor="#F2F0FF"
          activeDotColor="#49489D"
          prevButton={<PrevButton />}
          nextButton={<NextButton />}
        >
          {photos.map((photo, i) => (
            <View>
              <Image
                key={i}
                source={{ uri: photo.fullURL }}
                style={{ width: '100%', height: 200, borderRadius: 10 }}
                resizeMode="cover"
              />
            </View>
          ))}
        </Swiper>
      </View>
      <Text
        style={{
          color: '#49489D',
          fontSize: 24,
          fontFamily: 'Poppins_700Bold',
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: listingType === 'RENT' ? '#F888BA' : '#7572FB',
          width: 65,
          paddingVertical: 3,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <MaterialCommunityIcons name="home-search" size={24} color="white" />
        <Text style={{ color: 'white' }}>{listingType}</Text>
      </View>
      <Text
        style={{
          color: '#9E8FF2',
          fontFamily: 'Poppins_300Light',
        }}
      >
        {description}
      </Text>
      <View style={{ width: '100%', marginVertical: 10 }}>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={styles.detailContainer}>
            {icons.rooms}
            <Text style={styles.detailText}>{rooms} bedrooms</Text>
          </View>
          <View style={styles.detailContainer}>
            {icons.area}
            <Text style={styles.detailText}>{area} meters</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
          <View style={styles.detailContainer}>
            {icons.bathrooms}
            <Text style={styles.detailText}>{bathrooms} bathrooms</Text>
          </View>
          <View style={styles.detailContainer}>
            {icons.floor}
            <Text style={styles.detailText}>{floor} floor</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            backgroundColor: '#E6E2FF',
            flex: 1,
            marginHorizontal: 5,
            borderRadius: 10,
            paddingHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: '#49489D',
              fontSize: 18,
              fontFamily: 'Poppins_400Regular',
              marginVertical: 10,
            }}
          >
            {formatPriceInEGP(price)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('contactModal')}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={['#7572FB', '#A37EE5']}
            end={{ x: 0, y: 0 }}
            start={{ x: 1, y: 0 }}
            style={{
              backgroundColor: '#E6E2FF',
              flex: 1,
              marginHorizontal: 5,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontFamily: 'Poppins_700Bold' }}>
              CONTACT SELLER
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Listing;

const styles = StyleSheet.create({
  detailContainer: {
    backgroundColor: '#E6E2FF',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    color: '#9E8FF2',
    marginLeft: 10,
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
  },
});
