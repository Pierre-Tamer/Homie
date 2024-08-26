import { RegionDto, GetListingsResponseDto, CreateListingDto } from 'dto';
import { Axios } from './axios';

export const getListingsApi = async (region: RegionDto) => {
  return Axios.post<GetListingsResponseDto>('/listing/get', region);
};

export const createListingApi = async (data: CreateListingDto) => {
  const payload = new FormData() as any;

  payload.append('listingType', 'SELL');
  payload.append(
    'location',
    JSON.stringify({
      type: 'Point',
      coordinates: data.location,
    }),
  );
  payload.append('rooms', data.rooms);
  payload.append('bathrooms', data.bathrooms);
  payload.append('area', data.area);
  payload.append('floor', data.floor);
  payload.append('price', data.price);
  payload.append('title', data.title);
  payload.append('description', data.description);

  if (data.photos) {
    for (const photo of data.photos) {
      let filename = photo.uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);

      payload.append('photos', {
        uri: photo.uri,
        type: match ? `image/${match[1]}` : `image`,
        name: photo.uri.split('/').pop(),
      });
    }
  }

  return Axios.post<void>('/listing/create', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: () => {
      return payload;
    },
  });
};
