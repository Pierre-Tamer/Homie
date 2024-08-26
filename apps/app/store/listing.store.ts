import create from 'zustand';
import { ListingResponseDto, RegionDto } from 'dto';

type listingStore = {
  listings: ListingResponseDto[] | null;
  polygon: number[][] | null;
  selectedListing: ListingResponseDto | null;
  setListings: (listings: ListingResponseDto[], polygon: number[][]) => void;
  setSelectedListing: (listing: ListingResponseDto | null) => void;
  fetchedRegion: RegionDto | null;
  setRegion: (region: RegionDto) => void;

  addListing: boolean;
  selectedLocation: number[] | null;
  setAddListing: (addListing: boolean) => void;
  setSelectedLocation: (location: number[] | null) => void;
};

export const useListingStore = create<listingStore>((set) => ({
  listings: null,
  polygon: null,
  setListings: (listings, polygon) => set({ listings, polygon }),
  selectedListing: null,
  setSelectedListing: (selectedListing) => set({ selectedListing }),
  fetchedRegion: null,
  setRegion: (fetchedRegion) => set({ fetchedRegion }),

  addListing: false,
  selectedLocation: null,
  setAddListing: (addListing) => set({ addListing }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
}));
