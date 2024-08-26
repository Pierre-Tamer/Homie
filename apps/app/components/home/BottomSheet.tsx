import { StyleSheet } from 'react-native';
import * as React from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import SheetHandle from '../../components/home/SheetHandle';
import MapView from 'react-native-maps';
import GooglePlacesSearch from './GooglePlacesSearch';
import ListingList from './listingsList';
import { useListingStore } from '../../store/listing.store';
import Listing from './Listing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import CreateListing from '../../screens/createListing';

type HomeBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  mapRef: React.RefObject<MapView>;
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Root', undefined>;
};
const HomeBottomSheet: React.FunctionComponent<HomeBottomSheetProps> = ({
  bottomSheetRef,
  mapRef,
  navigation,
}) => {
  const selectedListing = useListingStore((state) => state.selectedListing);
  const addListing = useListingStore((state) => state.addListing);

  const snapPoints = ['15%', '30%', '95%'];

  React.useEffect(() => {
    if (selectedListing) {
      bottomSheetRef.current?.expand();
    }
  }, [selectedListing]);

  React.useEffect(() => {
    if (addListing) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [addListing]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleComponent={SheetHandle}
      keyboardBehavior="extend"
    >
      <BottomSheetView style={styles.contentContainer}>
        {addListing ? (
          <CreateListing bottomSheetRef={bottomSheetRef} />
        ) : !selectedListing ? (
          <>
            <GooglePlacesSearch
              mapRef={mapRef}
              bottomSheetRef={bottomSheetRef}
            />
            <ListingList />
          </>
        ) : (
          <Listing navigation={navigation} />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default HomeBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F2F0FF',
  },
});
