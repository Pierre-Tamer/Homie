import { UserResponseDto } from '../profile/userResponse.dto';
import { PhotoDto } from '../photo/photoResponse.dto';
import { LocationDto } from './location.dto';

export class ListingResponseDto {
  _id: string;

  user: UserResponseDto;

  location: LocationDto;

  listingType: 'RENT' | 'SELL';

  photos: PhotoDto[];

  rooms: number;

  bathrooms: number;

  area: number;

  price: number;

  floor: number;

  title: string;

  description: string;
}
