import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class RegionDto {
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLatitude()
  latDelta: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @IsNotEmpty()
  @IsLongitude()
  lngDelta: number;
}
