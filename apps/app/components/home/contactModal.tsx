import { Dimensions, Linking, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AuthStackScreenProps } from '../../types';
import { useListingStore } from '../../store/listing.store';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

type Props = {} & AuthStackScreenProps<'contactModal'>;

const ContactModal = ({ navigation }: Props) => {
  const selectedListing = useListingStore((state) => state.selectedListing);

  const handlePhonePress = () => {
    const url = `tel:${selectedListing?.user.phoneNumber}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Clipboard.setString(selectedListing?.user.phoneNumber!);
      }
    });
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F0FF',
      }}
    >
      <Text style={{ fontSize: 24 }}>Contact the seller</Text>
      <View
        style={{
          backgroundColor: '#e6e2ff',
          padding: 15,
          borderRadius: 10,
          width: Dimensions.get('screen').width * 0.8,
          marginVertical: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{selectedListing?.user.fullName}</Text>
        <Text style={{ fontSize: 18 }}>
          {selectedListing?.user.phoneNumber}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handlePhonePress()}
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
            Call Seller
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          width: Dimensions.get('screen').width,
          alignItems: 'center',
        }}
      >
        <LinearGradient
          colors={['#555', '#666']}
          end={{ x: 0, y: 0 }}
          start={{ x: 1, y: 0 }}
          style={{
            paddingVertical: 10,
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
            Close
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default ContactModal;

const styles = StyleSheet.create({});
