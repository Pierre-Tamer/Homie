import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import HomeMap from '../components/home/MapView';
import BottomSheet from '@gorhom/bottom-sheet';

import { View } from '../components/basic/Themed';

import Mapview from 'react-native-maps';
import HomeBottomSheet from '../components/home/BottomSheet';
import { AuthStackScreenProps } from '../types';
import { FontAwesome } from '@expo/vector-icons';
import { useListingStore } from '../store/listing.store';
import { AntDesign } from '@expo/vector-icons';
import { set } from 'react-native-reanimated';

type HomeScreenProps = {} & AuthStackScreenProps<'Root'>;
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const mapRef = React.useRef<Mapview>(null);

  const addListing = useListingStore((state) => state.addListing);
  const setAddListing = useListingStore((state) => state.setAddListing);

  const setSelectedLocation = useListingStore(
    (state) => state.setSelectedLocation,
  );

  return (
    <View style={[styles.container, { position: 'relative' }]}>
      <HomeMap mapRef={mapRef} />
      <TouchableOpacity
        onPress={() => {
          setSelectedLocation(null);
          setAddListing(!addListing);
        }}
        style={{
          backgroundColor: '#ffffff',
          position: 'absolute',
          top: 40,
          left: 20,
          width: 50,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 50,
        }}
      >
        {!addListing ? (
          <FontAwesome name="plus" size={24} color="#f888ba" />
        ) : (
          <AntDesign name="close" size={24} color="#f888ba" />
        )}
      </TouchableOpacity>
      <HomeBottomSheet
        bottomSheetRef={bottomSheetRef}
        mapRef={mapRef}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
