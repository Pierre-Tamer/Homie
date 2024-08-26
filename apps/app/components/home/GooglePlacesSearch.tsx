import { StyleSheet } from 'react-native';
import * as React from 'react';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import {
  GooglePlacesAutocomplete,
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';

type GooglePlacesSearchProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  mapRef: React.RefObject<MapView>;
};

const GooglePlacesSearch: React.FunctionComponent<GooglePlacesSearchProps> = ({
  bottomSheetRef,
  mapRef,
}) => {
  const onPressResult = (
    _data: GooglePlaceData,
    details: GooglePlaceDetail | null,
  ) => {
    bottomSheetRef.current?.snapToIndex(1);
    const { northeast, southwest } = details!.geometry.viewport;

    mapRef.current?.fitToCoordinates([
      { latitude: northeast.lat, longitude: northeast.lng },
      { latitude: northeast.lat, longitude: southwest.lng },
      { latitude: southwest.lat, longitude: southwest.lng },
      { latitude: southwest.lat, longitude: northeast.lng },
    ]);
  };

  return (
    <GooglePlacesAutocomplete
      placeholder="Search for a place or address"
      fetchDetails={true}
      onPress={onPressResult}
      enablePoweredByContainer={false}
      query={{
        key: 'AIzaSyBDO3QME4SPY4CCzy287ePpnv8EGC10IXc',
        language: 'en',
        components: 'country:eg',
      }}
      styles={{
        container: styles.container,
        listView: styles.listView,
        textInput: styles.textInput,
        row: styles.row,
        separator: styles.separator,
      }}
      textInputProps={{
        InputComp: BottomSheetTextInput,
      }}
      onFail={(err) => console.log(err)}
    />
  );
};

export default GooglePlacesSearch;

const styles = StyleSheet.create({
  textInput: {
    alignSelf: 'stretch',
    marginHorizontal: 12,
    marginBottom: 25,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E6E2FF',
    color: '#9E8FF2',
  },
  container: {
    flex: 0,
    // position: 'absolute',
    width: '100%',
    zIndex: 50,
  },
  listView: { backgroundColor: 'white' },
  row: { margin: 1 },
  separator: { margin: 5 },
});
