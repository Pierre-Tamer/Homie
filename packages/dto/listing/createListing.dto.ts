import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsPositive,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsGeoCoordinates } from './isGeoCoordinates.decorator';
import { LocationDto } from './location.dto';

export class CreateListingDto {
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(['RENT', 'SELL'])
  listingType: string;

  @IsNotEmptyObject()
  @IsObject()
  @IsGeoCoordinates({ message: 'not a valid location' })
  @Transform(({ value }) => JSON.parse(value))
  @Type(() => LocationDto)
  location: LocationDto;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  rooms: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  bathrooms: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  area: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  floor: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty({ message: 'title can not be empty' })
  @Length(2, 60, { message: 'title is too long or too short' })
  title: string;

  @IsNotEmpty({ message: 'description can not be empty' })
  @Length(2, 300, { message: 'description is too long or too short' })
  description: string;

  photos: any;
}
