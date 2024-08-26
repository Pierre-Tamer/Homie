import { Text, View } from 'react-native';
import React from 'react';
import { useListingStore } from '../../store/listing.store';
import ListingCard from './listingCard';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useMutation } from 'react-query';
import { getListingsApi } from '../../api';

const ListingList = () => {
  const listings = useListingStore((state) => state.listings);

  const setListings = useListingStore((state) => state.setListings);

  const fetchedRegion = useListingStore((state) => state.fetchedRegion);

  const { mutate, isLoading } = useMutation(getListingsApi, {
    onError: (err) => console.log(err),
    onSuccess: (data) => {
      const { listings, polygon } = data.data;
      console.log(data.data);
      setListings(listings, polygon);
    },
  });

  if (!listings) return <Text>loading...</Text>;

  return (
    <View>
      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        data={listings}
        keyExtractor={(listing) => listing._id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        ListFooterComponent={
          <View style={{ height: 50, backgroundColor: 'transparent' }} />
        }
        refreshing={isLoading}
        onRefresh={() => mutate(fetchedRegion!)}
      />
    </View>
  );
};

export default ListingList;
