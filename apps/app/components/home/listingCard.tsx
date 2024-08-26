import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import { ListingResponseDto } from 'dto';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useListingStore } from '../../store/listing.store';

type Props = { listing: ListingResponseDto };

const ListingCard = ({ listing }: Props) => {
  const { area, floor, rooms, bathrooms, photos, title, listingType, price } =
    listing;
  const tags = [
    {
      type: 'area',
      value: area,
    },
    {
      type: 'floor',
      value: floor,
    },
    {
      type: 'rooms',
      value: rooms,
    },
    {
      type: 'bathrooms',
      value: bathrooms,
    },
  ];

  const icons: any = {
    bathrooms: <FontAwesome name="bathtub" size={20} color="#49489D" />,
    area: (
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#49489D' }}>
        m²
      </Text>
    ),
    floor: <MaterialCommunityIcons name="stairs" size={20} color="#49489D" />,
    rooms: <FontAwesome name="bed" size={20} color="#49489D" />,
  };

  function formatPriceInEGP(price: number): string {
    const formattedPrice = `EGP ${price
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return formattedPrice;
  }

  const setSelectedListing = useListingStore(
    (state) => state.setSelectedListing,
  );

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedListing(listing)}>
      <View style={styles.card}>
        <Image source={{ uri: photos[0].fullURL }} style={styles.thumbnail} />
        <View
          style={{
            paddingVertical: 10,
            justifyContent: 'space-between',
            width: '100%',
            height: 140,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Poppins_700Bold',
              color: '#49489D',
            }}
          >
            {title}
          </Text>
          <View
            style={{
              backgroundColor: listingType === 'RENT' ? '#F888BA' : '#7572FB',
              width: 45,
              borderRadius: 5,
              alignItems: 'center',
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 12, color: 'white' }}>{listingType}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {tags.map((tag, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  marginRight: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ marginRight: 5, color: '#9E8FF2' }}>
                  {tag.value}
                </Text>
                {icons[tag.type]}
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#49489D' }}>
            {formatPriceInEGP(price)}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListingCard;

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width * 0.92,
    backgroundColor: '#e6e2ff',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 0.5,

    elevation: 1,
    marginBottom: 25,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: 140,
    height: 140,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    resizeMode: 'cover',
    marginRight: 10,
  },
});
