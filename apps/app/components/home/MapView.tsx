import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import Mapview, {
  LatLng,
  MapEvent,
  Marker,
  Polygon,
  Region,
} from 'react-native-maps';
import mapStyle from '../../assets/mapStyle';
import Layout from '../../constants/Layout';
import * as Location from 'expo-location';
import { useMutation } from 'react-query';
import { getListingsApi } from '../../api/listing';
import { useListingStore } from '../../store/listing.store';
import { isRegionInsideRegion } from '../../utils/isSameRegion';
import { useAssets } from 'expo-asset';

export type MapViewProps = {
  mapRef: React.RefObject<Mapview>;
};

const HomeMap: React.FunctionComponent<MapViewProps> = ({
  mapRef,
}: MapViewProps) => {
  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);

  const { listings, setListings, polygon, setRegion } = useListingStore();

  const { mutate } = useMutation(getListingsApi, {
    onError: (err) => console.log(err),
    onSuccess: (data) => {
      const { listings, polygon } = data.data;
      console.log(data.data);
      setListings(listings, polygon);
    },
  });

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Balanced,
      });

      setLocation(location);
    })();
  }, []);

  const onRegionChange = (region: Region) => {
    if (!polygon || !isRegionInsideRegion(region, polygon)) {
      console.log('fetch');
      const regionData = {
        lat: region.latitude,
        lng: region.longitude,
        latDelta: region.latitudeDelta,
        lngDelta: region.longitudeDelta,
      };
      mutate(regionData);
      setRegion(regionData);
    } else {
      console.log('no fetch');
    }
  };

  const drawPolygon = (c: number[][]): LatLng[] => {
    const a: LatLng[] = [];
    for (const d of c) {
      a.push({
        longitude: d[0],
        latitude: d[1],
      });
    }
    return a;
  };

  const [assets] = useAssets([
    require('../../assets/markers/rent-pin.png'),
    require('../../assets/markers/sell-pin.png'),
  ]);

  const setSelectedListing = useListingStore(
    (state) => state.setSelectedListing,
  );

  const addListing = useListingStore((state) => state.addListing);
  const selectedLocation = useListingStore((state) => state.selectedLocation);
  const setSelectedLocation = useListingStore(
    (state) => state.setSelectedLocation,
  );

  const handleMapPress = (e: MapEvent) => {
    if (addListing) {
      setSelectedLocation([
        e.nativeEvent.coordinate.longitude,
        e.nativeEvent.coordinate.latitude,
      ]);
      console.log(e.nativeEvent.coordinate);
    }
  };

  return (
    location && (
      <Mapview
        ref={mapRef}
        onPress={handleMapPress}
        camera={{
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          zoom: 15,
          altitude: location.coords.altitude || 0,
          heading: location.coords.heading || 0,
          pitch: 0,
        }}
        showsCompass={false}
        style={styles.map}
        provider="google"
        customMapStyle={mapStyle}
        onRegionChangeComplete={onRegionChange}
      >
        {!addListing && (
          <Marker
            coordinate={{
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            }}
          />
        )}
        {addListing && selectedLocation && (
          <Marker
            coordinate={{
              longitude: selectedLocation[0],
              latitude: selectedLocation[1] as any,
            }}
          />
        )}
        {listings &&
          listings.map((listing) => (
            <Marker
              key={listing._id}
              onPress={() => setSelectedListing(listing)}
              coordinate={{
                longitude: listing.location.coordinates[0],
                latitude: listing.location.coordinates[1],
              }}
            >
              <Image
                source={{
                  uri:
                    listing.listingType === 'RENT'
                      ? assets![0].uri
                      : assets![1].uri,
                }}
                style={{ width: 34, height: 38 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
        {polygon && <Polygon coordinates={drawPolygon(polygon)} />}
      </Mapview>
    )
  );
};

export default HomeMap;

const styles = StyleSheet.create({
  map: {
    width: Layout.screen.width,
    height: Layout.screen.height,
  },
});
