import { ListingResponseDto } from './listingResponse';

export class GetListingsResponseDto {
  listings: ListingResponseDto[];
  polygon: number[][];
}
